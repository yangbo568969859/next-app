'use client'
import React, { useEffect } from 'react';
import WithSiteHeader from '@/src/components/withSiteHeader';
// import { update } from '@/src/thirdPlugin/script';
import LayoutFluid from '@/src/components/layoutFluid';

const BotPage = () => {

  useEffect(() => {
    // setTimeout(() => {
    //   console.log(update, 'update');
    // }, 1000);
  }, [])
  return (
    <div className="w-full relative h-[calc(100dvh-4rem-1px)]">
      <WithSiteHeader></WithSiteHeader>
      <div className='absolute inset-0 overflow-hidden motion-reduce:invisible motion-safe:visible'>
        <div className='fixed top-0 left-0 z-5 pointer-events-none'>
          <LayoutFluid />
        </div>
      </div>
      <div className='relative z-10 w-full h-full flex items-center justify-center'>
        home page
      </div>
    </div>
  );
};

export default BotPage;