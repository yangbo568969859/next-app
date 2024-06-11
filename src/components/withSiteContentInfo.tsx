import { FC } from 'react';
import { Icons } from '@/src/components/UIBase/Icons'

const WithSiteContentInfo: FC<any> = (props: any) => {
  const { meta, readingTime } = props;
  return (
    <div className='flex text-xs mb-4'>
      {
        meta && meta.date ? <div className='mr-3 flex items-center'>
          <Icons.calendar size={14} className='mr-1' />
          {meta.date.toString()}
        </div> : null
      }
      {
        readingTime && readingTime.text ? <div className='flex items-center'>
          <Icons.eye size={14} className='mr-1'  />
          {readingTime.text}
        </div> : null
      }
    </div>
  );
};

export default WithSiteContentInfo;
