import { Button, notification } from 'antd';
import axios from 'axios';
import classNames from 'classnames';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { useSetRecoilState } from 'recoil';
import { showLoginBoxState } from '../../recoil/auth';
import { withDomain } from '../../utilities/dev';

const actionCodeSettings = {
  // After password reset, the user will be give the ability to go back
  // to this page.
  url: withDomain('/category'),
  handleCodeInApp: false,
};

export default function LoginBox() {
  const setShowLoginBox = useSetRecoilState(showLoginBoxState);
  const router = useRouter();
  // Variables for storing email and password value
  const emailRef = useRef();
  const passwordRef = useRef();

  // For setting state of Alert Box components

  // Forget password state
  const [forgetPassword, setForgetPassword] = useState(false);
  const changeForgetPasswordState = () => {
    setForgetPassword(!forgetPassword);
  };

  // Handle Register
  const handleRegister = () => {
    router.push('/register');
  };

  // Handle Login Operation
  const [loginLoading, setLoginLoading] = useState(false);
  const login = async (e) => {
    e.preventDefault();

    setLoginLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        notification.success({
          message: 'Login Successful',
          description: 'You have successfully logged in.',
        });
        setLoginLoading(false);
        setShowLoginBox(false);

        axios
          .post(withDomain('/api/update/account'), {
            email,
            login: true,
          })
          .catch((err) => console.warn('request err', err));
      })
      .catch((error) => {
        notification.error({
          message: 'Login Failed',
          description: error.message,
        });
        setShowLoginBox(true);
        setLoginLoading(false);
      });
  };

  // Handle Reset Password Operation
  const resetPassword = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .sendPasswordResetEmail(emailRef.current.value, actionCodeSettings)
      .then(() => {
        notification.error({
          message: 'Success',
          description: 'Email verification sent.',
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: error.message,
        });
      });
  };
  const [oAuthGGLoading, setOAuthGGLoading] = useState(false);
  const [oAuthFBLoading, setOAuthFBLoading] = useState(false);
  const onGoogleOAuth = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    setOAuthGGLoading(true);
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        const { displayName, email, uid, emailVerified } = result.user;
        const isExisted = await axios.get(withDomain(`/api/user/check-existed?uid=${uid}`));
        if (!isExisted.data) {
          const user = {
            nickname: displayName,
            gender: 'Not Specified',
            email,
            alternateEmail: emailVerified,
            uid,
          };
          await axios.post(withDomain('/api/create/account'), user).then(() => {
            notification.success({
              message: 'Success',
              description: 'Signed in with Google successfully.',
            });
            setShowLoginBox(false);
            setOAuthGGLoading(false);
          });
          return;
        }
        notification.success({
          message: 'Success',
          description: 'You Signed In With Google successfully.',
        });
        setShowLoginBox(false);
        setOAuthGGLoading(false);
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: error.message,
        });
        setShowLoginBox(true);
      });
  };
  const onFacebookOAuth = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    setOAuthFBLoading(true);
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        const { displayName, email, uid, emailVerified } = result.user;
        const isExisted = await axios.get(withDomain(`/api/user/check-existed?uid=${uid}`));
        if (!isExisted.data) {
          const user = {
            nickname: displayName,
            gender: 'Not Specified',
            email,
            alternateEmail: emailVerified,
            uid,
          };
          await axios.post(withDomain('/api/create/account'), user).then(() => {
            notification.success({
              message: 'Success',
              description: 'Signed in with Google successfully.',
            });
            setShowLoginBox(false);
            setOAuthFBLoading(false);
          });
          return;
        }
        notification.success({
          message: 'Success',
          description: 'You Signed In With Google successfully.',
        });
        setShowLoginBox(false);
        setOAuthFBLoading(false);
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
          description: error.message,
        });
        setShowLoginBox(true);
      });
  };

  return (
    <div className='fixed w-full h-96  top-1/2 bottom-1/2 right-0 left-0 z-20 m-auto max-h-screen max-w-xs shadow-lg'>
      <div className='flex flex-col h-auto w-80 justify-between z-50 rounded-lg  shadow-lg overflow-hidden m-auto'>
        {/* top part */}
        <div
          className='h-36 bg-no-repeat bg-center border-b-2 border-login-input bg-search-bar'
          style={{
            backgroundImage:
              'url(https://firebasestorage.googleapis.com/v0/b/cheeky-web.appspot.com/o/logo%2FCheeky%20head.png?alt=media&token=e6413472-b48d-4177-aa2c-5c8c4bede587)',
          }}
        />

        {/* middle part */}
        <div className='w-full p-6 space-y-4 flex-1 bg-search-bar'>
          <div className='input-group text-white'>
            <input
              type='text'
              name='username'
              ref={emailRef}
              className='login-input w-full bg-login-input border-2 border-login-input rounded py-1 px-2 text-white'
              placeholder={forgetPassword ? 'Verification Email' : 'Login Email'}
            />
          </div>

          <div className={`input-group text-white ${forgetPassword && 'hidden'}`}>
            <input
              type='password'
              name='password'
              ref={passwordRef}
              className='login-input w-full bg-login-input border-2 border-login-input rounded py-1 px-2 text-white'
              placeholder='Password'
            />
          </div>

          <div className='text-xs flex justify-between text-gray-400'>
            <Button
              disabled={oAuthFBLoading}
              loading={oAuthGGLoading}
              onClick={onGoogleOAuth}
              icon={<FaGoogle color='#fff' />}
              className='w-10 h-10 bg-side-bar-dark border-2 border-login-input rounded p-2 text-white hover:bg-setting-header hover:border-transparent text-center flex items-center justify-between'
            />
            <Button
              disabled={oAuthGGLoading}
              loading={oAuthFBLoading}
              onClick={onFacebookOAuth}
              icon={<FaFacebookF color='#fff' />}
              className='w-10 h-10 bg-side-bar-dark border-2 border-login-input rounded p-2 text-white hover:bg-setting-header hover:border-transparent text-center flex items-center justify-between'
            />

            <button className='hover:bg-gray-700 hover:bg-opacity-20' type='button'>
              {/* Resend Email Verification */}
            </button>
            {/* <button
              className='hover:bg-gray-700 hover:bg-opacity-20'
              type='button'
              onClick={() => Router.push('/resetpassword')}
            >
              Forgot Password?
            </button> */}
            <div className='flex flex-row items-center justify-between'>
              <input
                type='checkbox'
                className='hover:bg-gray-700 hover:bg-opacity-20 mr-2'
                id='forgetPassword'
                onChange={changeForgetPasswordState}
              />
              <label
                htmlFor='forgetPassword'
                className=''
                style={{
                  bottom: '2px',
                }}
              >
                {' '}
                Forgot password ?
              </label>
            </div>
          </div>
        </div>

        {/* bottom part */}
        <div className='flex align-bottom border-t-2 text-white text-opacity-70 border-black bg-search-bar'>
          <button
            className='w-1/2 py-4 bg-search-bar hover:bg-gray-700 transform duration-300'
            type='button'
            onClick={handleRegister}
          >
            Member Registration
          </button>
          <div className='border border-black bg-search-bar mt-4 h-6 rounded' />
          <button
            disabled={oAuthFBLoading || oAuthGGLoading || loginLoading}
            className={classNames(
              'w-1/2 py-4 bg-search-bar hover:bg-gray-700 transform duration-300 ',
              loginLoading && 'animate-pulse'
            )}
            type='button'
            onClick={forgetPassword ? resetPassword : login}
          >
            {forgetPassword ? 'Send' : 'Login'}
            {loginLoading && (
              <span className='w-2 h-2 animate-bounce inline-block ml-2 rounded-full'>...</span>
            )}
          </button>
        </div>
      </div>
      {/*
      <div
        className='bg-black opacity-40 h-full w-full absolute'
        onClick={handleLoginBoxClick}
        aria-hidden='true'
      /> */}

      {/* alert section */}
    </div>
  );
}
