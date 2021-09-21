import { Request, Response } from 'express';
import { createUser } from '@src/service/user.service';
import { omit } from 'lodash';

export async function createUserHandler(req: Request, res: Response) {
    try {
        const user = await createUser(req.body);
        return res.send(omit(user.toJSON(), 'password'));
    } catch (error) {
        return res.status(409).send(error);
    }
}