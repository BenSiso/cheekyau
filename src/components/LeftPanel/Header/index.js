import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { AiOutlineClockCircle, AiOutlineMenu, AiOutlineSearch } from 'react-icons/ai';
import { BiPlus, BiRefresh } from 'react-icons/bi';
import { BsBookmarkFill, BsListCheck, BsX } from 'react-icons/bs';
import { IoIosListBox } from 'react-icons/io';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { TiTick } from 'react-icons/ti';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { routeState } from '../../../recoil';
import * as AuthState from '../../../recoil/auth';
import * as ConfirmState from '../../../recoil/confirmbox';
import * as PostState from '../../../recoil/post';
import { isMobileSizeState } from '../../../recoil/responsive';
import * as ThreadState from '../../../recoil/thread';
import { isBrowser } from '../../../utilities/dom';
import {
  CKAll,
  CKEducation,
  CKFashion,
  CKGaming,
  CKHealth,
  CKPopular,
  CKRelationship,
  CKSport,
} from '../../Icons';

function index({ category, thread }) {
  const AuthUser = useAuthUser();
  const router = useRouter();

  /* _____________________________
          Recoil Atom State
          _________________
  */

  // Responsive State
  const isMobile = useRecoilValue(isMobileSizeState);

  // Route State
  const {
    isAllPath,
    isBookmarkPath,
    isCategoryPath,
    isHistoryPath,
    isHomePath,
    isPopularPath,
    isSearchPath,
    isThreadPath,
  } = useRecoilValue(routeState);

  const setShowCreatePost = useSetRecoilState(PostState.showCreatePostState);
  // For History Page

  const [showSelectThread, setShowSelectThread] = useRecoilState(ThreadState.showSelectThreadState);
  const [showCancelSelect, setShowCancelSelect] = useRecoilState(
    ThreadState.showCancelSelectThreadState
  );
  const [threadSelectedList, setThreadSelectedList] = useRecoilState(
    ThreadState.threadSelectedListState
  );
  // Confrim State
  const setShowHistoryConfirmBox = useSetRecoilState(ConfirmState.showHistoryConfirmBoxState);

  // For CreatePost UI
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
    setThreadId(id);
    setThreadTitle(title);
    setIsCreateThread(createThread);
    setIsReplyThread(replyThread);
    setIsReplyComment(replyComment);
  };
  // Auth State
  const setShowLoginBox = useSetRecoilState(AuthState.showLoginBoxState);

  /*
          End Recoil Atom State
  */
  const LeftPanelTitle = ({ children, name }) => {
    return (
      <div className='py-6 text-3xl text-primary flex flex-row space-x-2 justify-center items-center truncate'>
        <div>{children}</div>
        <p>{name}</p>
      </div>
    );
  };
  // Header Widget
  const CategoryHeadIcon = () => {
    if (category?.cid === '1' || thread?.cid === '1') {
      return (
        <LeftPanelTitle name={category?.name}>
          <CKAll w='26' h='26' />
        </LeftPanelTitle>
      );
    }
    if (category?.cid === '2' || thread?.cid === '2') {
      return (
        <LeftPanelTitle name={category?.name}>
          <CKSport w='26' h='26' />
        </LeftPanelTitle>
      );
    }
    if (category?.cid === '3' || thread?.cid === '3') {
      return (
        <LeftPanelTitle name={category?.name}>
          <CKRelationship w='26' h='26' />
        </LeftPanelTitle>
      );
    }
    if (category?.cid === '4' || thread?.cid === '4') {
      return (
        <LeftPanelTitle name={category?.name}>
          <CKEducation w='26' h='26' />
        </LeftPanelTitle>
      );
    }
    if (category?.cid === '5' || thread?.cid === '5') {
      return (
        <LeftPanelTitle name={category?.name}>
          <CKHealth w='26' h='26' />
        </LeftPanelTitle>
      );
    }
    if (category?.cid === '6' || thread?.cid === '6') {
      return (
        <LeftPanelTitle name={category?.name}>
          <CKFashion w='26' h='26' />
        </LeftPanelTitle>
      );
    }
    if (category?.cid === '7' || thread?.cid === '7') {
      return (
        <LeftPanelTitle name={category?.name}>
          <CKGaming w='26' h='26' />
        </LeftPanelTitle>
      );
    }
    return (
      <div className='py-6 text-3xl text-primary flex space-x-2 justify-center items-center '>
        <IoIosListBox className='mt-1 animate-pulse' />
        <p className='animate-pulse'>Loading</p>
        <p className='animate-bounce'>...</p>
      </div>
    );
  };

  const onDeleteAll = async () => {
    // It will load a function in ConfirmBox Component
    setShowHistoryConfirmBox(true);
  };

  const onDeleteSelect = async () => {
    const getLocalHistory = isBrowser && localStorage.getItem('localHistory');
    const localHistory = JSON.parse(getLocalHistory) || [];
    const newLocalHistoryAfterDeleted = localHistory.filter((threadHistory) => {
      return !threadSelectedList.includes(+threadHistory.id);
    });
    // eslint-disable-next-line no-unused-vars
    const setLocalHistory = localStorage.setItem(
      'localHistory',
      JSON.stringify(newLocalHistoryAfterDeleted)
    );
    setShowSelectThread(!showSelectThread);
    setShowCancelSelect(!showCancelSelect);
    setThreadSelectedList([]);
    router.push('/history');
  };

  return (
    <div className='relative h-20 w-auto bg-left-panel-header-dark text-white text-xl '>
      <div className='flex justify-center md:justify-between'>
        <div className='invisible justify-start space-x-1 hover:bg-gray-700 p-3 mb-6 w-px-76 hidden md:flex '>
          <button type='button' className='' onClick={() => {}}>
            <AiOutlineMenu />
          </button>
        </div>

        {(isThreadPath || isCategoryPath) &&
        !isPopularPath &&
        !isAllPath &&
        !isBookmarkPath &&
        !isHistoryPath ? (
          <CategoryHeadIcon />
        ) : (
          <div className='py-6 text-3xl text-primary flex space-x-2 items-center justify-center'>
            {isHomePath && (
              <>
                <CKAll w='26' h='26' />
                <p>Home</p>
              </>
            )}
            {isPopularPath && (
              <>
                <CKPopular w='26' h='26' />
                <p>Popular</p>
              </>
            )}
            {isBookmarkPath && (
              <>
                <BsBookmarkFill />
                <p>Bookmark</p>
              </>
            )}
            {isHistoryPath && (
              <>
                <AiOutlineClockCircle />
                <p>History</p>
              </>
            )}
            {isAllPath && (
              <>
                <IoIosListBox />
                <p>All</p>
              </>
            )}
            {isSearchPath && (
              <>
                <AiOutlineSearch />
                <p>Results</p>
              </>
            )}
          </div>
        )}

        {isHistoryPath ? (
          // History Page Btn
          <div className='flex justify-end '>
            <button
              type='button'
              className='hover:bg-gray-700 py-3 px-2.5 mb-6'
              onClick={() => {
                if (showSelectThread) {
                  onDeleteSelect();
                } else {
                  onDeleteAll();
                }
              }}
            >
              {!showSelectThread ? <RiDeleteBin2Fill /> : <TiTick />}
            </button>

            <button
              type='button'
              className='hover:bg-gray-700 py-3 px-2.5 mb-6'
              onClick={() => {
                setShowSelectThread(!showSelectThread);
                setShowCancelSelect(!showCancelSelect);
              }}
            >
              {showCancelSelect ? <BsX /> : <BsListCheck />}
            </button>
            <button type='button' className='hover:bg-gray-700 py-3 px-2.5 mb-6' onClick={() => {}}>
              <BiRefresh />
            </button>
          </div>
        ) : (
          // Main Page Btn
          <div className='hidden md:flex justify-end py-2 px-2.5'>
            {/* <button
              type='button'
              className='hover:bg-gray-700 py-3 px-2.5 mb-6'
              onClick={() => {
                console.log('Refresh');
              }}
            >
              <BiRefresh />
            </button> */}
            {!isMobile && (
              <span className='w-10 h-10 rounded-3xl border-2 hover:bg-fourth  border-outline-add-btn hover:bg-opacity-80 mt-3 mr-4 '>
                <button
                  type='button'
                  className='pl-1.5 pt-1.5 text-2xl text-fourth'
                  onClick={() => {
                    if (AuthUser.id) {
                      onSetThreadInfoState('', '', true, false, false);
                      if (isThreadPath) setThreadId(thread?.tid);
                      setShowCreatePost(true);
                    } else setShowLoginBox(true);
                  }}
                >
                  <BiPlus />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default index;
