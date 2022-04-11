/* eslint-disable react/no-danger */
import { useAsyncEffect } from 'ahooks';
import axios from 'axios';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useAuthUser } from 'next-firebase-auth';
import { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FaGenderless } from 'react-icons/fa';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import { RiShareForwardFill } from 'react-icons/ri';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isModalVisibleState, userInfoState } from '../../../../recoil';
import { isMobileSizeState } from '../../../../recoil/responsive';
import { showShareBoxState } from '../../../../recoil/sharebox/atom';
import * as ThreadState from '../../../../recoil/thread';
import { withDomain } from '../../../../utilities/dev';
import ActivityBtn from './ActivityBtn';

const ReplyPost = ({ thread, comments, observe }) => {
  const [commentsFilled, setCommentsFilled] = useState([...comments]);
  /*
      Recoil State
   */
  const setShowShareBox = useSetRecoilState(showShareBoxState);
  const setThreadId = useSetRecoilState(ThreadState.threadIdState);
  const setThreadTitle = useSetRecoilState(ThreadState.threadTitleState);
  const setIsCreateThread = useSetRecoilState(ThreadState.isCreateThreadState);
  const setIsReplyThread = useSetRecoilState(ThreadState.isReplyThreadState);
  const setIsReplyComment = useSetRecoilState(ThreadState.isReplyCommentState);
  const setReplyFromContentText = useSetRecoilState(ThreadState.replyFromContentTextState);
  const onSetThreadInfoState = (idx) => {
    setThreadId(thread?.id);
    setThreadTitle(thread?.title);
    setIsCreateThread(false);
    setIsReplyThread(false);
    // Reply Comment
    setIsReplyComment(true);

    setReplyFromContentText(`<blockquote>
    <p>${commentsFilled[idx]?.text}</p>
    </blockquote>
    <p>&nbsp;</p>`);
  };

  const isMobile = useRecoilValue(isMobileSizeState);
  const AuthUser = useAuthUser();
  const setIsModalVisible = useSetRecoilState(isModalVisibleState);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const setUserInfo = useSetRecoilState(userInfoState);
  const onUserClick = async (idx) => {
    if (AuthUser.id && AuthUser.id !== thread?.user?.id) {
      await axios.get(`/api/user/check?uid=${AuthUser.id}`).then((res) => {
        if (res.data.status === 'success') {
          showModal();
          setUserInfo(commentsFilled[idx].user);
        }
      });
    }
  };

  /**
   * @author mengtongun
   * @returns Promise<{cmtLikeIds,cmtDislikeIds}>
   */
  const getUserCommentActivity = async () => {
    const reqDomain = withDomain('/api/user/activity');
    // ! Use uid as cmt query
    const [likedIds, dislikedIds] = await Promise.all([
      axios.get(`${reqDomain}/likes/?cmt=${AuthUser.id}`).then((res) => res.data),
      axios.get(`${reqDomain}/dislikes/?cmt=${AuthUser.id}`).then((res) => res.data),
    ]);

    return {
      likedIds,
      dislikedIds,
    };
  };

  useAsyncEffect(async () => {
    if (AuthUser.id && comments) {
      const { likedIds, dislikedIds } = await getUserCommentActivity();
      const newCmt = comments.map((comment) => {
        const isLiked = likedIds?.includes(comment?.id);
        const isDisliked = dislikedIds?.includes(comment?.id);

        return { ...comment, isLiked, isDisliked };
      });
      setCommentsFilled(newCmt);
    } else {
      setCommentsFilled(comments);
    }
  }, [comments]);

  return commentsFilled?.map((comment, idx) => (
    <div
      className={classNames(isMobile ? 'px-3' : 'px-8')}
      key={comment.id}
      ref={commentsFilled?.length === idx + 1 ? observe : null}
    >
      <motion.div
        className='w-full h-auto bg-primary p-3 mb-3 rounded-xl'
        initial={{ x: '-100%' }}
        animate={{ x: ['-100%', '0%'] }}
        transition={{ duration: 0.2 }}
      >
        {/* Title Post Bar */}
        <div className='flex justify-between text-secondary'>
          <div className='flex space-x-1'>
            <span className='rounded-2xl text-xl '>
              {comment?.user?.gender === 'Male' && <IoMdMale className='mt-0.5 text-blue-500' />}
              {comment?.user?.gender === 'Female' && (
                <IoMdFemale className='mt-0.5 text-pink-500' />
              )}
              {(comment?.user?.gender === undefined ||
                comment?.user?.gender === 'Not Specified') && (
                <FaGenderless className='mt-0.5 text-purple-500' />
              )}
            </span>
            <p>
              <span className='text-md pl-2'>
                {/* <a href={`/user/${comment?.user?.id}`}>{comment?.user?.nickname}</a> */}
                <button onClick={() => onUserClick(idx)} type='button'>
                  {comment?.user?.nickname}
                </button>
              </span>
              <span className='text-md text-primary text-opacity-50 pl-2'>&bull;</span>
              <span className='text-sm text-primary text-opacity-50 pl-2'>
                {moment(comment?.createdAt).fromNow()}
              </span>
            </p>
            <span className=' px-3 mt-1 text-lg hover:text-primary cursor-pointer'>
              <RiShareForwardFill
                onClick={() => {
                  onSetThreadInfoState();
                  setShowShareBox(true);
                }}
              />
            </span>
          </div>
          <div>
            <span className='inline-block text-gray-800 text-2xl text-opacity-50 hover:text-opacity-100 cursor-pointer'>
              <a href='###'>
                <BsThreeDots />
              </a>
            </span>
          </div>
        </div>
        {/* Post Content Body */}

        <div className='py-4 pl-1 text-primary text-md overflow-auto'>
          <div dangerouslySetInnerHTML={{ __html: comment?.text }} />
        </div>
        <div className='pb-1'>
          <ActivityBtn comment={comment} onSetThreadInfoState={() => onSetThreadInfoState(idx)} />
        </div>
      </motion.div>
    </div>
  ));
};

export default ReplyPost;
