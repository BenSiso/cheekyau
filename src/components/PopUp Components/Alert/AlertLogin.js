import React from 'react';
import { AiFillBell } from 'react-icons/ai';
import { ImCross } from 'react-icons/im';

export default function AlertLogin({ error, registerMessage }) {
  return (
    <div className='flex flex-col h-auto w-64 justify-between m-4  z-50 rounded-lg shadow-lg overflow-hidden'>
      {/* top part */}
      <div className='flex  items-center bg-setting-header py-3 w-full md:h-16  md:border-b-0'>
        <AiFillBell aria-hidden='true' className=' right mx-2 ' size={20} color='gray' />
        <p className='text-white'>{registerMessage ? 'Welcome ^^!' : 'UH OH!'}</p>

        <div className='flex-1' />

        <div>
          <ImCross aria-hidden='true' className=' right-0 mr-4' size={12} />
        </div>
      </div>

      <div className='flex justify-between items-center h-auto bg-setting-column py-3 w-full md:border-b-0 text-white'>
        <p className='ml-2 text-white'>{!registerMessage ? error : registerMessage}</p>
      </div>
    </div>
  );
}
