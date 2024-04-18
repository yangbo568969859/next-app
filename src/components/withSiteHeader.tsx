'use client';

import { FC, useState, useEffect } from 'react';
import Link from "next/link"
import { ThemeToggle } from "@/src/components/ThemeToggle"
import WithSiteHeaderSearch from '@/src/components/withSiteHeaderSearch'
import { Icons } from "@/src/components/UIBase/Icons"
import { buttonVariants } from '@/src/components/UIBase/Button'
import clsx from 'clsx'

const WithSiteHeader: FC = () => {
  let [isOpaque, setIsOpaque] = useState(false)
  useEffect(() => {
    let offset = 50
    function onScroll() {
      if (!isOpaque && window.scrollY > offset) {
        setIsOpaque(true)
      } else if (isOpaque && window.scrollY <= offset) {
        setIsOpaque(false)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [isOpaque])
  return (
    <>
      <div className='absolute z-20 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none'>
        <div className='w-[108rem] flex-none flex justify-end'>
          <picture>
            <source type='image/png' srcSet='' />
            <img className='w-[71.75rem] flex-none max-w-none dark:hidden' src={require('@/src/img/media/docs_homeback.png').default.src} alt="" />
          </picture>
        </div>
      </div>
      <header className={clsx('sticky top-0 z-40 px-4 md:px-12 w-full supports-backdrop-blur:bg-white/60 dark:bg-transparent dark:border-slate-50/[0.06] border-b', isOpaque ? 'bg-white' : 'bg-white/60')}>
        <div className='container flex h-16 items-center px-4 sm:justify-between sm:space-x-0'>
          <div className='flex'>
            <Link href="/" aria-label="Home">
              阿呆🐱的空间站
            </Link>
          </div>
          <div className='flex flex-1 items-center justify-end space-x-4'>
            <nav className='flex items-center space-x-1'>
              <WithSiteHeaderSearch />
              <Link
                href='https://github.com/yangbo568969859'
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  <Icons.gitHub className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </div>
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default WithSiteHeader;
