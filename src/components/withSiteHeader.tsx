import { FC } from 'react';
import Link from "next/link"
import { ThemeToggle } from "@/src/components/ThemeToggle"
import WithSiteHeaderSearch from '@/src/components/withSiteHeaderSearch'
import { Icons } from "@/src/components/UIBase/Icons"
import { buttonVariants } from '@/src/components/UIBase/Button'

const WithSiteHeader: FC = () => {
  return (
    <header className='sticky top-0 z-40 px-4 md:px-12 w-full bg-background dark:border-slate-50/[0.06] lg:border-b'>
      <div className='container flex h-16 items-center px-4 sm:justify-between sm:space-x-0'>
        <div className='flex'>
          <Link href="/" aria-label="Home">
            阿呆是一只猫🐱
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
  );
};

export default WithSiteHeader;
