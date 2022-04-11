export const isDebug = () => process?.env?.NODE_ENV === 'development';

export const getDomain = () =>
  isDebug() ? 'http://localhost:3000' : 'https://cheeky-web.vercel.app';

export const withDomain = (path = '') => `${getDomain()}${path}`;

const timeLabels = {};

const endTimerImpl = (label = '') => {
  if (!(label in timeLabels)) return console.warn('[time] unexpected label to end');
  const now = Date.now();
  const spent = now - timeLabels[label];
  console.warn('[time] end in', spent, label, now);
  return null;
};

const startTimerImpl = (label = '') => {
  const now = Date.now();
  timeLabels[label] = now;
  console.warn('[time] start', label, now);
  return () => endTimerImpl(label);
};

export const startTimer = startTimerImpl;
export const endTimer = endTimerImpl;
