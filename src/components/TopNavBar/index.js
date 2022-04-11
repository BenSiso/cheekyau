import { useRequest } from 'ahooks';
import axios from 'axios';
import classNames from 'classnames';
import dashify from 'dashify';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineMenu, AiOutlineSearch } from 'react-icons/ai';
import { BiPlus } from 'react-icons/bi';
import { IoMdNotifications } from 'react-icons/io';
import { useRecoilState, useSetRecoilState } from 'recoil';
import * as AuthState from '../../recoil/auth';
import * as PostState from '../../recoil/post';
import * as SideBarState from '../../recoil/sidebar';
import * as ThreadState from '../../recoil/thread';

const TopNav = ({ thread }) => {
  const AuthUser = useAuthUser();
  const router = useRouter();

  // Request API
  const onGetNotifications = async () => {
    const res = await axios.get(`/api/notifications?uid=${AuthUser.id}`);
    return res.data.notifications;
  };
  const { data: notifications, loading: isNotifyLoading } = useRequest(onGetNotifications, {
    pollingInterval: 60 * 1000,
  });

  // Auth State
  const setShowLoginBox = useSetRecoilState(AuthState.showLoginBoxState);
  const setShowRegisterPage = useSetRecoilState(AuthState.showRegisterPageState);
  const setShowNotificationBox = useSetRecoilState(AuthState.showNotificationState);
  // SideBar State
  const [showSideBar, setShowSideBar] = useRecoilState(SideBarState.showSideBarState);

  // Recoil Atom State
  const setShowCreatePost = useSetRecoilState(PostState.showCreatePostState);
  const setThreadId = useSetRecoilState(ThreadState.threadIdState);
  const setThreadTitle = useSetRecoilState(ThreadState.threadTitleState);
  const setIsCreateThread = useSetRecoilState(ThreadState.isCreateThreadState);
  const setIsReplyThread = useSetRecoilState(ThreadState.isReplyThreadState);
  const setIsReplyComment = useSetRecoilState(ThreadState.isReplyCommentState);

  const onSetThreadInfoState = (
    id = '',
    title = '',

    createThread = false,
    replyThread = false,
    replyComment = false
  ) => {
    if (thread?.tid !== undefined) setThreadId(thread?.tid);
    else setThreadId(id);

    setThreadTitle(title);
    setIsCreateThread(createThread);
    setIsReplyThread(replyThread);
    setIsReplyComment(replyComment);
  };
  // React State
  const [searchText, setSearchText] = useState('');

  // Function handle Register Click
  const showRegisterPage = () => {
    setShowRegisterPage(true);
    router.push('/register');
  };

  // Function handling logout
  const logout = () => {
    AuthUser.signOut();
  };

  // Function handle change text
  const updateSearchText = (e) => {
    setSearchText(dashify(e.target.value));
  };
  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      router.push(`/search?q=${searchText}`);
    }
  };
  const onSearchClick = () => {
    router.push(`/search?q=${searchText}`);
  };

  return (
    <div className='flex justify-between flex-shrink-0 bg-top-nav-dark'>
      <div className='w-full h-16 bg-top-nav-dark'>
        <div className='flex justify-between mt-3 text-primary'>
          <div className='flex-1 flex space-x-2 text-2xl pl-6 justify-start '>
            <AiOutlineMenu
              className='text-3xl hover:opacity-75 cursor-pointer'
              onClick={() => setShowSideBar(!showSideBar)}
            />
            <a href='/' className='w-10 h-10 bg-third p-2 rounded-full -mt-1 hover:opacity-60'>
              <img className='flex-none ' src='/images/logo.png' alt='' />
            </a>
            <a href='/' className='w-28  '>
              <img className='flex-none' src='/images/cheeky-word.png' alt='' />
            </a>
          </div>
          <div className='text-2xl flex-grow flex justify-center w-full max-w-3xl min-w-150'>
            {/* Input Search Bar */}
            <input
              className='bg-search-bar xl:w-11/12  md:w-3/4 sm:w-3/4 h-9 rounded-md px-4 pl-4 pr-10 text-xl'
              type='text'
              onChange={updateSearchText}
              onKeyPress={handleEnterKey}
            />
            <AiOutlineSearch
              className='-ml-8 mt-1.5 cursor-pointer hover:opacity-70'
              onClick={onSearchClick}
            />
          </div>
          {/* Right Top Header */}

          <div className=' flex-1 flex space-x-6 pr-6 justify-end pl-8 '>
            <div
              className={classNames(
                'w-8 h-8 rounded-3xl bg-fourth  mt-0.5 hover:bg-opacity-70',
                AuthUser.id && 'relative right-12'
              )}
            >
              <button
                type='button'
                className='pl-1 pt-1 text-primary text-2xl'
                onClick={() => {
                  if (AuthUser.id) {
                    onSetThreadInfoState('', '', true, false, false);
                    setShowCreatePost(true);
                  } else setShowLoginBox(true);
                }}
              >
                <BiPlus />
              </button>
            </div>
            <button
              type='button'
              className={classNames(
                'text-4xl text-primary  hover:text-opacity-70 relative',
                AuthUser.id && 'relative right-12'
              )}
              onClick={() => {
                if (AuthUser?.id) {
                  setShowNotificationBox(true);
                } else {
                  setShowLoginBox(true);
                }
              }}
            >
              <IoMdNotifications />
              {AuthUser.id && notifications?.length > 0 && (
                <div className='px-1 py-0 bg-red-500 absolute top-0 right-0 text-xs rounded-full'>
                  {!isNotifyLoading && <span>{`${notifications?.length || 0}`}</span>}
                </div>
              )}
            </button>

            {!AuthUser.id && (
              <button
                type='button'
                className='text-xl whitespace-nowrap mt-1 text-secondary hover:opacity-70 cursor-pointer'
                onClick={showRegisterPage}
              >
                Sign Up
              </button>
            )}
            {!AuthUser.id && (
              <button
                type='button'
                className='text-xl whitespace-nowrap mt-1 text-secondary hover:opacity-70 cursor-pointer'
                onClick={() => setShowLoginBox(true)}
              >
                Login
              </button>
            )}
            {AuthUser.id && (
              <button
                type='button'
                className='text-xl mt-1 text-gray-500 hover:opacity-70 cursor-pointer'
                onClick={logout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopNav;
