import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Upload } from 'antd';
import axios from 'axios';
import firebase from 'firebase';
import 'firebase/storage';
import Image from 'next/image';
import { useAuthUser, withAuthUser, withAuthUserSSR } from 'next-firebase-auth';
import { useEffect, useState } from 'react';
import { Popup } from '../../../components/Admin';
import { AdminMain } from '../../../layout';
import User from '../../../model/user';
import { withDomain } from '../../../utilities/dev';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const Banners = () => {
  const AuthUser = useAuthUser();
  // request api
  const onGetBanner = async () => {
    const res = await axios(withDomain(`/api/banner/getBanner`));

    return res.data;
  };

  const { data: getBanner, loading: isFetchingBanner } = useRequest(onGetBanner, {
    defaultParams: [],
  });

  const [dataSource, setDataSource] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [input, setInput] = useState('');
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    setDataSource(getBanner);
  }, [getBanner]);

  const onCancel = () => {
    setInput('');
    setImageFile(null);
    setImageUrl(null);
    setOpenModal(false);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleUpload = async (e) => {
    const ref = firebase
      .app()
      .storage(process.env.NEXT_PUBLIC_FIREBASE_BUCKET_URL)
      .ref()
      .child(`/banner/banner.jpg`);
    const uploadTask = await ref.put(e);

    return uploadTask.ref.getDownloadURL().then((downloadURL) => {
      return downloadURL;
    });
  };

  const handleChange = async (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.

      getBase64(info.file.originFileObj, (image) => {
        setLoading(false);
        setImageUrl(image);
      });
      setImageFile(info.file.originFileObj);
    }
  };

  const handlePost = async () => {
    setLoadingBtn(true);
    const upload = await handleUpload(imageFile);

    const banner = await axios.post(withDomain(`/api/banner/setBanner`), {
      id: AuthUser.id,
      banner: {
        imageUrl: upload,
        content: input,
      },
    });

    setLoadingBtn(false);
    onCancel();
    setDataSource(banner.data);
  };

  return (
    <AdminMain>
      <Popup.Modal
        title='Change Banner'
        open={openModal}
        setOpen={setOpenModal}
        onOk={handlePost}
        onCancel={onCancel}
        okLoading={loadingBtn}
      >
        <div className='text-center mb-5'>
          <Upload
            name='avatar'
            listType='picture-card'
            className='avatar-uploader'
            showUploadList={false}
            // action={null}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
        <div className='mb-5 w-96'>
          <textarea
            value={input}
            type='text'
            placeholder='Content'
            className='px-3 py-2 font-bold bg-top-nav-dark text-white rounded-lg border-2 border-opacity-30 w-full'
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </Popup.Modal>

      <div className='w-full p-5 bg-left-nav-dark rounded-lg'>
        <div>
          <button
            type='button'
            className='px-5 py-3 rounded-lg border-2 border-opacity-30 font-bold bg-top-nav-dark text-white hover:bg-opacity-10'
            onClick={() => setOpenModal(true)}
          >
            Change banner
          </button>
        </div>
        <div className='mt-5 space-y-3'>
          {!isFetchingBanner && dataSource && (
            <Image
              src={dataSource?.payload?.imageUrl}
              alt='banner'
              className='rounded-lg object-cover'
              width={1280}
              height={720}
              layout='responsive'
            />
          )}
          <h1 className='text-2xl font-bold text-white'>{`${
            dataSource?.payload?.content || ''
          }`}</h1>
        </div>
      </div>
    </AdminMain>
  );
};

export const getServerSideProps = withAuthUserSSR()(async ({ AuthUser }) => {
  const user = await User.getByUid(AuthUser.id);
  if (user?.type !== 'admin') {
    return {
      redirect: {
        destination: '/category/1',
      },
    };
  }
  return {
    props: {
      status: 'success',
    },
  };
});
export default withAuthUser()(Banners);
