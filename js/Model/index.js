import Model from './Model';

export default function initModel() {
  const modelInstance = new Model();

  return {
    getComments: modelInstance.getComments,
    getChildComments: modelInstance.getChildComments,
    saveComment: modelInstance.saveComment,
    incrementLikes: modelInstance.incrementLikes,
    incrementDislikes: modelInstance.incrementDislikes,
  };
}
