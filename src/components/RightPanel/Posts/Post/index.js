/* eslint-disable react/no-danger */
import axios from 'axios';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useAuthUser } from 'next-firebase-auth';
import { BsThreeDots } from 'react-icons/bs';
import { FaGenderless } from 'react-icons/fa';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import { RiShareForwardFill } from 'react-icons/ri';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isModalVisibleState, userInfoState } from '../../../../recoil';
import { isMobileSizeState } from '../../../../recoil/responsive';
import { showShareBoxState } from '../../../../recoil/sharebox/atom';
import * as ThreadState from '../../../../recoil/thread';
import ActivityBtn from './ActivityBtn';

export default function Post({ thread }) {
  const setShowShareBox = useSetRecoilState(showShareBoxState);
  const setThreadId = useSetRecoilState(ThreadState.threadIdState);
  const setThreadTitle = useSetRecoilState(ThreadState.threadTitleState);
  const setIsCreateThread = useSetRecoilState(ThreadState.isCreateThreadState);
  const setIsReplyThread = useSetRecoilState(ThreadState.isReplyThreadState);
  const setIsReplyComment = useSetRecoilState(ThreadState.isReplyCommentState);
  const setReplyFromContentText = useSetRecoilState(ThreadState.replyFromContentTextState);

  const onSetThreadInfoState = () => {
    setThreadId(thread?.id);
    setThreadTitle(thread?.title);
    setIsCreateThread(false);
    // Reply Thread
    setIsReplyThread(true);
    setIsReplyComment(false);

    setReplyFromContentText(`<blockquote>
    <p>${thread?.text}</p>
    </blockquote>
    <p>&nbsp;</p>`);
  };
  const setIsModalVisible = useSetRecoilState(isModalVisibleState);
  const setUserInfo = useSetRecoilState(userInfoState);

  const AuthUser = useAuthUser();
  const onUserName = async () => {
    if (AuthUser.id && AuthUser.id !== thread?.user?.id) {
      await axios.get(`/api/user/check?uid=${AuthUser.id}`).then((res) => {
        if (res.data.status === 'success') {
          setIsModalVisible(true);
          setUserInfo(thread?.user);
        }
      });
    }
  };
  const isMobile = useRecoilValue(isMobileSizeState);
  return (
    <>
      <div className={classNames(isMobile ? 'py-3 px-3' : 'py-4 px-8')}>
        <motion.div
          className='w-full h-auto bg-primary p-3 rounded-xl truncate'
          initial={{ x: '-100%' }}
          animate={{ x: ['-100%', '0%'] }}
          transition={{ duration: 0.1 }}
        >
          {/* Title Post Bar */}
          <div className='flex justify-between text-secondary '>
            <div className='flex space-x-1'>
              <span className='rounded-2xl text-xl '>
                {thread?.user?.gender === 'Male' && <IoMdMale className='mt-0.5 text-blue-500' />}
                {thread?.user?.gender === 'Female' && (
                  <IoMdFemale className='mt-0.5 text-pink-500' />
                )}
                {(thread?.user?.gender === undefined ||
                  thread?.user?.gender === 'Not Specified') && (
                  <FaGenderless className='mt-0.5 text-purple-500' />
                )}
              </span>
              <p>
                <button type='button' className='text-md pl-2' onClick={onUserName}>
                  {thread?.user?.nickname}
                </button>
                <span className='text-md text-primary text-opacity-50 pl-2'>&bull;</span>
                <span className='text-sm text-primary text-opacity-50 pl-2'>
                  {moment(thread?.createdAt).fromNow()}
                </span>
              </p>
              <span className=' px-3 mt-1 text-lg hover:text-primary cursor-pointer'>
                <RiShareForwardFill
                  onClick={() => {
                    // onShowCreateReplyPost();
                    setShowShareBox(true);
                    onSetThreadInfoState();
                  }}
                />
              </span>
              <span className='hidden text-2xl text-primary text-opacity-50 hover:text-opacity-100 cursor-pointer'>
                <a href='###'>
                  <BsThreeDots />
                </a>
              </span>
            </div>
          </div>
          {/* Post Content Body */}

          <div className='py-4 pl-1 text-primary text-md break-words overflow-hidden whitespace-normal'>
            <div dangerouslySetInnerHTML={{ __html: thread?.text }} />
          </div>

          <div className='pb-1'>
            <ActivityBtn thread={thread} onSetThreadInfoState={onSetThreadInfoState} />
          </div>
        </motion.div>
      </div>
    </>
  );
}
