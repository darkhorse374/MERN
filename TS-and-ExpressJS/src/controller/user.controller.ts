import { Request, Response } from 'express';
import { omit } from 'lodash';
import { createUser } from '@src/service/user.service';

const createUserHandler = async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), 'password'));
  } catch (error) {
    return res.status(409).send(error);
  }
};

export default createUserHandler;
