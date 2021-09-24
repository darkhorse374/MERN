import { omit } from 'lodash';
import { DocumentDefinition, FilterQuery } from 'mongoose';
import User, { UserDocument } from '@src/model/user.model';

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

export async function findUser(query: FilterQuery<UserDocument>) {
  return User.findOne(query).lean();
}
