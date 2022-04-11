/* eslint-disable no-console */
import mime from 'mime-types';
import { getFirebaseAdmin } from 'next-firebase-auth';
import { v4 as uuidv4 } from 'uuid';
import initAuth from './initAuth';

const allowedMimeType = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];

let fileBucket;
const uploadImage = async (mimeType, imageBase64Str) => {
  try {
    if (!fileBucket) {
      fileBucket = getFirebaseAdmin().storage().bucket();
    }

    if (!allowedMimeType.includes(mimeType)) {
      console.log('unsupported type', mimeType);
      return { err: new Error('unsupported mime type') };
    }

    const imageBuffer = Buffer.from(imageBase64Str, 'base64');
    const imageByteArray = new Uint8Array(imageBuffer);
    const filePath = `upload/${uuidv4()}.${mime.extension(mimeType)}`;
    const file = fileBucket.file(filePath);

    console.log('uploading...', mimeType, filePath);
    await file.save(imageByteArray, {
      metadata: {
        mimeType,
      },
    });

    console.log('uploaded. getting url...', mimeType, filePath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '01-01-2500',
    });

    return { url };
  } catch (err) {
    console.error('upload error', mimeType, err);
    return { err };
  }
};

const processImagesBase64 = async (rawHtml = '') => {
  let text = rawHtml;
  const imgDataRegex = /<img.+?src="(data:(image\/\w+);base64,(.+?))".+?\/?>/g;
  const images = [];
  let imgMatch = imgDataRegex.exec(text);
  while (imgMatch) {
    const [, dataUri, mimeType, base64Str] = imgMatch;
    images.push({ dataUri, mimeType, base64Str });
    imgMatch = imgDataRegex.exec(text);
  }

  const imageUploads = await Promise.all(
    images.map(({ mimeType, base64Str }) => uploadImage(mimeType, base64Str))
  );

  imageUploads.forEach(({ url }, i) => {
    if (!url) return;
    text = text.replace(images[i].dataUri, url);
  });

  return text;
};

const media = () => {
  initAuth();
  return {
    processImagesBase64,
  };
};

export default media;
