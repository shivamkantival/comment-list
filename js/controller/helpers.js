import { getRandomProfile } from "mockHelpers";

export function createComment(commentText, parentCommentId) {
  const comment = {};

  comment.profile = getRandomProfile();
  comment.text = commentText;
  comment.numberOfDislikes = 0;
  comment.numberOfLikes = 0;
  comment.parentCommentId = parentCommentId;

  return comment;
}

export default {
  createComment,
};
