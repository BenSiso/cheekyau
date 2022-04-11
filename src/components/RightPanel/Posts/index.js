/* eslint-disable no-unused-vars */
// import PageTopic from './PageTopic';
// import PageController from './PageController';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import useInView from 'react-cool-inview';
import { IoCaretDownOutline, IoCaretUpOutline } from 'react-icons/io5';
import { useRecoilState, useRecoilValue } from 'recoil';
import { routeState } from '../../../recoil';
import * as PostState from '../../../recoil/post';
import { isBrowser } from '../../../utilities/dom';
import Post from './Post';
import ReplyPost from './ReplyPost';

export default function index({ thread, commentsProp }) {
  const [comments, setComments] = useState(commentsProp);
  const [hasMore, setHasMore] = useState(false);
  const [pageNum, setPageNum] = useRecoilState(PostState.pageNumState);
  const [scrollNum, setScrollNum] = useState(0);
  const [page, setPage] = useState([]);
  const [temp, setTemp] = useState(commentsProp);
  const router = useRouter();

  // Infinite scroll handling
  const [pageDict, setPageDict] = useState({});

  const { observe, inView, entry, unobserve } = useInView({
    onEnter: () => {
      const currentEntry = entry?.boundingClientRect?.y;
      const currentDic = { ...pageDict };
      currentDic[currentEntry] = pageNum;
      setPageDict(currentDic);
    },
  });

  const paginatePage = (scrollTop) => {
    const possiblePage = Object.keys(pageDict)
      .filter((key) => Number(key) < scrollTop)
      .reduce((obj, key) => {
        obj[key] = pageDict[key]; // eslint-disable-line no-param-reassign
        return obj;
      }, {});
    const { [Object.keys(possiblePage).pop()]: lastItem } = possiblePage;
    setScrollNum(scrollTop);
    page.map((load) => {
      if (scrollTop > load.scroll) {
        setPageNum(load.page + 1);
      } else {
        setPageNum(1);
      }
      return null;
    });
  };

  const loader = (
    <div className=' flex justify-center items-center py-4 text-primary space-x-4'>
      {hasMore ? (
        <>
          <div className='animate-spin rounded-full h-8 w-8 border-b border-t border-white' />
          <div>
            <p className=' text-white'>Loading...</p>
          </div>
        </>
      ) : (
        <p className='text-primary'>You have seen it all</p>
      )}
    </div>
  );

  const { isHistoryPath } = useRecoilValue(routeState);

  useEffect(() => {
    if (thread && !isHistoryPath) {
      const localThreads =
        (isBrowser && localStorage.getItem('localHistory')) || JSON.stringify([]);
      let prevLocalThreads = JSON.parse(localThreads).concat([thread]);
      prevLocalThreads = prevLocalThreads.filter(
        (value, idx, self) => idx === self.findIndex((localThread) => localThread.id === value.id)
      );
      const newLocalThreads = JSON.stringify(prevLocalThreads);
      const setLocalData = isBrowser && localStorage.setItem('localHistory', newLocalThreads);
    }
  }, [thread]);

  useEffect(() => {
    // init paginate
    setPage([
      {
        scroll: 0,
        page: 0,
        count: commentsProp?.length || 0,
      },
    ]);
    setComments(commentsProp);
    setTemp(commentsProp);
    if (commentsProp?.length >= 5) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
  }, [commentsProp]);

  useEffect(async () => {
    let lastCreatedAt;

    if (hasMore) {
      lastCreatedAt = comments[comments.length - 1]?.createdAt;
    }

    if (inView && hasMore) {
      const postData = {
        lastCreatedAt,
        tid: comments[0]?.tid,
      };
      const res = await axios.post('/api/thread/comment/next', postData);
      const commentsNext = await res.data.payload.comments;

      if (commentsNext.length > 0) {
        // paginate
        const newArr = [...page];
        newArr.push({
          scroll: scrollNum,
          page: Math.round(commentsNext.length / 25) + 1,
          count: commentsNext.length,
        });
        setPage(newArr);

        if (commentsNext.length === 25) {
          setComments(comments.concat(commentsNext));
          setTemp(comments.concat(commentsNext));
        } else {
          setComments(comments.concat(commentsNext));
          setTemp(comments.concat(commentsNext));
          setHasMore(false);
          unobserve();
        }
      } else {
        setHasMore(false);
        unobserve();
      }
    }
    return () => setPageNum(0);
  }, [inView, hasMore]);

  const onPrevPage = (pageNumber) => {
    let newObj1 = { ...page[pageNumber + 1] };
    const newObj2 = { ...page[pageNumber] };
    if (pageNumber < 1) {
      newObj1 = {
        count: 0,
      };
    }
    const newArr = [...temp].splice(newObj1.count, temp.length - newObj2.count);

    setComments([]);
    setTimeout(() => {
      setComments(newArr);
    }, 100);
  };

  const onNextPage = (pageNumber) => {
    const newObj = { ...page[pageNumber - 1] };
    const newArr = [...temp].splice(newObj.count, temp.length);

    setComments([]);
    setTimeout(() => {
      setComments(newArr);
    }, 100);
  };
  const rightPanel = useRef(null);
  useEffect(() => {
    rightPanel.current.scrollTo(0, 0);
    return () => {};
  }, [router]);
  return (
    <div className='relative h-full'>
      <div className='flex justify-center items-center flex-col bg-primary text-white border-2 border-gray-700 rounded-full p-1 text-xl absolute bottom-5 right-5 z-50 paginate'>
        <div className='paginate-child justify-center'>
          <button
            type='button'
            className='duration-300 hover:opacity-30'
            onClick={() => onPrevPage(1)}
          >
            <IoCaretUpOutline />
          </button>
        </div>
        <div className='flex flex-1 justify-center items-center group'>
          <span>{pageNum}</span>
        </div>
        <div className='paginate-child justify-center'>
          <button
            type='button'
            className='duration-300 hover:opacity-30'
            onClick={() => onNextPage(1)}
          >
            <IoCaretDownOutline />
          </button>
        </div>
      </div>
      <div
        id='threadScroll'
        className='w-full flex overflow-auto h-full '
        ref={rightPanel}
        onScroll={(e) => paginatePage(e.currentTarget.scrollTop)}
      >
        <div className='w-full flex-grow '>
          {/* End Header Tab */}

          {/* Start Page Header */}

          {/* <div className='w-full'> */}
          {/* Topic Thread Detail */}
          {/* <PageTopic /> */}
          {/* Page Control */}
          {/* <PageController /> */}
          {/* End Page Control */}
          {/* </div> */}
          {/* Start Card Post */}
          <Post thread={thread} />

          {comments?.length > 0 && (
            <ReplyPost thread={thread} comments={comments} observe={observe} />
          )}

          {loader}
        </div>
      </div>
    </div>
  );
}
