import { atom } from 'recoil';

export const showConfirmBoxState = atom({
  key: 'showConfirmBox',
  default: false,
});

export const showHistoryConfirmBoxState = atom({
  key: 'showHistoryConfirmBox',
  default: false,
});
