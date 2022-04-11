import { getFirebaseAdmin } from 'next-firebase-auth';
import initAuth from './initAuth';

const config = {
  activeVersion: process.env.DB_VERSION_ACTIVE || 'dev',
};

export const v = (p = '') => `version/${config.activeVersion}/${p}`;

/**
 *
 * @returns {firebase.default.firestore.Firestore}
 */
export const db = () => {
  initAuth();
  return getFirebaseAdmin().firestore();
};

export const col = (p = '') => db().collection(v(p));

const timeFields = [
  'createdAt',
  'updatedAt',
  ['user', 'registeredAt'],
  ['user', 'loginedAt'],
  ['user', 'bannedAt'],
];
export const convertTimeOf = (obj) => {
  const data = obj;
  timeFields.forEach((k) => {
    // TODO: dirty way to handle like this, should use _.get etc
    if (Array.isArray(k) && data[k[0]]?.[k[1]]?.toDate) {
      data[k[0]][k[1]] = data[k[0]][k[1]].toDate().getTime();
    } else if (k in data && data[k]?.toDate) {
      data[k] = data[k].toDate().getTime();
    }
  });
  return data;
};

export const toList = (snapshot) =>
  snapshot.docs.map((d) => convertTimeOf({ id: d.id, ...d.data() }));
