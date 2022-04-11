import { useAsyncEffect } from 'ahooks';
import axios from 'axios';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import useInView from 'react-cool-inview';
import { useRecoilValue } from 'recoil';
import { WindowSize } from '../../../constants';
import { routeState } from '../../../recoil';
import Thread from './Thread';

const ThreadList = ({ threadsProp, category }) => {
  const [threads, setThreads] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const { observe, inView } = useInView();
  const loader = (
    <div className='flex justify-center items-center py-4 text-primary space-x-4 text-center'>
      {hasMore ? (
        <>
          <div className='animate-spin rounded-full h-8 w-8 border-b border-t border-white' />
          <div>
            <p className=' text-white'>Loading...</p>
          </div>
        </>
      ) : (
        (threads?.length && <p className='text-primary'>You have seen it all</p>) || (
          <p className='text-primary font-bold'>Thread not found</p>
        )
      )}
    </div>
  );

  /* ************************
          Recoil State
          *************
*/

  // Route Path State
  const { isAllPath, isBookmarkPath, isCategoryPath, isHistoryPath, isThreadPath, isPopularPath } =
    useRecoilValue(routeState);

  // Check First Enter the site for length

  useEffect(() => {
    setThreads(threadsProp);
    if (threadsProp?.length >= 10) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
  }, [threadsProp]);
  // Update when scroll to the bottom component
  useAsyncEffect(async () => {
    let lastLikeCount;
    let lastTid;
    if (hasMore) {
      lastLikeCount = threads[threads?.length - 1]?.likeCount;
      lastTid = threads[threads?.length - 1]?.tid;
    }
    if (inView && hasMore) {
      const postData = {
        lastTid,
        cid: threads[0]?.cid,
        lastLikeCount,
        isAllPath,
        isCategoryPath,
        isThreadPath,
        isHistoryPath,
        isPopularPath,
        isBookmarkPath,
      };
      const res = await axios.post('/api/thread/next', postData);
      const threadsNext = await res.data.payload.threads;
      if (threadsNext.length > 0) {
        if (threadsNext.length === 10) {
          setThreads(threads.concat(threadsNext));
        } else {
          setThreads(threads.concat(threadsNext));

          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    }
  }, [inView, hasMore]);

  return (
    <div className='bg-left-panel-header-dark h-full '>
      {/* Thread List Container */}

      <div
        className={classNames(
          'w-full bg-left-panel-body-dark  h-full pb-20 overflow-auto',
          window.innerWidth < WindowSize.tablet.width && 'scrollbar-hide'
        )}
      >
        {/* ThreadList Items */}
        {threads?.map((thread, idx) => (
          <div
            key={thread?.tid}
            ref={threads?.length === idx + 1 ? observe : null}
            className={classNames(
              window.innerWidth < WindowSize.tablet.width ? 'px-3 py-1' : 'px-4 py-1'
            )}
          >
            <Thread thread={thread} category={category} />
          </div>
        ))}
        {loader}
      </div>
    </div>
  );
};

export default ThreadList;
