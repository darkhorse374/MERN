import { Omit, get } from 'lodash';
import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import config from 'config';
import { JwtPayload } from 'jsonwebtoken';
import UserSession, { SessionDocument } from '@src/model/session.model';
import { UserDocument } from '@src/model/user.model';
import { sign, decode } from '@src/utils/jwt.utils';
import { findUser } from '@src/service/user.service';

export async function createUserSession(userId: string, userAgent: string) {
  const session = await UserSession.create({ user: userId, userAgent });
  return session.toJSON();
}

export function createAccessToken({
  user,
  session,
}: {
  user: Omit<UserDocument, 'password'> | LeanDocument<Omit<UserDocument, 'password'>>;
  session: Omit<SessionDocument, 'password'> | LeanDocument<Omit<SessionDocument, 'password'>>;
}) {
  // Build and return a new access token
  const accessToken = sign({ ...user, session: session.id }, { expiresIn: config.get('accessTokenTTL') });
  return accessToken;
}

export function createRefreshToken({
  session,
}: {
  session: Omit<SessionDocument, 'password'> | LeanDocument<Omit<SessionDocument, 'password'>>;
}) {
  const refreshToken = sign(session, {
    expiresIn: config.get('refreshTokenTTL'),
  });
  return refreshToken;
}

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
  // Decode the refresh token
  const decodedData: {
    valid: boolean;
    expired: boolean;
    decoded: string | JwtPayload;
  } = decode(refreshToken);

  if (!decodedData.decoded || !get(decodedData.decoded, '_id')) {
    return false;
  }

  // Get the session
  const session = await UserSession.findById(get(decodedData.decoded, '_id'));

  // Make sure the session is still valid
  if (!session || !session?.valid) {
    return false;
  }

  const user = await findUser({ _id: session.user });
  if (!user) {
    return false;
  }

  const accessToken = createAccessToken({ user, session });
  return accessToken;
}

export async function updateSession(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
  return UserSession.updateOne(query, update);
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return UserSession.find(query).lean();
}
