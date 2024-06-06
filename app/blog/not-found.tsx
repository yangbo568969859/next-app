'use client';
import type { FC } from 'react';

import CenteredLayout from '@/src/layouts/Centered';

const NotFoundPage: FC = () => {

  return (
    <CenteredLayout>
      <div className="glowingBackdrop" />

      <main>
        <h1 className="special -mt-4">
          404
        </h1>
        <p className="-mt-4 max-w-sm text-center text-lg">
          Sorry, we couldn&apos;t find the page you&apos;re after! Try starting again from the homepage.
        </p>
      </main>
    </CenteredLayout>
  );
};

export default NotFoundPage;
