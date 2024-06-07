'use client'
import { FC, useState, useEffect } from 'react';
import Link from 'next/link'
import { usePrevNext } from '@/src/hooks/react-client/usePrevNext'

const WithSiteMenusNav: FC<any> = ({ menus, selectKey }) => {
  // const previous = {
  //   href: '/',
  //   shortTitle: '112121',
  //   title: '112121',
  // };
  // const next = {
  //   href: '/',
  //   shortTitle: '112121',
  //   title: '112121',
  // };
  const { prev: previous, next } = usePrevNext(menus, selectKey);
  // console.log(previous, next);
  return (
    <div className='mb-10 text-slate-700 font-semibold flex items-center dark:text-slate-200'>
      {previous && (
        <Link
          href={`/content${previous.link}`}
          className="group flex items-center hover:text-slate-900 dark:hover:text-white"
        >
          <svg
            viewBox="0 0 3 6"
            className="mr-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
          >
            <path
              d="M3 0L0 3L3 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {previous.shortTitle || previous.title}
        </Link>
      )}
      { next && (
        <Link
          href={`/content${next.link}`}
          className="group ml-auto flex items-center hover:text-slate-900 dark:hover:text-white"
        >
          {next.shortTitle || next.title}
          <svg
            viewBox="0 0 3 6"
            className="ml-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
          >
            <path
              d="M0 0L3 3L0 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}
    </div>
  )
}

export default WithSiteMenusNav;