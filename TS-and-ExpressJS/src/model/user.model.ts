import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from 'config';

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  // eslint-disable-next-line no-unused-vars
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function pre(next) {
  const user = this as UserDocument;

  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(config.get('saltWorkFactor'));
  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;
  return next();
});

UserSchema.methods.comparePassword = async function comparePassword(candidatePassword: string) {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;
