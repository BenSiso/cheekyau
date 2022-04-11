/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
import { notification } from 'antd';
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthUser } from 'next-firebase-auth';
import { useRef, useState } from 'react';
import { FaSmile } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { routeState } from '../../recoil';
import EmailInput from '../Auth/register/EmailInput';
import PasswordInput from '../Auth/register/PasswordInput';

export default function ProfileForm({ handleClick }) {
  // Route Path State
  const { isRegisterPath } = useRecoilValue(routeState);
  // Check current auth status
  const AuthUser = useAuthUser();

  // For setting the state of the selected gender
  // User Info
  const emailRef = useRef();
  const usernameRef = useRef();
  const [selectedGender, setSelectedGender] = useState(null);
  const [alternateEmail, setAlternateEmail] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [password, setPassword] = useState(false);

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

  // Setting default attributes
  const [defaultUsername, setDefaultUsername] = useState(null);
  const [defaultEmail, setDefaultEmail] = useState(null);

  // For applying colors to the selected gender
  const handleGenderSelection = (gender) => {
    if (gender === 'Male') {
      setSelectedGender('Male');
    } else {
      setSelectedGender('Female');
    }
  };
  // Setting default value for username and email field if User is already logined
  if (AuthUser.id) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userPart = String(user.displayName).split('@');
        // eslint-disable-next-line prefer-destructuring
        document.getElementById('UsernameField').value = userPart[1];
        setDefaultEmail(user.email);
        setDefaultUsername(userPart[1]);
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
        notification.error({
          message: 'Error',
          description: error.message,
        });
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
    }
    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(emailRef.current.value)) {
      setCorrectEmail(false);
    }
    if (
      !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(alternateEmail) ||
      alternateEmail === emailRef.current.value
    ) {
      setCorrectAlternateEmail(false);
    }
    if (password === null || password.length < 8) {
      setCorrectPassword(false);
    }
    if (password !== confirmPassword) {
      setCorrectConfirmPassword(false);
    }
    if (!correctEmail || !correctAlternateEmail || !correctPassword || correctConfirmPassword) {
      return false;
    }
    return true;
  };
  const [uidFromFirebase, setUidFromFirebase] = useState();
  // For Register New User Info and upload to firestore
  const register = async () => {
    if (inputValidation()) {
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(emailRef.current.value, password)
      .then((userCred) => {
        window.location.href = '/category/1';
        setUidFromFirebase(userCred.user.uid);
        setRegistered(true);
        return userCred.user.updateProfile({
          displayName: selectedGender + '@' + usernameRef.current.value,
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('register failed', err.code, err.message);
      });
  };

  // Reset info after registered
  const resetUserInfo = () => {
    setSelectedGender(null);
    setAlternateEmail(null);
    setConfirmPassword(null);
    setPassword(null);
  };

  // Upload info to user collection when registered
  const uploadWhenRegistered = async (body) => {
    await axios.post('/api/create/account', body).catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    });
  };
  if (registered) {
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
  }
  return (
    <div className='w-full space-y-4 bg-profile-box md:h-3/4 md:px-6 md:pt-10'>
      <div className='bg-profile-input flex flex-col h-full p-6 rounded'>
        {/* Start Logo and header */}
        <div className='flex flex-row w-full justify-between relative mb-4'>
          <button type='button' className=' hover:text-yellow-600 absolute left-0 top-0'>
            <FaSmile size={32} color='yellow' />
          </button>
          <p className='right-0 text-2xl mx-auto'>更改資料</p>
        </div>
        {/* End Logo and header */}
        {/* Start Input Box */}
        <div className='flex flex-col space-y-6 md:space-y-2'>
          <div className='flex flex-col md:flex-row flex-1 md:mt-2 md:items-center'>
            <div className='w-full md:w-2/6 flex flex-row justify-center items-center text-sm text-profile-gender-text rounded py-2 my-10 md:my-0 bg-profile-gender-font'>
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
                巴打
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
                絲打
              </button>
            </div>

            {correctUsername ? (
              <div className='w-full md:w-4/6 flex flex-col h-full mt-3 md:ml-3'>
                <input
                  id='UsernameField'
                  ref={usernameRef}
                  placeholder='用戶名稱'
                  type='text'
                  className='bg-transparent text-white border-b-2 focus:border-iphone-toggle-button focus:outline-none transition-colors mb-1'
                />
                <p className='text-xs text-profile-gender-text'>你在發言時將會顯示這個名稱</p>
              </div>
            ) : (
              <div className='w-full md:w-4/6 flex flex-col h-full mt-3 md:ml-3'>
                <input
                  ref={usernameRef}
                  placeholder='用戶名稱'
                  type='text'
                  className='bg-transparent border-b-2 text-white border-red-900 focus:outline-none transition-colors mb-1'
                />
                <p className='text-xs text-red-900'> 用戶名稱字數不符合規定 </p>
              </div>
            )}
          </div>

          <div className=''>
            {correctEmail ? (
              <div className='w-full flex flex-col mt-3'>
                <input
                  value={defaultEmail}
                  id='emailField'
                  ref={emailRef}
                  placeholder='電郵地址'
                  type='text'
                  className='bg-transparent border-b-2 text-white focus:border-iphone-toggle-button focus:outline-none transition-colors mb-1'
                />
                <p className='text-xs text-profile-gender-text'>
                  ISP／大學／大專院校電郵，用於登入
                </p>
              </div>
            ) : (
              <div className='w-full flex flex-col mt-3'>
                <input
                  ref={emailRef}
                  placeholder='電郵地址'
                  type='text'
                  className='bg-transparent border-b-2 text-white border-red-900 focus:outline-none transition-colors mb-1'
                />
                <p className='text-xs text-red-900'>電郵地址無效</p>
              </div>
            )}
            {/* Start For Show In Register */}
            {isRegisterPath && (
              <EmailInput
                setAlternateEmail={setAlternateEmail}
                correctAlternateEmail={correctAlternateEmail}
                alternateEmail={alternateEmail}
              />
            )}
            {/* End For Show In Register */}
          </div>
          {/* Start For Show In Register */}
          {isRegisterPath && (
            <PasswordInput
              password={password}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              correctPassword={correctPassword}
              correctConfirmPassword={correctConfirmPassword}
            />
          )}

          {/* End For Show In Register */}

          {/* Start For Sign In */}
          {isRegisterPath ? (
            <div className='flex w-full justify-end'>
              <button
                className='w-full sm:w-auto bg-iphone-toggle-button px-6 py-2 rounded text-black font-medium hover:bg-opacity-10'
                type='button'
                onClick={register}
              >
                註冊
              </button>
            </div>
          ) : (
            <div className='flex w-full justify-end'>
              <button
                className='w-full sm:w-auto bg-iphone-toggle-button px-6 py-2 rounded text-black font-medium hover:bg-opacity-10'
                type='button'
                onClick={handleUpdate}
              >
                更新
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
