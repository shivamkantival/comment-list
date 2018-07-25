import _property from 'lodash/property';

export const id = _property('id');

export const profile = _property('profile');

export const text = _property('text');

export const numberOfDislikes = comment => comment.numberOfDislikes || 0;

export const numberOfLikes = comment => comment.numberOfLikes || 0;

export const parentCommentId = comment => comment.parentCommentId;

export default {
  id,
  profile,
  text,
  numberOfDislikes,
  numberOfLikes,
  parentCommentId,
};
