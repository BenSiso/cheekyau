import React, { useRef } from 'react';

export default function emailInput({ setAlternateEmail, correctAlternateEmail }) {
  // This variable is for storing alternate email for passing the value to the form
  const alternateEmailRef = useRef();
  return (
    <>
      <div className='w-full flex flex-col mt-3 text-white'>
        <input
          onChange={() => setAlternateEmail(alternateEmailRef.current.value)}
          ref={alternateEmailRef}
          placeholder='Backup Email Address'
          type='email'
          className={`${
            correctAlternateEmail ? 'focus:border-iphone-toggle-button' : 'border-red-900'
          } bg-transparent  border-b-2  focus:outline-none transition-colors mb-1`}
        />
        {!correctAlternateEmail && (
          <p className=' text-xs text-red-900'>Backup email cannot be the same as login email</p>
        )}

        {/* <p className=' text-xs text-profile-gender-text'>
            你的備用電郵，用於接收「忘記密碼」電郵
          </p> */}
      </div>
    </>
  );
}
