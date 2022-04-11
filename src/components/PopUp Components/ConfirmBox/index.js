import { useSetRecoilState } from 'recoil';
import * as ConfirmState from '../../../recoil/confirmbox';
import * as PostState from '../../../recoil/post';
import * as ThreadState from '../../../recoil/thread';

export default function index() {
  const setShowConfirmBox = useSetRecoilState(ConfirmState.showConfirmBoxState);
  const setShowCreatePost = useSetRecoilState(PostState.showCreatePostState);
  const setIsContentEmpty = useSetRecoilState(ThreadState.isContentEmptyState);
  // onConfirm

  const onConfirm = () => {
    setShowConfirmBox(false);
    setShowCreatePost(false);
    setIsContentEmpty(true);
  };
  // onCancel
  const onCancel = () => {
    setShowConfirmBox(false);
    setIsContentEmpty(false);
  };
  return (
    <div className='fixed w-full top-1/2 h-full bottom-0 right-0 left-0 z-50 m-auto max-w-md text-white'>
      <div className='flex flex-col bg-primary shadow-xl rounded-lg border border-gray-500 border-opacity-20'>
        <div className='bg-third rounded-t-lg p-3 text-center text-xl'>
          <p>Are you sure to discard the draft?</p>
        </div>
        <div className='flex justify-evenly'>
          <button
            type='button'
            className='py-2 w-24  bg-blue-400 my-10 rounded-md shadow-md hover:opacity-70'
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            type='button'
            className='py-2 w-24  bg-red-400 my-10 rounded-md shadow-md hover:opacity-70'
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
