import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import * as ConfirmState from '../../../recoil/confirmbox';
import * as ThreadState from '../../../recoil/thread';

export default function index() {
  const router = useRouter();
  const setShowHistoryConfirmBox = useSetRecoilState(ConfirmState.showHistoryConfirmBoxState);
  const setThreadSelectedList = useSetRecoilState(ThreadState.threadSelectedListState);
  // onConfirm

  const onConfirm = async () => {
    localStorage.removeItem('localHistory');
    setThreadSelectedList([]);
    setShowHistoryConfirmBox(false);

    router.push('/history', undefined, { shallow: false });
  };
  // onCancel
  const onCancel = () => {
    setShowHistoryConfirmBox(false);
  };
  return (
    <div className='fixed w-full top-1/2 h-full bottom-0 right-0 left-0 z-20 m-auto max-w-md text-white '>
      <div className='flex flex-col bg-primary shadow-xl rounded-lg border border-gray-500 border-opacity-20'>
        <div className='bg-third rounded-t-lg p-3 text-center text-xl'>
          <p>Are you sure?</p>
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
