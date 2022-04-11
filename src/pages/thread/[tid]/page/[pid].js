import { withDomain } from '../../../../utilities/dev';
import Main from '../../../../layout/Main';

export default function Page({ posts, threads, categories }) {
  return <Main posts={posts} threads={threads} categories={categories} />;
}
export async function getServerSideProps() {
  // Fetch Response Data
  const resThread = await fetch(withDomain('/api/thread'));
  const resPost = await fetch(withDomain('/api/thread/1'));
  const resCategory = await fetch(withDomain('/api/category'));

  // Data Json Conversion
  const threadData = await resThread.json();
  const postData = await resPost.json();
  const categoryData = await resCategory.json();
  // Cleared Data
  const posts = await postData.response.response.item_data;
  const threads = await threadData.payload.threads;
  const categories = await categoryData.payload.categories;
  if (!threads || !posts || !categories) {
    return {
      notFound: true,
    };
  }

  return {
    props: { posts, threads, categories },
  };
}
