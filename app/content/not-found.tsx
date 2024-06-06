'use client';
import type { FC } from 'react';

import CenteredLayout from '@/src/layouts/Centered';

const NotFoundPage: FC = () => {

  return (
    <CenteredLayout>
      <div className='absolute top-0 right-0 bottom-0 left-0 h-full w-full flex items-center justify-center'>
        <main className='flex flex-auto items-center justify-center text-center px-4 flex-col sm:flex-row'>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight sm:pr-6 sm:mr-6 sm:border-r sm:border-slate-900/10 sm:dark:border-slate-300/10 dark:text-slate-200">
            404Cus
          </h1>
          <p className="mt-2 text-lg text-slate-700 dark:text-slate-400 sm:mt-0">
            Sorry, we couldn&apos;t find the page you&apos;re after! Try starting again from the homepage.
          </p>
        </main>
      </div>
    </CenteredLayout>
  );
};

export default NotFoundPage;
