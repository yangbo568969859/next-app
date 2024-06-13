import { FC } from 'react';
import { Icons } from '@/src/components/UIBase/Icons'

function getDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const WithSiteContentInfo: FC<any> = (props: any) => {
  const { meta, readingTime } = props;
  let pageShowDate = '';
  if (meta && meta.date) {
    pageShowDate = getDate(meta.date);
  }
  return (
    <div className='flex text-xs mb-4'>
      {
        meta && meta.date ? <div className='mr-3 flex items-center'>
          <Icons.calendar size={14} className='mr-1' />
          {pageShowDate}
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
