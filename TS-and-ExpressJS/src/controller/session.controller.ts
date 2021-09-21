import { Request, Response } from 'express';
import { validatePassword } from '@src/service/user.service';
import { createUserSession, createAccessToken, createRefreshToken } from '@src/service/session.service';

export async function createUserSessionHandler(req: Request, res: Response) {
  try {
    // validate the email and password
      const user = await validatePassword(req.body);
      if (!user)
          return res.status(401).send('Invalid username / password');
      
    // create a session
      const session = await createUserSession(user._id, req.get('user-agent') || '');

    // create an access token
      const accessToken = createAccessToken({
          user,
          session
      });

    // create a refresh token
      const refreshToken = createRefreshToken({ session });
      
    // send the created access and refresh token back to the user
      return res.status(200).send({ accessToken, refreshToken });
  } catch (error) {}
}
