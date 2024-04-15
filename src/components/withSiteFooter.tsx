import { FC } from 'react';

const WithSiteFooter: FC = () => {
  return (
    <footer className='block py-4'>
      <div className='container flex h-16 items-center px-4'>
        <div className='text-blueGray-500 py-1 text-center text-sm font-semibold md:text-left'>
          Copyright © 2021 Creative BO
        </div>
      </div>
    </footer>
  );
};

export default WithSiteFooter;
