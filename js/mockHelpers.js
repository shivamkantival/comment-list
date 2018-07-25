//utils
import _sample from 'lodash/sample';

const PROFILES = [
  {
    name: 'Shivam Kantival',
  },
  {
    name: 'Shivi Kantival',
    url: 'https://www.ienglishstatus.com/wp-content/uploads/2018/04/Sad-Profile-Pic-for-Whatsapp.png',
  },
  {
    name: 'Random Person',
    url: 'https://www.attractivepartners.co.uk/wp-content/uploads/2017/06/profile.jpg',
  },
];

export function getRandomProfile() {
  return _sample(PROFILES);
}

export default {
  getRandomProfile,
};
