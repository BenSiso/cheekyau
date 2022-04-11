import axios from 'axios';
import classNames from 'classnames';
import { useAuthUser } from 'next-firebase-auth';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { BsArrowLeft, BsBookmarkFill } from 'react-icons/bs';
import { FaComment } from 'react-icons/fa';
import { HiShare, HiThumbDown, HiThumbUp } from 'react-icons/hi';
import { RiShareForwardFill } from 'react-icons/ri';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isMobileSizeState, routeState } from '../../../recoil';
import * as AuthState from '../../../recoil/auth';
import * as PostState from '../../../recoil/post';
import { showShareBoxState } from '../../../recoil/sharebox/atom';
import * as ThreadState from '../../../recoil/thread';
import { withDomain } from '../../../utilities/dev';

const mixedCategoriesPath = ['popular', 'all'];

function index({ thread }) {
  // Global
  const AuthUser = useAuthUser();
  const activityUrl = withDomain('/api/create/activity/thread');
  const [isSaved, setIsSaved] = useState(false);
  /* _____________________________
          Recoil Atom State
          _________________
*/
  // Route State
  const { isThreadPath, isCategoryPath, isBookmarkPath, lastPath } = useRecoilValue(routeState);
  const shouldGoBackCategory = mixedCategoriesPath.every((p) => !lastPath.includes(p));

  // Responsive State
  const isMobile = useRecoilValue(isMobileSizeState);
  // For CreatePost UI
  const setShowCreateReply = useSetRecoilState(PostState.showCreatePostState);
  const setShowShareBox = useSetRecoilState(showShareBoxState);
  const setThreadId = useSetRecoilState(ThreadState.threadIdState);
  const setThreadTitle = useSetRecoilState(ThreadState.threadTitleState);
  const setIsCreateThread = useSetRecoilState(ThreadState.isCreateThreadState);
  const setIsReplyThread = useSetRecoilState(ThreadState.isReplyThreadState);
  const setIsReplyComment = useSetRecoilState(ThreadState.isReplyCommentState);
  const setReplyFromContentTextState = useSetRecoilState(ThreadState.replyFromContentTextState);
  const onSetThreadInfoState = (
    id = '',
    title = '',
    createThread = false,
    replyThread = true,
    replyComment = false
  ) => {
    setThreadId(id);
    setThreadTitle(title);
    setIsCreateThread(createThread);
    setIsReplyThread(replyThread);
    setIsReplyComment(replyComment);
    setReplyFromContentTextState('');
  };

  /*
                     ____________________________________
                    |           Bookmark Handle          |
                    |____________________________________|
 */

  // Check bookmark

  useEffect(async () => {
    if (!isBookmarkPath) {
      if (AuthUser.id && thread?.tid) {
        const res = await axios.post(withDomain(`/api/create/activity/thread/bookmark/check`), {
          tid: thread?.tid,
          uid: AuthUser.id,
        });
        const isSavedRes = res.data.isSaved;
        setIsSaved(isSavedRes);
      }
    }
  }, [thread]);

  // Data for posting
  const postBookmark = {
    thread,
    uid: AuthUser.id,
    isSaved,
  };

  const onSave = async () => {
    setIsSaved(true);
    await axios.post(withDomain(`/api/create/activity/thread/bookmark/add`), postBookmark);
  };

  const onSaved = async () => {
    setIsSaved(false);
    await axios.post(withDomain(`/api/create/activity/thread/bookmark/add`), postBookmark);
  };

  // ===========================End Bookmark=====================================

  // Data for body posting

  const postActivity = {
    likeCount: thread?.likeCount,
    tid: thread?.id,
    text: thread?.title,
    uid: AuthUser.id,
    createdAt: new Date(),
    threadOwner: thread?.user,
  };

  // Like State
  const [likeCount, setLikeCount] = useRecoilState(ThreadState.likeCountThreadState);
  const [isLiked, setIsLiked] = useRecoilState(ThreadState.isLikedThreadState);

  // Dislike State
  const [dislikeCount, setDislikeCount] = useRecoilState(ThreadState.dislikeCountThreadState);
  const [isDisliked, setIsDisliked] = useRecoilState(ThreadState.isDislikedThreadState);

  // Auth State
  const setShowLoginBox = useSetRecoilState(AuthState.showLoginBoxState);

  /*
                     ____________________________________
                    |             Like Handle            |
                    |____________________________________|
 */

  const onLike = async () => {
    setLikeCount(likeCount + 1);
    setIsLiked(true);
    await axios.post(`${activityUrl}/like`, postActivity);
  };

  /*
                   ____________________________________
                  |           Dislike Handle           |
                  |____________________________________|
*/

  const onDislike = async () => {
    setDislikeCount(dislikeCount + 1);
    setIsDisliked(true);
    await axios.post(`${activityUrl}/dislike`, postActivity);
  };

  // Finding number of pages

  // // Back to thread page handle

  // const findPage = (e) => {
  //   const element = document.getElementById('threadScroll');
  //   const page = Math.floor(e);
  //   const target = (page - 2) * (window.innerHeight - 100);
  //   if (!element) {
  //     return;
  //   }
  //   if (page === 1) {
  //     element.scrollTo(0, 0);
  //   } else if (page === 2) {
  //     element.scrollTo(0, window.innerHeight - 100);
  //   } else if (page === 3) {
  //     element.scrollTo(0, window.innerHeight);
  //   } else {
  //     element.scrollTo(0, target);
  //   }
  // };

  return (
    <div className='relative bg-right-panel-header-dark w-auto h-12  shadow-sm text-xl'>
      {!isThreadPath ? (
        <div> </div>
      ) : (
        <div className='flex justify-between '>
          <button
            className='text-primary hover:text-gray-700 pt-3 px-3 pb-3'
            type='button'
            onClick={() => {
              if (
                shouldGoBackCategory &&
                ((isMobile && isCategoryPath) || (isMobile && isThreadPath))
              ) {
                router.push(`/category/${thread?.cid}`, `/category/${thread?.cid}`, {
                  shallow: true,
                  scroll: false,
                });
                return;
              }
              router.back({ shallow: true });
            }}
          >
            <BsArrowLeft />
          </button>
          <div className='pt-3 px-3 pb-3 flex-grow flex justify-start truncate'>
            <p className='truncate text-fourth text-xl -mt-1 '>{thread?.title}</p>
          </div>
          <div className='  sm:block md:hidden cursor-pointer text-white'>
            <a href='#shareUrl'>
              <button
                className='hover:text-gray-700 pt-3 px-3 pb-3'
                type='button'
                onClick={() => {
                  setShowShareBox(true);
                  onSetThreadInfoState(thread?.tid, thread?.title, thread?.id);
                }}
              >
                <AiOutlineShareAlt />
              </button>
            </a>
          </div>
          <div className='sm:hidden md:block text-secondary hidden'>
            <div className='flex justify-end text-xl space-x-3'>
              <div className='flex'>
                <button
                  type='button'
                  className='mb-1.5 px-3 hover:text-gray-700'
                  onClick={() => {}}
                >
                  <HiThumbUp
                    className={classNames(
                      isLiked
                        ? 'text-fifth hover:text-secondary'
                        : 'text-secondary hover:text-fifth'
                    )}
                    onClick={() => {
                      if (AuthUser.id) {
                        if (!isLiked) onLike();
                      } else setShowLoginBox(true);
                    }}
                  />
                </button>
                <p className='text-xs pt-3 -ml-2'>{likeCount === 0 ? '' : likeCount}</p>
              </div>
              <div className='flex'>
                <button
                  type='button'
                  className='px-3'
                  onClick={() => {
                    if (AuthUser.id) {
                      if (!isDisliked) onDislike();
                    } else setShowLoginBox(true);
                  }}
                >
                  <HiThumbDown
                    className={classNames(
                      ' text-xl cursor-pointer',
                      isDisliked
                        ? 'text-fifth hover:text-secondary'
                        : 'text-secondary hover:text-fifth'
                    )}
                  />
                </button>
                <p className='text-xs pt-3 -ml-2'>{dislikeCount === 0 ? '' : dislikeCount}</p>
              </div>

              {/* Show Reply Button */}
              <div className='flex'>
                <button
                  type='button'
                  className='px-3 text-secondary hover:text-fifth'
                  onClick={() => {
                    if (AuthUser.id) {
                      onSetThreadInfoState(thread?.id, thread?.title, false, true, false);
                      setShowCreateReply(true);
                    } else setShowLoginBox(true);
                  }}
                >
                  <FaComment />
                </button>
                <p className='text-xs pt-3 -ml-2'>{thread?.commentCount || ' '}</p>
              </div>
              {/* Share Button */}
              <button
                type='button'
                className='pt-3 px-3 pb-3 text-secondary hover:text-fifth'
                onClick={() => {
                  setShowShareBox(true);
                  onSetThreadInfoState(thread?.id, thread?.title, false);
                }}
              >
                <RiShareForwardFill />
              </button>
              <button
                type='button'
                className={classNames(
                  ' text-xl cursor-pointer pr-12',
                  isSaved ? 'text-fifth hover:text-secondary' : 'text-secondary hover:text-fifth'
                )}
                onClick={() => {
                  if (AuthUser.id) {
                    if (isSaved) onSaved();
                    else onSave();
                  } else setShowLoginBox(true);
                }}
              >
                <BsBookmarkFill />
              </button>
              <div className='hidden'>
                <a href='#Share'>
                  <button
                    type='button'
                    className='pt-3 px-3 pb-3 hover:text-gray-700'
                    onClick={() => {
                      setShowShareBox(true);
                      onSetThreadInfoState(thread?.id, thread?.title, false);
                    }}
                  >
                    <HiShare />
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default index;
