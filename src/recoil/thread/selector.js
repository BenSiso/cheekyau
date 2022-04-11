import { selector } from 'recoil';
import {
  isCreateThreadState,
  isReplyCommentState,
  isReplyThreadState,
  threadIdState,
  threadTitleState,
} from './atom';

export const threadInfoState = selector({
  key: 'threadInfo',
  get: ({ get }) => {
    const title = get(threadTitleState);
    const id = get(threadIdState);
    const createThread = get(isCreateThreadState);
    const replyThread = get(isReplyThreadState);
    const replyComment = get(isReplyCommentState);
    return {
      title,
      id,
      createThread,
      replyThread,
      replyComment,
    };
  },
});
