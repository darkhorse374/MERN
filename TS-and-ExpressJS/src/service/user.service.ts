import User, { UserDocument } from '@src/model/user.model';
import { omit } from 'lodash';
import { DocumentDefinition } from 'mongoose';

export async function createUser(newUser: DocumentDefinition<UserDocument>) {
  try {
    return await User.create(newUser);
  } catch (error) {
    throw new Error(String(error));
  }
}

export async function validatePassword({ email, password }: { email: UserDocument['email']; password: string }) {
  const user = await User.findOne({ email });
  if (!user) return false;

  const isValid = await user.comparePassword(password);
  if (!isValid) return false;

  return omit(user.toJSON(), 'password');
}
