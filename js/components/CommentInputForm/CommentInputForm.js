//utils
import _uniqueId from 'lodash/uniqueId';
import _isFunction from 'lodash/isFunction';
import {
  getDOMNodesFromString,
  findNodeWihClassname,
  findNodeWithTagName,
} from 'utils/DOMParser';

//readers
import profileReader from 'beanReaders/profile';

const getFormTemplate = uniqueid => `<div id="${uniqueid}" class="formContainer" >
    <img alt="Profile image">
    <section class="right-section">
      <textarea placeholder="Join the discussion..." maxlength="200" class="full-width full-height"></textarea>
    </section>
    <footer class="invisible footer">
      <button class="btn cancel">Cancel</button>
      <button class="btn save">Save</button>
    </footer>
  </div>`;

export default class CommentForm {
  constructor(uniqueId) {
    this.uniqueid = _uniqueId(`${uniqueId}_`);
    this.formLayout = getDOMNodesFromString(getFormTemplate(this.uniqueid));

    findNodeWihClassname(this.formLayout, 'cancel').onclick = this.handleCancel;
    findNodeWihClassname(this.formLayout, 'save').onclick = this.handleSave;
    this.getInputField().onclick = this.toggleFooterSection;
  }

  setContainerStyles = containerClassName => {
    this.formLayout.classList.add(containerClassName);
  }

  setProfile = profile => {
    findNodeWithTagName(this.formLayout, 'img').setAttribute('src', profileReader.profileUrl(profile));
  }

  toggleFooterSection = () => {
    const footer = findNodeWithTagName(this.formLayout, 'footer');
    footer.classList.toggle("invisible");
  }

  setOnCancel = onCancel => {
    this.onCancel = onCancel;
  }

  setOnSave = onSave => {
    this.onSave = onSave;
  }

  getInputField = () => findNodeWithTagName(this.formLayout, 'textarea');

  getValue = () => this.getInputField().value

  handleCancel = () => {
    this.toggleFooterSection();
    this.resetValue();
    _isFunction(this.onCancel) && this.onCancel();
  }

  handleSave = () => {
    this.toggleFooterSection();
    _isFunction(this.onSave) && this.onSave(this.getValue());
    this.resetValue();
  }

  resetValue = () => {
    this.getInputField().value = '';
  }

  getDOMNode = () => this.formLayout
}
