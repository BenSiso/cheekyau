import { notification } from 'antd';
import axios from 'axios';
import classNames from 'classnames';
import { useAuthUser } from 'next-firebase-auth';
import { useEffect, useState } from 'react';
import { FaComment } from 'react-icons/fa';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import { useSetRecoilState } from 'recoil';
import * as AuthState from '../../../../recoil/auth';
import * as PostState from '../../../../recoil/post';
import { commentIdState } from '../../../../recoil/thread';
import { withDomain } from '../../../../utilities/dev';

function ActivityBtn({ comment, onSetThreadInfoState }) {
  // Global Variable

  const activityUrl = withDomain('/api/create/activity/comment');
  const AuthUser = useAuthUser();

  // Post Data

  const postActivity = {
    tid: comment?.tid,
    commentId: comment?.id,
    text: comment?.text,
    uid: AuthUser.id,
    createdAt: new Date(),
    commentOwner: comment?.user,
  };

  // Auth State
  const setShowLoginBox = useSetRecoilState(AuthState.showLoginBoxState);
  const setShowCreateReplyPost = useSetRecoilState(PostState.showCreatePostState);
  const setCommentId = useSetRecoilState(commentIdState);

  /* Like React State */
  const [likeCount, setLikeCount] = useState(comment?.likeCount);
  const [isLiked, setIsLiked] = useState(false);

  /* Dislike React State */
  const [dislikeCount, setDislikeCount] = useState(comment?.dislikeCount);
  const [isDisliked, setIsDisliked] = useState(false);

  // Callback every reload page >one time< each 'comment'
  useEffect(async () => {
    try {
      if (AuthUser.id && comment?.id) {
        // Check Data
        if (comment?.isLiked) {
          setIsLiked(true);
        }
        if (comment?.isDisliked) {
          setIsDisliked(true);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [AuthUser, comment]);

  /*
                ____________________________________
               |             Like Handle            |
               |____________________________________|
 */

  const onLike = async () => {
    await axios.post(`${activityUrl}/like`, postActivity).then((res) => {
      if (res.data.status === 'banned') {
        notification.error({
          message: 'Warning',
          description: 'You are banned from this site',
        });
        return;
      }
      setLikeCount(likeCount + 1);
      setIsLiked(true);
      notification.success({
        message: 'Success',
        description: `You liked ${comment?.user?.nickname}'s comment`,
      });
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
      setDislikeCount(dislikeCount + 1);
      setIsDisliked(true);
      notification.success({
        message: 'Success',
        description: `You disliked ${comment?.user?.nickname}'s comment`,
      });
    });
  };

  return (
    <div className='h-6 flex justify-start max-w-xs space-x-4 pl-1' key={comment?.id}>
      <div className='flex justify-between space-x-3  bg-transparent w-auto h-auto rounded-md text-secondary text-sm'>
        <div className='flex justify-center space-x-1 '>
          <GoArrowUp
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
          <GoArrowDown
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
          <p className='text-xs mt-1.5 text-secondary'>{comment?.replyCount || ''}</p>
        </div>
      </div>
      <button
        type='button'
        className=' bg-reply-btn hover:opacity-80 text-white cursor-pointer h-7 w-14 rounded-xl  '
        onClick={() => {
          if (AuthUser.id) {
            setShowCreateReplyPost(true);
            setCommentId(comment?.id);
            onSetThreadInfoState();
          } else setShowLoginBox(true);
        }}
      >
        <p className='text-xs text-center'>Reply</p>
      </button>
    </div>
  );
}
export default ActivityBtn;
