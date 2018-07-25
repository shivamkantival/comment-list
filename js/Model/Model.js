//helper
import {
  categoriseComments,
  isCommentInReply,
  getCommentCategoryAndIndex,
  COMMENT_IN_REPLY,
  PARENT_COMMENT,
} from './helpers';

//utils
import moment from 'moment';
import _groupBy from 'lodash/groupBy';
import update from 'immutability-helper';
import localstorageSingleton from './LocalStorage';

//reader
import commentReader from 'beanReaders/comment';

class Model {
  constructor() {
    this.categorisedComments = categoriseComments(localstorageSingleton.getComments());
    this.latestCommentId = localstorageSingleton.getLatestCommentId();
  }

  saveComment = comment => {
    const _comment = {
      ...comment,
      timestamp: moment.now(),
      id: ++this.latestCommentId,
    };

    isCommentInReply(comment) ? this.saveCommentInReply(_comment) : this.saveParentComment(_comment);

    this.updateStore();

    return this.getComments();
  }

  updateStore = () => {
    localstorageSingleton.setStore({
      commentList: [
        ...(this.categorisedComments[PARENT_COMMENT] || []),
        ...(this.categorisedComments[COMMENT_IN_REPLY] || []),
      ],
      latestCommentId: this.latestCommentId,
    });
  }

  saveCommentInReply = comment => {
    this.categorisedComments[COMMENT_IN_REPLY] = [
      comment,
      ...(this.categorisedComments[COMMENT_IN_REPLY] || []),
    ];
  }

  saveParentComment = comment => {
    this.categorisedComments[PARENT_COMMENT] = [
      comment,
      ...(this.categorisedComments[PARENT_COMMENT] || []),
    ];
  }

  getComments = () => this.categorisedComments[PARENT_COMMENT] || []

  getChildComments = parentCommentId => _groupBy(this.categorisedComments[COMMENT_IN_REPLY], function(comment) {
    return commentReader.parentCommentId(comment) === parentCommentId;
  }).true

  updateComment = (commentId, updateKey, getUpdatedValue) => {
    const {category, index} = getCommentCategoryAndIndex(this.categorisedComments, commentId);
    const comment = this.categorisedComments[category][index];

    this.categorisedComments = update(this.categorisedComments, {
      [category]: {
        [index]: {
          $set: {
            ...comment,
            [updateKey]: getUpdatedValue(comment),
          },
        },
      },
    });

    this.updateStore();
    return this.getComments();
  }

  incrementLikes = commentId => this.updateComment(commentId, 'numberOfLikes', function(comment) {
    return commentReader.numberOfLikes(comment) + 1;
  })

  incrementDislikes = commentId => this.updateComment(commentId, 'numberOfDislikes', function(comment) {
    return commentReader.numberOfDislikes(comment) + 1;
  })
}

export default Model;
