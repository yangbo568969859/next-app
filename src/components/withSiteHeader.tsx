import { FC } from 'react';
import Link from "next/link"
import { ThemeToggle } from "@/src/components/ThemeToggle"
import WithSiteHeaderSearch from '@/src/components/withSiteHeaderSearch'

const WithSiteHeader: FC = () => {
  return (
    <header className='sticky top-0 z-40 w-full bg-background dark:border-slate-50/[0.06]'>
      <div className='container flex h-16 items-center px-4 sm:justify-between sm:space-x-0'>
        <div className='flex'>MainNav</div>
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='flex items-center space-x-1'>
            <WithSiteHeaderSearch />
            <Link href="">git</Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default WithSiteHeader;
