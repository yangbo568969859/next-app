'use client'
import { useState, useEffect } from 'react';
import Link from "next/link"
import Image from "next/image";

interface Category {
  title: string;
  icon: string;
  id: number;
  name: string;
}

interface SidebarProps {
  className?: string
  navItems: Pick<Category, "title" | "icon" | "id">[]
}

function WithSiteSideBar({ className, navItems }: SidebarProps) {
  const [activeTabId, setActiveTabId] = useState(navItems[0].id)
  useEffect(() => {
    const ele = document.getElementById(`${activeTabId}`)
    const elePos = ele?.getBoundingClientRect().top || 0
    const  offsetPos = elePos + window.pageYOffset - 75
    window.scrollTo({
      top: offsetPos,
      behavior: 'smooth'
    })
  })
  return (
    <nav className='bg-background after:h[calc(100vh - 65px)] block min-h-screen w-60 flex-row flex-nowarp sm:px-6 sm:pb-6'>
      <div className='flex-col items-center justify-center hidden h-16 sm:flex'>logo</div>
      <div className='relative z-40 flex flex-col flex-1 w-full h-auto pt-4 overflow-x-hidden overflow-y-auto rounded opacity-100 flex-start'>
        <div className=''>
          {
            navItems.map((item) => {
              return (
                <div
                  className={`block cursor-pointer rounded-lg hover:bg-gray-100 hover:text-purple-500 transition-all ease-in-out  ${
                    activeTabId === item.id
                      ? "bg-gray-100 text-purple-500"
                      : "text-primary"
                  }`}
                  key={item.id}
                  onClick={() => setActiveTabId(item.id)}
                >
                  <div className="scale relative mb-2 flex items-center gap-2 rounded-r-lg p-2 transition-colors ease-in-out before:transition-colors hover:no-underline sm:border-l-0 sm:pl-6 sm:before:absolute sm:before:left-[-5px] sm:before:top-[2px] sm:before:h-[calc(100%-4px)] sm:before:w-[10px] sm:before:rounded-full sm:before:transition-colors">
                    <div className="relative flex shrink-0">
                      <Image
                        src={item.icon}
                        alt=""
                        className="block"
                        width={20}
                        height={20}
                      />
                    </div>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.title}
                    </span>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </nav>
  );
};

export default WithSiteSideBar;
