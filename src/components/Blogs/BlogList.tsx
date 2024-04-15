import { FC } from 'react';
import styles from './index.module.css';
import { getContentMenus } from '@/src/utils/content';

const BlogList: FC = async () => {
  const contents = await getContentMenus();
  return <div className={styles.bloglist}>{JSON.stringify(contents)}</div>;
};

export default BlogList;
