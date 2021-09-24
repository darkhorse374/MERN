import jwt from 'jsonwebtoken';
import dotenv from 'dotenv-safe';

dotenv.config({ path: './.env' });

const privateKey = `${process.env.privateKey}`.replace(/\\n/g, '\n') as string;

const sign = function sign(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, options);
};

export default sign;
