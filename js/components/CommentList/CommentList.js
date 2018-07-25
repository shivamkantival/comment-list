//readers
import commentReader from 'beanReaders/comment';
import profileReader from 'beanReaders/profile';

//utils
import {
  getDOMNodesFromString,
  findNodeWihClassname,
  findNodeWithTagName,
} from 'utils/DOMParser';
import _reduce from 'lodash/reduce';
import _map from 'lodash/map';

//components
import CommentInputForm from 'components/CommentInputForm';

function getCommentLayout (uniqueId) {
  return `<div id="${uniqueId}" class="comment-container">
    <img alt="User Image" class="profile-image">
    <section class="content">
      <label class="profile-name"></label>
      <div class="text"></div>
      <footer class="footer">
      </footer>
      <div class="reply-box-container collapsed"></div>
      <div class="child-comments-container"></div>
    </section>
  </div>`;
}

const LIKES_COUNT = 'likes-count',
  DISLIKES_COUNT = 'dislikes-count';

const COMMENTS_REACTION_SECTION_LAYOUT = `<div class="reaction-box">
  <div class="likes-container">
    <img class="action-icon like-action" src="assets/like.jpeg">
    <span class="${LIKES_COUNT}"></span>
  </div>
  <div class="dislikes-container">
    <img class="action-icon dislike-action" src="assets/unlike.jpeg">
    <span class="${DISLIKES_COUNT}"></span>
  </div>
</div>`;

function canHaveReplies(comment) {
  return !commentReader.parentCommentId(comment);
}

class Comment { // need to be in same file as ClassList to avoid circular dependency
  constructor(comment, params) {
    this.comment = comment;
    this.params = params;
    this.commentLayout = getDOMNodesFromString(getCommentLayout(commentReader.id(comment)));

    this.renderView();
    this.renderChildComments();
  }

  renderView = () => {
    this.populateProfile();
    this.populateCommentText();
    this.populateActions();
  }

  populateProfile = () => {
    const profile = commentReader.profile(this.comment);

    findNodeWithTagName(this.commentLayout, 'img')
      .setAttribute("src", profileReader.profileUrl(profile));

    findNodeWihClassname(this.commentLayout, 'profile-name').innerHTML = profileReader.name(profile);
  }

  populateCommentText = () => {
    findNodeWihClassname(this.commentLayout, 'text').innerHTML = commentReader.text(this.comment);
  }

  populateActions = () => {
    findNodeWihClassname(this.commentLayout, 'footer').innerHTML = '';
    this.populateLikeUnlikeActions();
    this.populateReplyAction();
  }

  getActionsContainer = () => this.commentLayout.getElementsByTagName('footer').item(0)

  populateLikeUnlikeActions = () => {
    const {comment} = this,
      actionsContainer = this.getActionsContainer(),
      commentsReactionLayout = getDOMNodesFromString(COMMENTS_REACTION_SECTION_LAYOUT);

    findNodeWihClassname(commentsReactionLayout, LIKES_COUNT).innerHTML = commentReader.numberOfLikes(comment);
    findNodeWihClassname(commentsReactionLayout, DISLIKES_COUNT).innerHTML = commentReader.numberOfDislikes(comment);

    findNodeWihClassname(commentsReactionLayout, 'like-action').onclick = this.incrementLikes;
    findNodeWihClassname(commentsReactionLayout, 'dislike-action').onclick = this.incrementDislikes;

    actionsContainer.appendChild(commentsReactionLayout);
  }

  incrementLikes = () => {
    this.params.incrementLikes(commentReader.id(this.comment));
  }

  incrementDislikes = () => {
    this.params.incrementDislikes(commentReader.id(this.comment));
  }

  populateReplyAction = () => {
    if (canHaveReplies(this.comment)) {
      this.initReplyBox();
      this.appendToggleReplyAction();
    }
  }

  handleSave = replyText => {
    const params = this.params;

    params.addReply(replyText, commentReader.id(this.comment));
  }

  toggleReplySection = () => {
    findNodeWihClassname(this.commentLayout, 'reply-box-container')
      .classList.toggle('collapsed');
  }

  initReplyBox = () => {
    const comment = this.comment,
      replyFormNode = CommentInputForm(commentReader.id(comment), {
        onSave: this.handleSave,
        onCancel: this.toggleReplySection,
      }),
      replyFormContainer = findNodeWihClassname(this.commentLayout, 'reply-box-container');

    replyFormContainer.firstChild
      ? replyFormContainer.replaceChild(replyFormNode, replyFormContainer.childNodes[0])
      : replyFormContainer.appendChild(replyFormNode);
  }

  appendToggleReplyAction = () => {
    const replyActionLayout = getDOMNodesFromString(`<div class="toggle-reply">Reply</div>`),
      actionsContainer = this.getActionsContainer();

    replyActionLayout.onclick = this.toggleReplySection;
    actionsContainer.appendChild(replyActionLayout);
  }

  renderChildComments = () => {
    const childCommentList = this.params.getChildComments(commentReader.id(this.comment));

    this.childCommentNodes = createCommentList(childCommentList, this.params);

    const childNodesContainer = findNodeWihClassname(this.commentLayout, 'child-comments-container');

    childNodesContainer.appendChild(this.childCommentNodes.getDOMNodes());
  }

  getDOMNode = () => this.commentLayout

  updateDOMNode = updatedComment => {
    if (this.comment !== updatedComment) {
      this.comment = updatedComment;
      this.renderView();
    }

    const updatedChildNodes = this.childCommentNodes.updateDOMNodes(this.params.getChildComments(commentReader.id(this.comment)));
    const childNodesContainer = findNodeWihClassname(this.commentLayout, 'child-comments-container');

    childNodesContainer.replaceChild(updatedChildNodes, childNodesContainer.childNodes[0]);
  }
}

function createComment(comment, params) {
  const commentInstance = new Comment(comment, params);

  return {
    getDOMNode: () => commentInstance.getDOMNode(),
    updateNode: updatedComment => commentInstance.updateDOMNode(updatedComment),
  };
}

class CommentList {
  constructor(commentList = [], params) {
    this.commentList = commentList;
    this.params = params;
    this.commentNodes = this.initComments();
  }

  initComments = () => _reduce(this.commentList, (accumulator, comment) => {
    accumulator[commentReader.id(comment)] = createComment(comment, this.params);
    return accumulator;
  }, {})

  getDOMNodes = () => {
    const containerElement = document.createElement('div');

    _map(this.commentList, comment => { //iterate over commentList to maintain order of comments
      containerElement.appendChild(
        this.commentNodes[commentReader.id(comment)].getDOMNode()
      );
    });

    return containerElement;
  }

  updateDOMNodes = updatedCommentList => {
    this.commentList = updatedCommentList;

    _map(updatedCommentList, comment => {
      const commentId = commentReader.id(comment);

      if (this.commentNodes[commentId]) {
        this.commentNodes[commentId].updateNode(comment);
      } else {
        this.commentNodes[commentId] = createComment(comment, this.params);
      }
    });

    return this.getDOMNodes();
  }
}

export default function createCommentList(commentList = [], params) {
  const commentListInstance = new CommentList(commentList, params);

  return {
    getDOMNodes: commentListInstance.getDOMNodes,
    updateDOMNodes: commentListInstance.updateDOMNodes,
  };
}
