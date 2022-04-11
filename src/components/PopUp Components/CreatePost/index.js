/* eslint-disable no-restricted-globals */

import { Editor } from '@tinymce/tinymce-react';
import { notification } from 'antd';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaTelegramPlane } from 'react-icons/fa';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Env from '../../../constants/env';
import {
  commentIdState,
  isContentEmptyState,
  isCreateThreadState,
  isMobileSizeState,
  isReplyCommentState,
  isReplyThreadState,
  replyFromContentTextState,
  routeState,
  selectedCatIdState,
  showConfirmBoxState,
  showCreatePostState,
  threadIdState,
  threadTitleState,
} from '../../../recoil';
import CategorySelectionList from './CategorySelectionList';

const index = ({ categories, category }) => {
  // Initial
  const router = useRouter();
  const AuthUser = useAuthUser();

  // Recoil State
  const setShowCreatePost = useSetRecoilState(showCreatePostState);
  const isCreateThread = useRecoilValue(isCreateThreadState);
  const isReplyThread = useRecoilValue(isReplyThreadState);
  const isReplyComment = useRecoilValue(isReplyCommentState);
  const [threadTitle, setThreadTitle] = useRecoilState(threadTitleState);
  const threadId = useRecoilValue(threadIdState);
  const commentId = useRecoilValue(commentIdState);
  const setIsEmpty = useSetRecoilState(isContentEmptyState);
  const catId = useRecoilValue(selectedCatIdState);
  const replyFromContentText = useRecoilValue(replyFromContentTextState);
  const [bodyContent, setBodyContent] = useState('');

  // Confirm Box
  const [showConfirmBox, setShowConfirmBox] = useRecoilState(showConfirmBoxState);

  // Route State
  const { isThreadPath } = useRecoilValue(routeState);

  // Responsive State

  const isMobile = useRecoilValue(isMobileSizeState);

  // Function
  const onCreateThread = async () => {
    await axios
      .post('/api/create/thread', {
        cid: catId,
        title: threadTitle.trim(),
        text: bodyContent.replace(/&nbsp;/g, '').trim(),
        uid: AuthUser.id,
      })
      .then((res) => {
        if (res.data.status === 'success') {
          let routeName;

          if (isThreadPath) {
            routeName = `/thread/${threadId}/`;
          } else {
            routeName = `/category/${catId}`;
          }

          router.push(routeName, routeName, {
            scroll: false,
          });
          notification.success({
            message: 'Success',
            description: 'You create thread successfully',
          });
          return;
        }
        notification.error({
          message: 'Warning',
          description: 'You have been banned from this site.',
        });
      });
  };

  const onCreateComment = async () => {
    await axios
      .post('/api/create/comment', {
        tid: threadId,
        text: bodyContent.replace(/&nbsp;/g, '').trim(),
        uid: AuthUser.id,
      })
      .then((res) => {
        if (res.data.status === 'success') {
          if (isReplyComment) {
            axios(`/api/thread/comment/replycount?tid=${threadId}&commentId=${commentId}`);
          }

          router.push(`/thread/${threadId}/`);
          notification.success({
            message: 'Success',
            description: 'You create post successfully',
          });
          return;
        }
        notification.error({
          message: 'Warning',
          description: 'You have been banned from this site.',
        });
      });
  };
  const matchYoutubeUrl = (url) => {
    const p =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) {
      return url.match(p)[1];
    }
    return false;
  };
  return (
    <motion.div
      className='bg-transparent flex flex-col fixed justify-center top-10 overflow-hidden right-0 left-0 m-auto lg:max-h-screen lg:max-w-2xl sm:max-w-xl text-white z-20'
      animate={{ y: ['100%', '0%'] }}
      transition={{ duration: 0.5 }}
      initial={{ y: '100%' }}
    >
      <div className='w-full bg-gray-800 rounded-md'>
        <div>
          <div className='border-b border-white border-opacity-10'>
            <div className='flex justify-between '>
              {isCreateThread && <div className='p-3 h-12 font-bold'>Create Thread</div>}
              {isReplyThread && (
                <div className='p-3 h-12 truncate'>Reply Thread: {threadTitle}</div>
              )}
              {isReplyComment && <div className='p-3 h-12'>Reply Comment: {threadTitle}</div>}
              <button
                type='button'
                className='hover:bg-gray-700 text-2xl p-3 cursor-pointer'
                onClick={() => {
                  if (bodyContent.length === 0) {
                    setShowCreatePost(false);
                  } else {
                    setShowConfirmBox(true);
                  }
                }}
              >
                <AiOutlineClose />
              </button>
            </div>
          </div>
          {isCreateThread && (
            <div className={classNames(isMobile ? 'p-2' : 'p-5')}>
              <div className='flex justify-between space-x-2'>
                <div>
                  <CategorySelectionList categories={categories} category={category} />
                </div>
                <div className='w-full'>
                  <input
                    disabled={showConfirmBox}
                    onChange={(e) => {
                      setThreadTitle(e.target.value);
                      if (threadTitle.length > 0) {
                        setIsEmpty(false);
                      } else {
                        setIsEmpty(true);
                      }
                    }}
                    type='text'
                    placeholder='Enter your title'
                    className='w-full bg-gray-900 rounded-md p-2'
                  />
                </div>
              </div>
            </div>
          )}
          <div>
            <div className={classNames(isMobile ? 'px-2 pb-auto' : 'px-5 pb-auto')}>
              <Editor
                apiKey={Env.TinyCloudApiKey}
                disabled={showConfirmBox}
                initialValue={isReplyComment || isReplyThread ? replyFromContentText : ''}
                init={{
                  body_id: 'textBody',
                  body_class: 'textBody',
                  height: 400,
                  max_height: 1280,
                  min_height: 300,
                  menubar: false,
                  paste_data_images: true,
                  skin: 'oxide-dark',
                  content_css: 'dark',
                  branding: false,
                  automatic_uploads: true,
                  resize: true,
                  file_picker_types: 'image',
                  image_title: true,
                  images_upload_handler(blobInfo, success) {
                    const options = {
                      maxSizeMB: 1,
                      maxWidthOrHeight: 500,
                      useWebWorker: true,
                      initialQuality: 0.5,
                    };
                    imageCompression(blobInfo.blob(), options)
                      .then((compressedFile) => {
                        // console.log(
                        //   'compressedFile instanceof Blob',
                        //   compressedFile instanceof Blob
                        // );
                        // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
                        const reader = new FileReader();
                        reader.readAsDataURL(compressedFile);
                        reader.onloadend = function ol() {
                          const base64data = reader.result;
                          // console.log(compressedFile.size / 1024 / 1024);
                          // console.log(base64data === blobInfo.base64());
                          success(`${base64data}`);
                        };
                      })
                      .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error);
                      });
                  },
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; }',
                  selector: 'textarea', // change this value according to your HTML
                  default_link_target: '_blank',
                  // media_url_resolver(data, resolve /* , reject */) {
                  //   if (data.url.indexOf('YOUR_SPECIAL_VIDEO_URL') !== -1) {
                  //     const embedHtml = `<iframe src="${data.url}" width="400" height="400" ></iframe>`;
                  //     resolve({ html: embedHtml });
                  //   } else {
                  //     resolve({ html: '' });
                  //   }
                  // },
                  paste_postprocess: function x(plugin, args) {
                    // console.log(args.node.innerText.replace(/<[^>]*>/g, ''));

                    const afterPast = matchYoutubeUrl(args.node.innerText.replace(/<[^>]*>/g, ''));
                    // console.log(args.node.innerText);
                    const youtubeIframe = afterPast
                      ? `
                      ${args.content}
                      <iframe
                        v-if='youtubeVideoID.length > 0 && render'
                        id='ytplayer'
                        type='text/html'
                        src='https://www.youtube.com/embed/${afterPast}'
                        title='YouTube video player'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      ></iframe>`
                      : args.content;
                    // console.log(youtubeIframe);
                    // eslint-disable-next-line no-param-reassign
                    args.content = youtubeIframe;
                  },
                  fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
                  plugins: [
                    'code',
                    'emoticons',
                    'advlist autolink lists link image',
                    'charmap print preview anchor',
                    'searchreplace visualblocks code',
                    'insertdatetime media table paste wordcount',
                    'media',
                    'textcolor',
                  ],

                  toolbar:
                    'emoticons image link fontsizeselect forecolor bold italic underline strikethrough alignleft aligncenter alignright blockquote code media',
                }}
                onEditorChange={(t) => {
                  setBodyContent(t);

                  // console.log(t.replace(/<[^>]*>/g, ''));
                  if (bodyContent.length > 0) {
                    setIsEmpty(false);
                  } else {
                    setIsEmpty(true);
                  }
                }}
              />
            </div>
          </div>
          <div className='p-5'>
            <div className='flex justify-end space-x-12'>
              <button
                type='button'
                className='text-md px-5 py-2 rounded-lg hover:bg-gray-700 flex space-x-2 cursor-pointer'
                onClick={() => {
                  if (isCreateThread) {
                    onCreateThread();
                  } else {
                    onCreateComment();
                  }
                  // console.log('Thread Created');
                  setShowCreatePost(false);
                }}
              >
                <span className='mt-0.5 text-xl '>
                  <FaTelegramPlane />
                </span>
                <span className=' '>Post</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default index;
