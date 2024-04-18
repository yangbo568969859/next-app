'use client';
import { FC, useEffect, useState } from 'react';
import { useKeyboardCommands, useDetectOS } from '@/src/hooks/react-client';
import { WithSearchBox } from '@/src/components/Common/Search/withSearchBox';
import { Icons } from '@/src/components/UIBase/Icons';

const WithSiteHeaderSearch: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openSearchBox = () => setIsOpen(true);
  const closeSearchBox = () => setIsOpen(false);

  useKeyboardCommands((cmd) => {
    switch (cmd) {
      case 'cmd-k':
        openSearchBox();
        break;
      case 'escape':
        closeSearchBox();
        break;
      default:
    }
  });

  useEffect(() => {
    console.log(isOpen)
    if (isOpen) {
      if (!document.body.classList.contains('DocSearch--active')) {
        document.body.classList.add('DocSearch--active')
      }
    } else {
      document.body.classList.remove('DocSearch--active')
    }
  }, [isOpen])

  const { os } = useDetectOS();
  const osCommandKey = os === 'MAC' ? '⌘' : 'Ctrl';
  const isOSLoading = os === 'LOADING';

  return (
    <div className='hidden md:flex'>
      <div className="flex w-190">
        <button className='flex w-52 gap-2 rounded-md bg-secondary p-2 text-sm transition-all duration-300 ease-in-out justify-between text-neutral-600 px-3
        hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-900 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-500' onClick={openSearchBox}>
          <span className='flex'>
            <Icons.search className="h-5 w-5 mr-1" />
            Search ...
          </span>
          <span>
            <kbd>
              <abbr>{osCommandKey} K</abbr>
            </kbd>
          </span>
        </button>
      </div>
      {isOpen ? <WithSearchBox onClose={closeSearchBox} /> : null}
    </div>
  );
};

export default WithSiteHeaderSearch;
