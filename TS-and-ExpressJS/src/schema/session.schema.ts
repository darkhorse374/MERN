import { object, string, ref } from 'yup';

export const createUserSessionSchema = object({
  bosy: object({
    password: string()
      .required('Password is required.')
      .min(6, 'Password is too short, should be at least 6 characters.')
      .matches(/^[a-zA-Z0-9_.-]*$/, 'Password can only contain Latin characters.'),
    email: string().email('Must be a valid email').required('Email is required'),
  }),
});
