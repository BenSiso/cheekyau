import { atom } from 'recoil';

const isModalVisibleState = atom({
  key: 'modalVisible',
  default: false,
});

const userInfoState = atom({
  key: 'userInfo',
  default: {},
});

export { isModalVisibleState, userInfoState };
