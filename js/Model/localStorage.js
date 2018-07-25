
import _get from 'lodash/get';

class Storage {
  constructor() {
    this.storage = window.localStorage;
    this.storeKey = 'COMMENTS_APP';
  }

  getComments() {
    return _get(JSON.parse(this.storage.getItem(this.storeKey)), 'commentList', []);
  }

  setStore(store) {
    this.storage.setItem(this.storeKey, JSON.stringify(store));
  }

  getLatestCommentId() {
    return _get(JSON.parse(this.storage.getItem(this.storeKey)), 'latestCommentId', []);
  }
}

export default new Storage();
