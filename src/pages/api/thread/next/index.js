/* eslint-disable no-console */
import { Thread } from '../../../../model';
import initAuth from '../../../../services/initAuth';

initAuth();
export default async (req, res) => {
  let threads = [];
  const {
    lastTid,
    cid,
    lastLikeCount,
    isThreadPath,
    isCategoryPath,
    isAllPath,
    isPopularPath,
    isHistoryPath,
    isBookmarkPath,
  } = req.body;
  if (isThreadPath) {
    threads = await Thread.getByCategoryNext(cid, lastTid);
    console.log('Thread Page');
  }
  if (isCategoryPath) {
    threads = await Thread.getByCategoryNext(cid, lastTid);
    console.log('Category Page');
  }
  if (isAllPath) {
    threads = await Thread.getNextThreads(lastTid);
    console.log('All Page');
  }
  if (isPopularPath) {
    threads = await Thread.getNextPopular(lastLikeCount);
    console.log('Popular Page');
  }
  if (isHistoryPath || (isThreadPath && isHistoryPath)) {
    //  Todo Fetch the next thread from user activity
    threads = [];
    console.log('History Page');
  }
  if (isBookmarkPath || (isThreadPath && isBookmarkPath)) {
    //  Todo Fetch the next thread from user activity
    threads = [];

    console.log('Boomark Page Page');
  }
  // threads = await Thread.getNextThreads(lastTid);
  // const threads = await Thread.getByCategory('2');

  res.status(200).json({
    status: 'success',
    payload: {
      threads,
    },
  });
};
