import { notification } from 'antd';
import { AiOutlineClose, AiOutlineCopy } from 'react-icons/ai';
import { FaFacebookF, FaTelegramPlane, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { showShareBoxState } from '../../../recoil/sharebox/atom';
import * as ThreadState from '../../../recoil/thread';
import { withDomain } from '../../../utilities/dev';

export default function index() {
  const threadId = useRecoilValue(ThreadState.threadIdState);
  const title = useRecoilValue(ThreadState.threadTitleState);
  const setShowShareBox = useSetRecoilState(showShareBoxState);
  const shareUrl = withDomain(`/thread/${threadId}`);

  function CopyToClipboard(containerid) {
    if (document.selection) {
      const range = document.body.createTextRange();
      range.moveToElementText(document.getElementById(containerid));
      range.select().createTextRange();
      document.execCommand('copy');
      notification.open({
        message: 'Copied to clipboard',
        description: `${title} \n\n Cheeky Forum \n ${shareUrl}`,
      });
      // Depreciated Website
    } else if (window.getSelection) {
      const range = document.createRange();
      range.selectNode(document.getElementById(containerid));
      window.getSelection().addRange(range);
      document.execCommand('copy');
      notification.open({
        message: 'Copied to clipboard',
        description: `${title} \n\n Cheeky Forum \n ${shareUrl}`,
      });
    }
  }
  return (
    <div className='fixed w-full top-1/2 h-full bottom-0 right-0 left-0 z-20 m-auto max-w-md text-white   '>
      <div className='flex justify-between h-12 bg-gray-800 border-b border-white border-opacity-20 rounded-t-md'>
        <div>
          <p className='p-4 font-bold'>Share</p>
        </div>
        <div>
          <button
            type='button'
            className='p-4 hover:bg-gray-700'
            onClick={() => {
              setShowShareBox(false);
            }}
          >
            <AiOutlineClose />
          </button>
        </div>
      </div>
      <div className='bg-gray-800 px-5 pt-8 pb-2 rounded-b-md '>
        <div className='bg-gray-900  border border-white border-opacity-10 focus:border-yellow-500 focus:border-opacity-50 rounded-md'>
          <div id='shareText' className='px-4 pt-2 pb-12 truncate'>
            {title} <br /> Cheeky Forum <br /> {shareUrl}
          </div>
        </div>
        {/* Social Link */}
        <div className='flex justify-start space-x-2 text-2xl py-3'>
          <button
            type='button'
            className='w-12 h-12 bg-gray-400 rounded-3xl text-center transform duration-300 hover:scale-110 cursor-pointer hover:text-blue-400 hover:bg-gray-300'
            onClick={() => CopyToClipboard('shareText')}
          >
            <AiOutlineCopy className='m-3' />
          </button>
          <a
            href={`https://t.me/share/url?url=${shareUrl}&text=${title}`}
            target='_blank'
            className='w-12 h-12 bg-blue-500 rounded-3xl transform duration-300 hover:scale-110 cursor-pointer hover:text-blue-500 hover:bg-white'
            rel='noreferrer'
          >
            <FaTelegramPlane className='m-3' />
          </a>
          <a
            href={`whatsapp://send?text=${title} - Cheeky Forum ${shareUrl}`}
            target='_blank'
            className='w-12 h-12 bg-green-400 rounded-3xl transform duration-300 hover:scale-110 cursor-pointer hover:text-green-400 hover:bg-white'
            rel='noreferrer'
          >
            <FaWhatsapp className='m-3' />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target='_blank'
            className='w-12 h-12 bg-blue-600 rounded-3xl transform duration-300 hover:scale-110 cursor-pointer hover:text-blue-600 hover:bg-white'
            rel='noreferrer'
          >
            <FaFacebookF className='m-3' />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${title} - Cheeky Forum ${shareUrl}`}
            target='_blank'
            data-action='share/whatsapp/share'
            className='w-12 h-12 bg-blue-400 rounded-3xl transform duration-300 hover:scale-110 cursor-pointer hover:text-blue-400 hover:bg-white'
            rel='noreferrer'
          >
            <FaTwitter className='m-3' />
          </a>
        </div>
      </div>
    </div>
  );
}
