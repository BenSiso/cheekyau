import React from 'react';

import ProfileFooter from '../../ProfileForm/ProfileFooter';
import RegisterForm from './RegisterForm';

export default function SignInBox() {
  return (
    <div className=' h-screen w-screen overflow-hidden z-40 absolute top-0 flex justify-center items-center bg-black bg-opacity-10'>
      <div
        style={{ width: '696px' }}
        className='flex flex-col h-full md:h-auto md:justify-between z-50 md:rounded-lg shadow-lg overflow-hidden bg-profile-input'
      >
        <RegisterForm />
        <ProfileFooter />
      </div>

      <div
        className='hidden md:block bg-black opacity-0 h-full w-full absolute'
        aria-hidden='true'
      />
    </div>
  );
}
