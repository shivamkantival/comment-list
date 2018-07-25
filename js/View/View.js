//components
import CommentInputForm from 'components/CommentInputForm';
import CommentList from 'components/CommentList/CommentList';

//utils
import {
  getDOMNodesFromString,
  findNodeWihClassname,
} from 'utils/DOMParser';
import _noop from 'lodash/noop';

const VIEW_TEMPLATE = `<div class='app-container'>
  <section class='add-comment-section'>
  </section>
  <section class='comments-list-container'>
  </section>
</div>`;

export default class View {
  constructor(controller) {
    this.controller = controller;
    this.init();
  }

  init() {
    this.view = getDOMNodesFromString(VIEW_TEMPLATE);

    this.initAddCommentForm();
    this.initCommentList();

    document.getElementById('app').appendChild(this.view);
  }

  initAddCommentForm = () => {
    const addCommentSectionContainer = findNodeWihClassname(this.view, 'add-comment-section');

    addCommentSectionContainer.appendChild(CommentInputForm('ADD_COMMENT', {
      onCancel: _noop,
      onSave: this.controller.saveComment,
      profile: {},
      containerClassName: 'transparent',
    }));
  }

  initCommentList = () => {
    const commentListContainer = findNodeWihClassname(this.view, 'comments-list-container'),
      controller = this.controller;

    this.commentListInstance = CommentList(this.controller.getComments(), {
      incrementLikes: controller.incrementLikes,
      incrementDislikes: controller.incrementDislikes,
      addReply: controller.saveComment,
      getChildComments: controller.getChildComments,
    });

    commentListContainer.appendChild(this.commentListInstance.getDOMNodes());
  }

  updateView = updatedCommentsList => {
    this.commentListInstance.updateDOMNodes(updatedCommentsList);

    const commentListContainer = this.view.getElementsByClassName('comments-list-container').item(0);

    commentListContainer.replaceChild(this.commentListInstance.getDOMNodes(), commentListContainer.childNodes[0]);
  }
}
