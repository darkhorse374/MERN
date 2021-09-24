import { object, string } from 'yup';

const payload = {
  body: object({
    title: string().required('Title is required.'),
    body: string()
      .required('Body is required.')
      .min(120, 'Body is too short - should be minimum of 120 characters in length.'),
  }),
};

const params = {
  params: object({
    postId: string().required('postId is required'),
  }),
};

export const createPostSchema = object({
  ...payload,
});

export const updatePostSchema = object({
  ...payload,
  ...params,
});

export const deletePostSchema = object({
  ...params,
});
