'use client';
import { FC, useState } from 'react';
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

  const { os } = useDetectOS();
  const osCommandKey = os === 'MAC' ? '⌘' : 'Ctrl';
  const isOSLoading = os === 'LOADING';

  return (
    <div>
      <div className="flex w-190">
        <button className='flex w-52 gap-2 rounded-md bg-neutral-200 p-2 text-sm transition-all duration-300 ease-in-out text-neutral-600
        hover:bg-neutral-300 hover:text-neutral-900 dark:bg-neutral-900 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-500' onClick={openSearchBox}>
          <Icons.search className="h-5 w-5" />
          start Typing ...
          <kbd>
            <abbr>{osCommandKey} K</abbr>
          </kbd>
        </button>
      </div>
      {isOpen ? <WithSearchBox onClose={closeSearchBox} /> : null}
    </div>
  );
};

export default WithSiteHeaderSearch;
