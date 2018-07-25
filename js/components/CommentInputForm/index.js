import CommentForm from './CommentInputForm';

export default function(uniqueId, params = {}) { // to maintain contract and automate mundane tasks of setup and teardown
  const formInstance = new CommentForm(uniqueId);

  formInstance.setOnCancel(params.onCancel);
  formInstance.setOnSave(params.onSave);
  formInstance.setProfile(params.profile);
  formInstance.setContainerStyles(params.containerClassName);

  return formInstance.getDOMNode();
}
