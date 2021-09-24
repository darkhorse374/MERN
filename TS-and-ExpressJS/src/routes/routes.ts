import { Express, Request, Response } from 'express';
import createUserHandler from '@src/controller/user.controller';
import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionsHandler,
} from '@src/controller/session.controller';
import {
  createPostHandler,
  getPostHandler,
  updatePostHandler,
  deletePostHandler,
} from '@src/controller/post.controller';
import validate from '@src/middleware/validateRequest';
import createUserSchema from '@src/schema/user.schema';
import createUserSessionSchema from '@src/schema/session.schema';
import { createPostSchema, updatePostSchema, deletePostSchema } from '@src/schema/post.schema';
import requiresUser from '@src/middleware/requiresUser';

export default function (app: Express) {
  // API to check application health
  app.get('/health', (req: Request, res: Response) => res.sendStatus(200));

  // API to register a user
  app.post('/api/users', validate(createUserSchema), createUserHandler);

  // API for user login
  app.post('/api/sessions', validate(createUserSessionSchema), createUserSessionHandler);

  // API to get a user's sessions
  app.get('/api/sessions', requiresUser, getUserSessionsHandler);

  // API to logout a user
  app.delete('/api/sessions', requiresUser, invalidateUserSessionHandler);

  // Create a post
  app.post('/api/posts', [requiresUser, validate(createPostSchema)], createPostHandler);

  // Get a post
  app.get('api/posts/:postId', getPostHandler);

  // Update a post
  app.put('/api/posts/:postId', [requiresUser, validate(updatePostSchema)], updatePostHandler);

  // Delete a post
  app.delete('/api/posts', [requiresUser, validate(deletePostSchema)], deletePostHandler);
}
