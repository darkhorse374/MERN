import { object, string } from 'yup';

const createUserSessionSchema = object({
  body: object({
    password: string()
      .required('Password is required.')
      .min(6, 'Password is too short, should be at least 6 characters.')
      .matches(/^[a-zA-Z0-9_.-]*$/, 'Password can only contain Latin characters.'),
    email: string().email('Must be a valid email').required('Email is required'),
  }),
});

export default createUserSessionSchema;
