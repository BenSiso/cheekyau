import { atom } from 'recoil';

export const showLoginBoxState = atom({
  key: 'showLoginBox',
  default: false,
});

export const showRegisterPageState = atom({
  key: 'showRegisterPage',
  default: false,
});

export const uidState = atom({
  key: 'uid',
  default: '',
});

export const isLoginState = atom({
  key: 'isLogin',
  default: false,
});

export const authUserState = atom({
  key: 'AutUser',
  default: {
    id: '',
    userName: '',
    email: '',
  },
});

export const showNotificationState = atom({
  key: 'showNotification',
  default: false,
});
