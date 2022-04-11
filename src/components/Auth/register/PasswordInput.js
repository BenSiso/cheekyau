import React, { useRef } from 'react';

export default function PasswordInput({
  setPassword,
  setConfirmPassword,
  correctPassword,
  correctConfirmPassword,
  password,
  confirmPassword,
  seePassword,
}) {
  // This variable are for tempoarily storing password and confirmpassword for passing those value to form
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  return (
    <div className='flex flex-col md:flex-row flex-1 md:mt-2 md:items-center'>
      <div className='w-full md:w-4/6 flex flex-col h-full mt-4 text-white'>
        <input
          onChange={() => setPassword(passwordRef.current.value)}
          value={!password ? '' : password}
          placeholder='Password'
          type={seePassword ? 'text' : 'password'}
          ref={passwordRef}
          className={`${
            correctPassword ? 'focus:border-iphone-toggle-button' : 'border-red-900'
          } bg-transparent border-b-2 focus:outline-none transition-colors mb-1`}
        />
        {!correctPassword && (
          <p className='text-xs text-red-900'>
            Password must be at least 8 characters and must contain at least one number and one
            alphabet
          </p>
        )}
      </div>
      <div className='w-full md:w-4/6 flex flex-col h-full mt-3 md:ml-3 text-white'>
        <input
          ref={confirmPasswordRef}
          onChange={() => setConfirmPassword(confirmPasswordRef.current.value)}
          value={confirmPassword}
          placeholder='Confirm Password'
          type={seePassword ? 'text' : 'password'}
          className={`${
            correctConfirmPassword ? 'focus:border-iphone-toggle-button' : 'border-red-900'
          } bg-transparent border-b-2 focus:outline-none transition-colors mb-1'`}
        />
        {!correctConfirmPassword && (
          <p className='text-xs text-red-900'>The password entered twice must be the same</p>
        )}
      </div>
    </div>
  );
}
