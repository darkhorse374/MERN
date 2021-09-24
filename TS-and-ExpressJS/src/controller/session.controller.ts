import { Request, Response } from 'express';
import { get } from 'lodash';
import { validatePassword } from '@src/service/user.service';
import {
  createUserSession,
  createAccessToken,
  createRefreshToken,
  updateSession,
  findSessions,
} from '@src/service/session.service';
import log from '@src/logger/logger';

export async function createUserSessionHandler(req: Request, res: Response) {
  try {
    // validate the email and password
    const user = await validatePassword(req.body);
    if (!user) return res.status(401).send('Invalid username / password');

    // create a session
    // eslint-disable-next-line no-underscore-dangle
    const userId = get(user, '_id');
    const session = await createUserSession(userId, req.get('user-agent') || '');

    // create an access token
    const accessToken = createAccessToken({
      user,
      session,
    });

    // create a refresh token
    const refreshToken = createRefreshToken({ session });

    // send the created access and refresh token back to the user
    return res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    log.error(String(error));
    return null;
  }
}

export async function invalidateUserSessionHandler(req: Request, res: Response) {
  const sessionId = get(req, 'user.session');
  await updateSession({ _id: sessionId }, { valid: false });
  return res.sendStatus(200);
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = get(req, 'user._id');
  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions);
}
