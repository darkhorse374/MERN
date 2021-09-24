import { get } from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { decode } from '@src/utils/jwt.utils';
import { reIssueAccessToken } from '@src/service/session.service';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');
  const refreshToken = get(req, 'headers.x-refresh');

  if (!accessToken) return next();

  const decodedData: {
    valid: boolean;
    expired: boolean;
    decoded: string | JwtPayload;
  } = decode(accessToken);

  if (decodedData.decoded) {
    // @ts-ignore
    req.user = decodedData.decoded;
    return next();
  }

  if (decodedData.expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
      // @ts-ignore
      req.user = decode(newAccessToken)?.decoded;
    }
    return next();
  }
  return next();
};

export default deserializeUser;
