import UserSession, { SessionDocument } from "@src/model/session.model";
import { UserDocument } from "@src/model/user.model";
import { sign } from '@src/utils/jwt.utils';
import { Omit } from "lodash";
import { LeanDocument } from "mongoose";
import config from 'config';

export async function createUserSession(userId: string, userAgent: string) {
    const session = await UserSession.create({ user: userId, userAgent });
    return session.toJSON();
}

export function createAccessToken({
    user,
    session,
}: {
        user:
        | Omit<UserDocument, 'password'>
        | LeanDocument<Omit<UserDocument, 'password'>>;
        session:
        | Omit<SessionDocument, 'password'>
        | LeanDocument<Omit<SessionDocument, 'password'>>;
    }) {
    // Build and return a new access token
    const accessToken = sign(
        { ...user, session: session._id },
        { expiresIn: config.get('accessTokenTTL') }
    );
    return accessToken;
}

export function createRefreshToken({
  session,
}: {
    session:
    | Omit<SessionDocument, 'password'>
    | LeanDocument<Omit<SessionDocument, 'password'>>;
}) {
  const refreshToken = sign(session, {
    expiresIn: config.get('refreshTokenTTL'),
  });
    return refreshToken;
}