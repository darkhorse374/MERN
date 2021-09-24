import jwt from 'jsonwebtoken';
import dotenv from 'dotenv-safe';
import log from '@src/logger/logger';

dotenv.config({ path: './.env' });

const privateKey = `${process.env.privateKey}`.replace(/\\n/g, '\n') as string;

export function sign(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, options);
}

export function decode(token: string) {
  try {
    const decoded = jwt.verify(token, privateKey);
    return { valid: true, expired: false, decoded };
  } catch (error: any) {
    log.error(String(error));
    return { valid: false, expired: true, decoded: '' };
  }
}
