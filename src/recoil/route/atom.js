import { atom } from 'recoil';

export const routeState = atom({
  key: 'route',
  default: {
    isHomePath: false,
    isAllPath: false,
    isHistoryPath: false,
    isPopularPath: false,
    isBookmarkPath: false,
    isSearchPath: false,
    isCategoryPath: false,
    isThreadPath: false,
    isPagePath: false,
    isRegisterPath: false,
    isLoginPath: false,
    lastPath: '',
  },
});
