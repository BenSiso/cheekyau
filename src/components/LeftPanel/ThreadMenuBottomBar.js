import React from 'react';
import { AiOutlineMenu, AiOutlinePlus } from 'react-icons/ai';
import { BiRefresh } from 'react-icons/bi';
import { RiSettings4Fill } from 'react-icons/ri';

const ThreadMenuBottomBar = () => {
  return (
    <div className='fixed bottom-0 w-full bg-black bg-opacity-80 text-2xl '>
      <div className='flex  text-gray-300 '>
        <div className='py-5 hover:bg-gray-900 flex-1 flex justify-center'>
          <AiOutlineMenu />
        </div>
        <div className='py-5 hover:bg-gray-900 flex-1 flex justify-center '>
          <BiRefresh />
        </div>
        <div className='py-5 hover:bg-gray-900 flex-1 flex justify-center  '>
          <AiOutlinePlus />
        </div>
        <div className='py-5 hover:bg-gray-900 flex-1 flex justify-center '>
          <RiSettings4Fill />
        </div>
      </div>
    </div>
  );
};

export default ThreadMenuBottomBar;
