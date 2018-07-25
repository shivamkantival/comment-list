//utils
import _groupBy from 'lodash/groupBy';
import _some from 'lodash/some';
import _findIndex from 'lodash/findIndex';

//reader
import commentReader from 'beanReaders/comment';

export const COMMENT_IN_REPLY = 'COMMENT_IN_REPLY',
  PARENT_COMMENT = 'PARENT_COMMENT';

export function isCommentInReply(comment) {
  return !!commentReader.parentCommentId(comment);
}

export function categoriseComments(commentList) {
  return _groupBy(commentList, function(comment) {
    return isCommentInReply(comment) ? COMMENT_IN_REPLY : PARENT_COMMENT;
  });
}

export function getCommentCategoryAndIndex(categoriseComments = {}, commentId) {
  let category, index;

  _some(categoriseComments, function(commentsList, commentListCategory) {
    const _index = _findIndex(commentsList, function(comment) {return commentReader.id(comment) === commentId;});

    if (_index > -1) {
      category = commentListCategory;
      index = _index;
    }

    return _index !== -1;
  });

  return {
    category,
    index,
  };
}

export default {
  categoriseComments,
  isCommentInReply,
  getCommentCategoryAndIndex,
};
