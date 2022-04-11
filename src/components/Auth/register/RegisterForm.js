/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
import { notification } from 'antd';
import axios from 'axios';
import classNames from 'classnames';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { routeState } from '../../../recoil';
import { showLoginBoxState } from '../../../recoil/auth/atom';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';

export default function RegisterForm({ handleClick }) {
  // Route Path State
  const { isRegisterPath } = useRecoilValue(routeState);
  const setShowLogin = useSetRecoilState(showLoginBoxState);
  // Check current auth status
  const AuthUser = useAuthUser();
  const [isRegistering, setIsRegistering] = useState(false);
  // Router
  const router = useRouter();

  // For setting the state of the selected gender
  // User Info
  const emailRef = useRef();
  const usernameRef = useRef();
  const [selectedGender, setSelectedGender] = useState(null);
  const [alternateEmail, setAlternateEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');

  // User Info validation state
  const [correctUsername, setCorrectUsername] = useState(true);
  const [correctEmail, setCorrectEmail] = useState(true);
  const [correctAlternateEmail, setCorrectAlternateEmail] = useState(true);
  const [correctPassword, setCorrectPassword] = useState(true);
  const [correctConfirmPassword, setCorrectConfirmPassword] = useState(true);

  // Register state for resetting user info states after finished register
  const [registered, setRegistered] = useState(false);

  // User updating their info state
  const [updated, setUpdated] = useState(false);

  // Terms and Conditions check
  const [agree, setAgree] = useState(false);

  // For dealing with error
  const [internalError, setInternalError] = useState();
  const [registerMessage, setRegisterMessage] = useState();

  // handling See password checkbox
  const [seePassword, setSeePassword] = useState(false);

  const seePasswordHandler = () => {
    setSeePassword(!seePassword);
  };

  const checkboxHandler = () => {
    setAgree(!agree);
  };

  // For applying colors to the selected gender
  const handleGenderSelection = (gender) => {
    if (gender === 'Male') {
      setSelectedGender('Male');
    } else if (gender === 'Female') {
      setSelectedGender('Female');
    } else {
      setSelectedGender('Not Specified');
    }
  };

  // For Alerting User of event
  const alertErrorMessage = (message) => {
    setInternalError(message);
    notification.error({
      message: 'Error',
      description: message,
    });
  };

  const alertSuccessfulMessage = (message) => {
    setRegisterMessage(message);
    notification.success({
      message: 'Success',
      description: message,
    });
    setShowLogin(false);
  };

  // Setting default value for username and email field if User is already logined
  if (AuthUser.id) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userPart = String(user.displayName).split('@');
        // eslint-disable-next-line prefer-destructuring
        document.getElementById('UsernameField').value = userPart[1];
        setSelectedGender(userPart[0]);
      }
    });
  }
  // For Updating User Info
  const handleUpdate = async () => {
    // setOpenProfileBox(false);
    const body = {
      nickname: usernameRef.current.value,
      email: emailRef.current.value,
    };
    const user = firebase.auth().currentUser;
    user.updateProfile({
      // eslint-disable-next-line prefer-template
      displayName: selectedGender + '@' + usernameRef.current.value,
    });
    await axios
      .post('/api/update/account', body)
      .then(() => {
        setUpdated(true);
      })
      .catch((error) => {
        alertErrorMessage(error.message);
      });
    handleClick();
  };

  // User Information Input Validation when register
  const inputValidation = () => {
    setCorrectEmail(true);
    setCorrectUsername(true);
    setCorrectAlternateEmail(true);
    setCorrectPassword(true);
    setCorrectConfirmPassword(true);
    if (usernameRef.current.value.length < 2) {
      setCorrectUsername(false);
      return false;
    }
    if (selectedGender === null) {
      alertErrorMessage('Please select gender for your profile');
      return false;
    }
    if (
      !/^[a-z0-9._]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(emailRef.current.value.toLowerCase().trim())
    ) {
      setCorrectEmail(false);
      return false;
    }
    if (
      !/^[a-z0-9._]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(alternateEmail.toLowerCase().trim()) ||
      alternateEmail === emailRef.current.value
    ) {
      setCorrectAlternateEmail(false);
      return false;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      setCorrectPassword(false);
      return false;
    }
    if (password !== confirmPassword) {
      setCorrectConfirmPassword(false);
      return false;
    }

    return true;
  };
  const [uidFromFirebase, setUidFromFirebase] = useState();
  // For Register New User Info and upload to firestore
  const onRegister = async () => {
    if (agree !== true) {
      alertErrorMessage('You must agree to our terms and conditions first.');
      return;
    }
    if (inputValidation() === false) {
      return;
    }
    setIsRegistering(true);

    await firebase
      .auth()
      .createUserWithEmailAndPassword(emailRef.current.value.toLowerCase().trim(), password)
      .then((userCred) => {
        router.push('/category/1');
        setUidFromFirebase(userCred.user.uid);
        setRegistered(true);
        alertSuccessfulMessage('Register successfully.');
        setIsRegistering(false);

        return userCred.user.updateProfile({
          displayName: selectedGender + '@' + usernameRef.current.value,
        });
      })
      .catch(() => {
        alertErrorMessage(
          'register failed auth/email-already-in-use The email address is already in use by another account.'
        );
      });
  };

  // Reset info after registered
  const resetUserInfo = () => {
    setSelectedGender(null);
    setAlternateEmail('');
    setConfirmPassword('');
    setPassword('');
  };

  // Upload info to user collection when registered
  const uploadWhenRegistered = async (body) => {
    await axios.post('/api/create/account', body);
  };

  useEffect(() => {
    if (!registered) return;
    const body = {
      nickname: usernameRef.current.value,
      email: emailRef.current.value,
      alternateEmail,
      gender: selectedGender,
      uid: uidFromFirebase,
    };
    uploadWhenRegistered(body);
    setRegistered(false);
    resetUserInfo();
  }, [registered]);

  return (
    <div className='w-full space-y-4 bg-profile-box md:h-3/4 md:px-6 md:pt-10'>
      <div className='bg-profile-input flex flex-col h-full p-6 rounded'>
        {/* Start Logo and header */}
        <div className='flex flex-row w-full justify-between relative mb-4'>
          <a href='/' className='w-12 h-12 bg-third p-2 rounded-full -mt-1 hover:opacity-60'>
            <img className='flex-none ' src='/images/logo.png' alt='logo' />
          </a>
          <p className='right-0 text-2xl mx-auto text-white text-opacity-70'>
            Account Registration
          </p>
        </div>
        {/* End Logo and header */}
        {/* Start Input Box */}
        <div className='flex flex-col space-y-6 md:space-y-2'>
          <div className='flex flex-col md:flex-row flex-1 md:mt-2 md:items-center'>
            <div className='w-full md:w-3/6 flex flex-row justify-center items-center text-sm text-profile-gender-text rounded py-2 my-4 md:my-0 bg-profile-gender-font'>
              <button
                id='MaleButton'
                type='button'
                className={`${
                  selectedGender === 'Male'
                    ? ' text-blue-400 bg-red flex-1'
                    : 'text-profile-gender-text  flex-1'
                } hover:bg-gray-700  focus:bg-transparent`}
                onClick={() => handleGenderSelection('Male')}
              >
                Male
              </button>
              <div
                style={{
                  borderWidth: '1px',
                }}
                className='border-white bg-white rounded h-full -my-2'
              />
              <button
                id='FemaleButton'
                className={`${
                  selectedGender === 'Female'
                    ? 'text-red-300  bg-red flex-1'
                    : ' text-profile-gender-text  flex-1'
                } hover:bg-gray-700  focus:bg-transparent`}
                onClick={() => handleGenderSelection('Female')}
                type='button'
              >
                Female
              </button>

              <div
                style={{
                  borderWidth: '1px',
                }}
                className='border-white bg-white rounded h-full -my-2'
              />

              <button
                id='OtherButton'
                className={`${
                  selectedGender === 'Not Specified'
                    ? 'text-purple-400  bg-red flex-1'
                    : ' text-profile-gender-text  flex-1'
                } hover:bg-gray-700  focus:bg-transparent`}
                onClick={() => handleGenderSelection('Other')}
                type='button'
              >
                Not Specified
              </button>
            </div>

            <div
              className={`${
                correctUsername ? 'md:w-3/6' : 'md:w-4/6'
              } w-full  flex flex-col h-full mt-3 md:ml-3`}
            >
              <input
                id='UsernameField'
                ref={usernameRef}
                placeholder='User Name'
                type='text'
                className={`${
                  correctUsername ? 'focus:border-iphone-toggle-button' : 'border-red-900'
                } bg-transparent text-white border-b-2  focus:outline-none transition-colors mb-1`}
              />
              {!correctUsername && (
                <p className='text-xs text-red-900'>
                  {' '}
                  The number of characters in the user name does not meet the requirements{' '}
                </p>
              )}
            </div>
          </div>

          <div className=''>
            <div className='w-full flex flex-col mt-3'>
              <input
                id='emailField'
                ref={emailRef}
                placeholder='Email Address'
                type='email'
                className={`${
                  correctEmail ? 'focus:border-iphone-toggle-button' : 'border-red-900'
                } bg-transparent border-b-2 text-white  focus:outline-none transition-colors mb-1`}
              />
              {!correctEmail && <p className='text-xs text-red-900'>Invalid email address</p>}
              {/* <p className='text-xs text-profile-gender-text'>
                  ISP／大學／大專院校電郵，用於登入
                </p> */}
            </div>

            {/* Start For Show In Register */}
            {isRegisterPath && (
              <>
                <EmailInput
                  setAlternateEmail={setAlternateEmail}
                  correctAlternateEmail={correctAlternateEmail}
                  alternateEmail={alternateEmail}
                />
                <PasswordInput
                  password={password}
                  setPassword={setPassword}
                  setConfirmPassword={setConfirmPassword}
                  correctPassword={correctPassword}
                  correctConfirmPassword={correctConfirmPassword}
                  confirmPassword={confirmPassword}
                  seePassword={seePassword}
                />
                <div className='w-full h-full items-center'>
                  <input
                    type='checkbox'
                    className='h-3 w-3 bottom-1'
                    id='seePassword'
                    onChange={seePasswordHandler}
                  />
                  <label
                    htmlFor='seePassword'
                    className='relative w-3 h-3 text-xs text-white text-opacity-70 '
                    style={{
                      bottom: '2px',
                    }}
                  >
                    {' '}
                    See password ?
                  </label>
                </div>
              </>
            )}
            {/* End For Show In Register */}
          </div>

          {/* Start For Sign In */}
          {isRegisterPath ? (
            <div className='flex w-full  sm:py-2'>
              <div className='w-2/3 h-full px-4 py-2 items-center'>
                <div className='w-full h-full'>
                  <input
                    type='checkbox'
                    id='agree'
                    className='h-6 w-6 mt-2'
                    onChange={checkboxHandler}
                  />
                  <label
                    htmlFor='agree'
                    className='relative w-auto h-full text-white text-opacity-70 px-2 bottom-1'
                  >
                    {' '}
                    I agree to <b>terms and conditions</b>
                  </label>
                </div>
              </div>
              <button
                className={classNames(
                  'w-1/3 sm:w-auto  sm:ml-16 px-6 py-2 rounded text-black font-medium',
                  !agree
                    ? 'cursor-not-allowed bg-profile-gender-text'
                    : 'cursor-pointer bg-iphone-toggle-button hover:opacity-80'
                )}
                type='button'
                onClick={onRegister}
                disabled={!agree}
              >
                {isRegistering && (
                  <AiOutlineLoading className='animate-spin inline-block text-white' />
                )}
                <span> Register</span>
              </button>
            </div>
          ) : (
            <div className='flex w-full sm:py-2'>
              <div className='w-2/3 h-full px-4 py-2 items-center'>
                <div className=''>
                  <div>
                    <input
                      type='checkbox'
                      id='agree'
                      className='h-6 w-6 mt-2'
                      onChange={checkboxHandler}
                    />
                    <label htmlFor='agree' className='w-6 h-6 text-white text-opacity-70 px-2'>
                      {' '}
                      I agree to <b>terms and conditions</b>
                    </label>
                  </div>
                </div>
              </div>
              <button
                className='w-1/3 sm:w-auto bg-iphone-toggle-button sm:ml-16 px-6 py-2 rounded text-black font-medium hover:bg-opacity-10'
                type='button'
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          )}
          {/* End For Sign In */}
        </div>
        {/* End Input Box */}
      </div>
      {/* Start Alert Box */}
    </div>
  );
}
