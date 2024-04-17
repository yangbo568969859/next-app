import { FC } from 'react';
import WithSiteHeader from '@/src/components/withSiteHeader'
import WithSiteFooter from '@/src/components/withSiteFooter'
import { WithSiteContent } from '@/src/components/withSiteContent'
import { getContentTreeItems } from '@/src/utils/navigation'
import { notFound } from 'next/navigation';

interface Params {
  params: {
    param: string;
    path: Array<string>;
    locale: string;
  };
}

const getBlogPage: FC<Params> = async ({ params }: Params) => {
  const { path = [] } = params;
  const navTreeResources = await getContentTreeItems(decodeURI(`/${path.join('/')}`))
  if (!navTreeResources) {
    return notFound()
  }
  const list = [navTreeResources]
  list.forEach((value: any) => {
    if (value && value.children) {
      value.links = value.children.map((n: any) => {
        return {
          title: n.title,
          icon: n.icon,
          id: n.id,
          links: n.children,
          isDir: n.isDir,
          link: n.link,
        }
      })
    }
  })
  return (
    <div className='container relative'>
      <div className='flex'>
        <div className='sm:pl-[0rem] w-full'>
          <WithSiteHeader></WithSiteHeader>
          <WithSiteContent navResources={list}></WithSiteContent>
          <WithSiteFooter></WithSiteFooter>
        </div>
      </div>
    </div>
  )
}

export default getBlogPage;