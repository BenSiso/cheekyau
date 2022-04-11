/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-console */
import { motion } from 'framer-motion';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaCheckCircle, FaComment, FaGenderless, FaRegCircle } from 'react-icons/fa';
import { HiThumbDown, HiThumbUp } from 'react-icons/hi';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { routeState, showSelectThreadState, threadSelectedListState } from '../../../../recoil';
import { pageNumState } from '../../../../recoil/post';
import { withDomain } from '../../../../utilities/dev';
import PageSelectList from '../../../Elements/PageSelectList';

export default function index({ thread }) {
  const router = useRouter();
  // Temp Handle
  // TODO add dynamic change to global
  const [isChecked, setIsChecked] = useState(false);

  // Check length of thread title
  const titleLength = thread?.title?.length;

  /* ************************
          Recoil State
          *************
*/

  // Route Path State
  const { isCategoryPath } = useRecoilValue(routeState);
  // Thread Selection State
  const showSelectThread = useRecoilValue(showSelectThreadState);
  // Page Count
  const setPageNum = useSetRecoilState(pageNumState);

  // History Page Handle

  const [threadSelectedList, setThreadSelectedList] = useRecoilState(threadSelectedListState);

  /**
   * @description Check if thread is selected
   */
  const onChecked = () => {
    const tid = thread?.tid;

    setIsChecked(!isChecked);
    if (!isChecked) {
      if (!threadSelectedList.includes(tid)) {
        setThreadSelectedList((prevSelected) => [...prevSelected, tid]);
      }
    } else {
      const idx = threadSelectedList.indexOf(tid);
      setThreadSelectedList([
        ...threadSelectedList.slice(0, idx),
        ...threadSelectedList.slice(idx + 1),
      ]);
    }
  };

  return (
    <motion.div
      className='bg-primary  cursor-pointer p-2 rounded-lg transition duration-300 hover:bg-gray-800 truncate'
      animate={{ y: ['-100%', '0%'] }}
      transition={{ duration: 0.2 }}
      initial='-100%'
      onClick={() => {
        setPageNum('1');
      }}
    >
      {showSelectThread && (
        <div
          className='absolute top-0 bottom-0 left-0 right-0 cursor-pointer z-30'
          onClick={onChecked}
        />
      )}

      <Link
        href={
          isCategoryPath
            ? `/category/${thread?.cid}/thread/${thread?.tid}`
            : `/thread/${thread?.tid}`
        }
        key={thread?.tid}
        scroll={false}
      >
        <a>
          <div className='flex relative p-1.5 z-0'>
            {/* Box Handle */}

            {/* Activity Component for history page */}
            {/* TODO If requirement need more widget set position absolute  */}
            {showSelectThread && (
              <div className='flex-grow-0 flex-shrink-0 w-6 text-yellow-400 '>
                {isChecked ? (
                  <FaCheckCircle
                    onClick={() => {
                      setIsChecked(false);
                    }}
                  />
                ) : (
                  <FaRegCircle
                    onClick={() => {
                      setIsChecked(true);
                    }}
                  />
                )}
              </div>
            )}

            {/* Thread Info Component */}
            <div className='relative w-full'>
              <div className='flex flex-nowrap space-x-1.5 text-gray-500 text-sm'>
                {/* User Info Status */}
                <div className='flex space-x-1  justify-start flex-grow'>
                  {/* User Profile */}
                  <div className='rounded-2xl  text-xl text-gray-800 text-opacity-70 -mt-0.5'>
                    {thread?.user?.gender === 'Male' && (
                      <IoMdMale className='mt-0.5 text-blue-500' />
                    )}
                    {thread?.user?.gender === 'Female' && (
                      <IoMdFemale className='mt-0.5 text-pink-500' />
                    )}
                    {(thread?.user?.gender === undefined ||
                      thread?.user?.gender === 'Not Specified') && (
                      <FaGenderless className='mt-0.5 text-purple-500' />
                    )}
                  </div>
                  {/* User Nickname */}
                  <div className=' text-secondary text-sm bg-opacity-70'>
                    {thread?.user?.nickname}
                  </div>
                  {/* Time Status */}
                  <div className='text-opacity-40 text-xs mt-1'>&bull;</div>
                  <div>
                    <p className=' text-opacity-40 font-light '>
                      {moment(thread?.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                {/* Thump info */}
                <div className='text-secondary text-sm flex flex-1 justify-end space-x-3 '>
                  {thread?.likeCount - thread?.dislikeCount >= 0 ? (
                    <div className='flex space-x-2'>
                      <HiThumbUp className='inline-block text-base ' />
                      <span className='inline-block -mt-0.5  text-opacity-50'>
                        {thread?.likeCount || ' '}
                      </span>
                    </div>
                  ) : (
                    <div className='flex space-x-2'>
                      <HiThumbDown className='inline-block text-base mt-0.5 ' />
                      <span className='inline-block -mt-0.5'>-{thread?.dislikeCount || ' '}</span>
                    </div>
                  )}
                  <div className='flex space-x-2'>
                    <FaComment className=' text-base inline-block' />
                    <span className='inline-block -mt-0.5'>{thread?.commentCount || ' '}</span>
                  </div>
                </div>

                {/* pages list */}
                <div className='hidden  justify-end'>
                  <PageSelectList thread={thread?.cid} />
                </div>
              </div>
              <h3 className='text-md leading-5 text-primary break-words overflow-hidden whitespace-normal py-4'>
                {titleLength > 140 ? thread?.title?.slice(0, 140).concat('...') : thread?.title}
              </h3>

              {/* Category here */}
              {!isCategoryPath && (
                <button
                  type='button'
                  onClick={() => {
                    router.push(withDomain(`/category/${thread?.cid}`));
                  }}
                  className='bg-third rounded-2xl text-xs py-1 px-3 text-primary text-opacity-50   hover:bg-gray-600 hover:bg-opacity-80'
                >
                  {thread?.category?.name}
                </button>
              )}
            </div>
          </div>
        </a>
      </Link>
    </motion.div>
  );
}
