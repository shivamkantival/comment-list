import View from 'View';
import Model from 'Model';

//helpers
import {createComment} from './helpers';

class Controller {
  constructor() {
    this.modelInstance = Model();
    this.viewInstance = View({
      saveComment: this.saveComment,
      incrementLikes: this.incrementLikes,
      incrementDislikes: this.incrementDislikes,
      getChildComments: this.getChildComments,
      getComments: this.getComments,
    });
  }

  saveComment = (commentText, parentCommentId) => {
    const comment = createComment(commentText, parentCommentId);

    const newCommentList = this.modelInstance.saveComment(comment);
    this.viewInstance.updateView(newCommentList);
  }

  incrementLikes = commentId => {
    const newCommentList = this.modelInstance.incrementLikes(commentId);

    this.viewInstance.updateView(newCommentList);
  }

  incrementDislikes = commentId => {
    const newCommentList = this.modelInstance.incrementDislikes(commentId);

    this.viewInstance.updateView(newCommentList);
  }

  getChildComments = commentId => this.modelInstance.getChildComments(commentId)

  getComments = () => this.modelInstance.getComments()
}

export default Controller;
