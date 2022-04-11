import { notification } from 'antd';
import axios from 'axios';
import classNames from 'classnames';
import { useAuthUser } from 'next-firebase-auth';
import { useEffect } from 'react';
import { FaComment } from 'react-icons/fa';
import { HiThumbDown, HiThumbUp } from 'react-icons/hi';
import { useRecoilState, useSetRecoilState } from 'recoil';
import * as AuthState from '../../../../recoil/auth';
import * as PostState from '../../../../recoil/post';
import * as ThreadState from '../../../../recoil/thread';
import { withDomain } from '../../../../utilities/dev';

function ActivityBtn({ thread, onSetThreadInfoState }) {
  const AuthUser = useAuthUser();
  const activityUrl = withDomain('/api/create/activity/thread');

  // Data for body posting

  const postActivity = {
    likeCount: thread?.likeCount,
    tid: thread?.id,
    text: thread?.title,
    uid: AuthUser.id,
    threadOwner: thread?.user,
  };

  /* _____________________________
          Recoil Atom State
          _________________
*/

  // Create Post State
  const setShowCreateReplyPost = useSetRecoilState(PostState.showCreatePostState);
  // Auth State
  const setShowLoginBox = useSetRecoilState(AuthState.showLoginBoxState);

  // For Activity
  // Like State
  const [likeCount, setLikeCount] = useRecoilState(ThreadState.likeCountThreadState);
  const [isLiked, setIsLiked] = useRecoilState(ThreadState.isLikedThreadState);

  // Dislike State
  const [dislikeCount, setDislikeCount] = useRecoilState(ThreadState.dislikeCountThreadState);
  const [isDisliked, setIsDisliked] = useRecoilState(ThreadState.isDislikedThreadState);
  // Callback every reload page >one time< each 'comment'

  /*
                     ____________________________________
                    |             Like Handle            |
                    |____________________________________|
 */
  useEffect(async () => {
    setLikeCount(thread?.likeCount);
    setDislikeCount(thread?.dislikeCount);
    try {
      // Update when the page load
      if (AuthUser.id && thread?.id) {
        // Posting Data
        const checkData = {
          tid: thread?.id,
          uid: AuthUser.id,
        };
        // Response from api
        const resLike = await axios.post(`${activityUrl}/like/check`, checkData);
        const resDislike = await axios.post(`${activityUrl}/dislike/check`, checkData);
        // Get data from api
        const isLikedCheck = await resLike.data;
        const isDislikedCheck = await resDislike.data;

        // Update Sate Each Component
        setIsLiked(isLikedCheck);
        setIsDisliked(isDislikedCheck);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [AuthUser, thread]);

  const onLike = async () => {
    await axios.post(`${activityUrl}/like`, postActivity).then((res) => {
      if (res.data.status === 'banned') {
        notification.error({
          message: 'Warning',
          description: 'You are banned from this site',
        });
        return;
      }
      setLikeCount(likeCount * 1 + 1);
      setIsLiked(true);
    });
  };

  /*
                            ____________________________________
                           |           Dislike Handle           |
                           |____________________________________|
             */

  // Callback every component 'comment'

  const onDislike = async () => {
    await axios.post(`${activityUrl}/dislike`, postActivity).then((res) => {
      if (res.data.status === 'banned') {
        notification.error({
          message: 'Warning',
          description: 'You are banned from this site',
        });
        return;
      }
      setDislikeCount(dislikeCount * 1 + 1);
      setIsDisliked(true);
    });
  };
  return (
    <div className='h-6 flex justify-start max-w-xs space-x-4 pl-1'>
      <div className='flex justify-between space-x-3  bg-transparent w-auto h-auto rounded-md text-secondary text-sm'>
        <div className='flex justify-center space-x-1 '>
          <HiThumbUp
            className={classNames(
              'mt-1 text-xl cursor-pointer',
              isLiked ? 'text-fifth' : 'text-secondary hover:text-fifth'
            )}
            onClick={() => {
              if (AuthUser.id) {
                if (!isLiked) onLike();
              } else setShowLoginBox(true);
            }}
          />
          <p className='text-xs mt-1.5'>{likeCount || ''}</p>
        </div>
        <div className='flex justify-center space-x-1'>
          <HiThumbDown
            className={classNames(
              'mt-1 text-xl cursor-pointer',
              isDisliked ? 'text-fifth' : 'text-secondary hover:text-fifth'
            )}
            onClick={() => {
              if (AuthUser.id) {
                if (!isDisliked) onDislike();
              } else setShowLoginBox(true);
            }}
          />
          <p className='text-xs mt-1.5'>{dislikeCount || ''}</p>
        </div>
      </div>
      <div className='bg-transparent h-auto w-auto rounded-md text-sm'>
        <div className='flex justify-center space-x-1 '>
          <FaComment className='mt-1 text-secondary text-xl hover:text-opacity-70 cursor-pointer' />
          <p className='text-xs mt-1.5 text-secondary'>{thread?.commentCount || ''}</p>
        </div>
      </div>
      <button
        onClick={() => {
          if (AuthUser.id) {
            onSetThreadInfoState();
            setShowCreateReplyPost(true);
          } else setShowLoginBox(true);
        }}
        type='button'
        className=' bg-reply-btn hover:opacity-80 text-white cursor-pointer h-7 w-14 rounded-xl '
      >
        <p className='text-xs text-center'>Reply</p>
      </button>
    </div>
  );
}
export default ActivityBtn;
