'use client';
import { FC, useState, useEffect } from 'react';
import clsx from 'clsx';


const WithSiteMenus: FC<any> = ({ menus, selectKey }) => {
  return (
    <div className='hidden lg:block fixed z-20 inset-0 top-[3.8125rem] left-[max(0px,calc(50%-45rem))] right-auto w-[19rem] pb-10 pl-8 pr-6 overflow-y-auto'>
      <ul>
        <li className='mt-12 lg:mt-8'>
          <h5 className='mb-8 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200'>Core Concepts</h5>
          <ul className='space-y-6 lg:space-y-2 border-l border-slate-100 dark:border-slate-800'>
            {
              menus.map((item: any) => {
                const isActive = `/${selectKey}`==item.link
                return (
                  <li key={item.id} data-active={isActive}>
                    <a href={`/content${item.link}`} className={clsx('block border-l pl-4 -ml-px', {
                      'text-sky-500 border-current font-semibold dark:text-sky-400': isActive,
                      'border-transparent hover:border-slate-400 dark:hover:border-slate-500': !isActive,
                    })}>
                      {item.title}
                    </a>
                  </li>
                )
              })
            }
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default WithSiteMenus;