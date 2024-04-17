import type { FC, PropsWithChildren } from 'react';

import styles from './layouts.module.css';

const CenteredLayout: FC<PropsWithChildren> = ({ children }) => (
  <>
    <div className={styles.centeredLayout}>{children}</div>
  </>
);

export default CenteredLayout;
