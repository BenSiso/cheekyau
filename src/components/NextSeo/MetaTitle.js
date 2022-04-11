import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function MetaTitle({ thread, category }) {
  // Config Dynamic Component
  const pathname = useRouter().asPath;
  const urlPath = pathname.split('/');

  // State
  const [seo, setSeo] = useState({
    title: 'Cheeky',
    description: 'A short description goes here.',
  });

  // Function
  const uppercaseTitle = (title) => {
    // Convert the first letter to uppercase
    return title?.charAt(0).toUpperCase() + title?.slice(1);
  };

  useEffect(() => {
    let newObj = { ...seo };
    if (urlPath[1] === 'category' && !thread) {
      newObj = {
        ...newObj,
        title: `${category.name} | Cheeky`,
      };
    } else if (urlPath[1] === 'category' && thread) {
      newObj = {
        ...newObj,
        title: `${uppercaseTitle(thread?.title)} | ${category.name} | Cheeky`,
      };
    } else if (urlPath[1] === 'admin' && urlPath.length === 3) {
      newObj = {
        ...newObj,
        title: `${uppercaseTitle(urlPath[2])} | ${uppercaseTitle(urlPath[1])} | Cheeky`,
      };
    } else if (thread) {
      newObj = {
        ...newObj,
        title: `${uppercaseTitle(thread?.title)} | ${category.name} | Cheeky`,
      };
    } else {
      newObj = {
        ...newObj,
        title: `${uppercaseTitle(urlPath[1])} | Cheeky`,
      };
    }

    setSeo(newObj);
  }, [pathname]);

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name='description' content={seo.description} />
      <meta name='robots' content='all' />
    </Head>
  );
}
