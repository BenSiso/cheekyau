import { init } from 'next-firebase-auth';

let didInit = false;
const initAuth = () => {
  if (didInit) return;

  init({
    authPageURL: '/dev/auth',
    appPageURL: '/',
    loginAPIEndpoint: '/api/auth/login', // required
    logoutAPIEndpoint: '/api/auth/logout', // required
    // firebaseAuthEmulatorHost: 'localhost:9099',
    // Required in most cases.
    firebaseAdminInitConfig: {
      credential: {
        projectId: 'cheeky-web',
        clientEmail: 'firebase-adminsdk-zc7re@cheeky-web.iam.gserviceaccount.com',
        // The private key must not be accesssible on the client side.
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      },
      databaseURL: 'https://cheeky-web.firebaseio.com',
      storageBucket: 'cheeky-web.appspot.com',
    },
    firebaseClientInitConfig: {
      apiKey: 'AIzaSyAdFbTATihMKJ7U6gAMxIx1SRccJrOSLnc', // required
      authDomain: 'cheeky-web.firebaseapp.com',
      databaseURL: 'https://cheeky-web.firebaseio.com',
      projectId: 'cheeky-web',
    },
    cookies: {
      name: 'cheeky', // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [process.env.COOKIE_SECRET_CURRENT, process.env.COOKIE_SECRET_PREVIOUS],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production', // set this to false in local (non-HTTPS) development
      signed: true,
    },
  });

  didInit = true;
};

export default initAuth;
