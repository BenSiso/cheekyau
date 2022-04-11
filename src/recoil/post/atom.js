import { atom } from 'recoil';

export const showCreatePostState = atom({
  key: 'showCreatePost',
  default: false,
});
export const pageNumState = atom({
  key: 'pageNum',
  default: '1',
});
