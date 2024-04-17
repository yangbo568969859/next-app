'use client';

import Image from 'next/image';
import type { FC } from 'react';

import CenteredLayout from '@/src/layouts/Centered';

const NotFoundPage: FC = () => {

  return (
    <CenteredLayout>
      <div className="glowingBackdrop" />

      <main>
        404
        <h1 className="special -mt-4">
          404
        </h1>
        <div className="my-4 flex items-center justify-center">
          <Image
            src="/static/images/node-mascot.svg"
            alt="The Node.js mascot"
            height={114.69}
            width={100}
          />
        </div>
        <p className="-mt-4 max-w-sm text-center text-lg">
          Sorry, we couldn&apos;t find the page you&apos;re after! Try starting again from the homepage.
        </p>
      </main>
    </CenteredLayout>
  );
};

export default NotFoundPage;
