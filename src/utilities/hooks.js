import { useEffect, useState } from 'react';
import { hasWin } from '.';
import { WindowSize } from '../constants';

export const useWindowSize = () => {
  const [[x, y], setSize] = useState([0, 0]);

  const onResize = () => setSize([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return [x, y];
};

export const useWindowScale = (mobile = false) => {
  const { width: presetWidth, height: presetHeight } = mobile
    ? WindowSize.mobile
    : WindowSize.desktop;
  const [width, height] = useWindowSize();
  const windowRatio = width / height;
  let ratio = 1;
  const presetRatio = presetWidth / presetHeight;
  if (presetRatio > windowRatio) {
    ratio = width / presetWidth;
  } else {
    ratio = height / presetHeight;
  }
  const approach = (hasWin() && window.location.hash.slice(1)) || 'transform';
  return {
    ratio,
    approach,
  };
};
