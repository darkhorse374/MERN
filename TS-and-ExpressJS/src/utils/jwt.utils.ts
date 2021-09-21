import config from 'config';
import jwt from 'jsonwebtoken';
import log from '@src/logger/logger';
import dotenv from 'dotenv-safe';

dotenv.config({ path: './.env' });

const privateKey = `${ process.env.privateKey }`.replace(/\\n/g, '\n') as string;

export function sign(object: Object, options?: jwt.SignOptions | undefined) {
    return jwt.sign(object, privateKey, options);

}