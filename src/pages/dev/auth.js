/* eslint-disable no-console */
import firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthUser, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth';
import { useState } from 'react';

const Demo = () => {
  const AuthUser = useAuthUser();
  const hasLoggedIn = AuthUser.id;

  const [email, setEmail] = useState('test@abc.com');
  const [password, setPassword] = useState('123456');
  const [message, setMessage] = useState('');

  const login = () => {
    setMessage('');
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCred) => {
        console.log('login ok', userCred.user);
      })
      .catch((err) => {
        console.log('login failed', err.code, err.message);
        setMessage(err.message);
      });
  };

  const register = () => {
    setMessage('');
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCred) => {
        console.log('register ok', userCred.user);
      })
      .catch((err) => {
        console.log('register failed', err.code, err.message);
        setMessage(err.message);
      });
  };

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('logout ok');
      })
      .catch((err) => {
        console.log('logout failed', err.code, err.message);
      });
  };

  return (
    <div className='text-white'>
      <p>Your email is {AuthUser.email ? AuthUser.email : 'unknown'}.</p>
      {hasLoggedIn ? (
        <button type='button' className='bg-yellow-600 m-2 rounded p-2' onClick={logout}>
          Logout
        </button>
      ) : (
        <div className='text-black text-center'>
          <div>
            <input
              defaultValue={email}
              type='text'
              placeholder='email'
              onChange={(t) => setEmail(t.target.value)}
            />
          </div>
          <div>
            <input
              defaultValue={password}
              type='text'
              placeholder='password'
              onChange={(t) => setPassword(t.target.value)}
            />
          </div>
          <div className='bg-red-200'>{message}</div>
          <button type='button' className='bg-yellow-300 m-2 rounded p-2' onClick={register}>
            Register
          </button>
          <button type='button' className='bg-yellow-300 m-2 rounded p-2' onClick={login}>
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(Demo);
