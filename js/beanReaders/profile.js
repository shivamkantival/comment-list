export function profileUrl(profile = {}) {
  return profile.url || 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png';
}

export function name(profile = {}) {
  return profile.name || '';
}

export default {
  profileUrl,
  name,
};
