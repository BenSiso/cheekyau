import { atom } from 'recoil';

const isSmallMobileSizeState = atom({
  key: 'isSmallMobileSize',
  default: false,
});

const isOldMobileSizeState = atom({
  key: 'isOldMobileSize',
  default: false,
});
const isMobileSizeState = atom({
  key: 'isMobileSize',
  default: false,
});
const isTabletSizeState = atom({
  key: 'isTabletSize',
  default: false,
});

const isDesktopSizeState = atom({
  key: 'isDesktopSize',
  default: false,
});

const isRightPanelOpenState = atom({
  key: 'isRightPanelOpen',
  default: false,
});

export {
  isDesktopSizeState,
  isMobileSizeState,
  isSmallMobileSizeState,
  isTabletSizeState,
  isRightPanelOpenState,
  isOldMobileSizeState,
};
