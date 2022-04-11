import React from 'react';
import { BsImages, BsThreeDots } from 'react-icons/bs';
import { AiOutlineMenu, AiOutlineStar } from 'react-icons/ai';
import { GoReply } from 'react-icons/go';
import { GiBookmarklet } from 'react-icons/gi';

const ThreadDetailMenuBottomBar = () => {
  return (
    <>
      <div className='fixed bottom-0 w-3/4 bg-black bg-opacity-80 sm:block md:hidden'>
        <div className='flex justify-between text-xl text-gray-300 '>
          <div className='py-5 hover:bg-gray-900 flex-1 flex justify-center'>
            <AiOutlineMenu />
          </div>
          <div className='py-5 hover:bg-gray-900 flex-1 flex justify-center'>
            <AiOutlineStar />
          </div>
          <div className='py-5 hover:bg-gray-900 flex-1 flex justify-center'>
            <BsImages />
          </div>
          <div className='py-5 hover:bg-gray-900 flex-1 flex justify-center'>
            <GoReply />
          </div>
          <div className='py-5 hover:bg-gray-900 flex-1 flex justify-center'>
            <GiBookmarklet />
          </div>
          <div className='py-5 hover:bg-gray-900 flex-1 flex justify-center'>
            <BsThreeDots />
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreadDetailMenuBottomBar;
