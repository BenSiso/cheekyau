import { atom } from 'recoil';

/*
=================================================
               For CreatePost UI
=================================================
*/
const threadTitleState = atom({
  key: 'threadTitle',
  default: '',
});
const threadIdState = atom({
  key: 'threadId',
  default: '',
});
const isCreateThreadState = atom({
  key: 'isCreateThread',
  default: false,
});
const isReplyThreadState = atom({
  key: 'isReplyThread',
  default: false,
});
const isReplyCommentState = atom({
  key: 'isReplyComment',
  default: false,
});
const isContentEmptyState = atom({
  key: 'isContentEmpty',
  default: true,
});
const selectedCatIdState = atom({
  key: 'selectedCatId',
  default: '1',
});
const replyFromContentTextState = atom({
  key: 'replyFromContentText',
  default: '',
});

const commentIdState = atom({
  key: 'commentId',
  default: '',
});

/*
=================================================
               For History Page
=================================================
*/

const showSelectThreadState = atom({
  key: 'showSelectThread',
  default: false,
});
const showCancelSelectThreadState = atom({
  key: 'showCancelSelection',
  default: false,
});

const threadSelectedListState = atom({
  key: 'threadSelectedList',
  default: [],
});

/*
=================================================
               For Handle Activity Update
=================================================
*/
const likeCountThreadState = atom({
  key: 'likCountThread',
  default: '0',
});
const dislikeCountThreadState = atom({
  key: 'dislikeCountThread',
  default: '0',
});
const isLikedThreadState = atom({
  key: 'isLikedThread',
  default: false,
});
const isDislikedThreadState = atom({
  key: 'isDislikedThread',
  default: false,
});

/*
=================================================
               For Handle ReplyCount Update
=================================================
*/
const commentCountState = atom({
  key: 'commentCount',
  default: '',
});

/*
=================================================
      !    For Handle Thread Data Flow
=================================================
*/

const threadState = atom({
  key: 'thread',
  default: {},
});

const threadListState = atom({
  key: 'threadList',
  default: [],
});

const commentsState = atom({
  key: 'comments',
  default: [],
});

export {
  commentCountState,
  dislikeCountThreadState,
  commentIdState,
  isContentEmptyState,
  isCreateThreadState,
  isDislikedThreadState,
  isLikedThreadState,
  isReplyCommentState,
  isReplyThreadState,
  likeCountThreadState,
  selectedCatIdState,
  showCancelSelectThreadState,
  showSelectThreadState,
  threadIdState,
  threadSelectedListState,
  threadTitleState,
  replyFromContentTextState,
  threadState,
  threadListState,
  commentsState,
};
