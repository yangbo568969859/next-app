'use client';
import { FC, useState } from 'react';
import { useKeyboardCommands } from '@/src/hooks/react-client';
import { WithSearchBox } from '@/src/components/Common/Search/withSearchBox';

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

  return (
    <>
      <div className="flex w-190">
        <button onClick={openSearchBox}></button>
      </div>
      {isOpen ? <WithSearchBox onClose={closeSearchBox} /> : null}
    </>
  );
};

export default WithSiteHeaderSearch;
