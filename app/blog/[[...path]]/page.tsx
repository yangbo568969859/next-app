import { FC } from 'react';
import WithSiteHeader from '@/src/components/withSiteHeader'
import WithSiteFooter from '@/src/components/withSiteFooter'
import { WithSiteContent } from '@/src/components/withSiteContent'
import { getContentTreeItems } from '@/src/utils/content'

interface Params {
  params: {
    param: string;
    path: Array<string>;
    locale: string;
  };
}

const getBlogPage: FC<Params> = async ({ params }: Params) => {
  const { path = [], param } = params;
  console.log('getBlogPage')
  const navTreeResources = await getContentTreeItems(path.join('/'))
  // @ts-ignore
  const navItems = navTreeResources.children.map((n, index) => {
    return {
      title: n.title,
      icon: 'https://cos.codefe.top/images/ray-so-icon.png',
      id: index,
      links: n.children || [],
      url: n.link,
      isDir: n.isDir,
    }
  })
  console.log(navItems)
  return (
    <div className='container relative'>
      <div className='flex'>
        <div className='sm:pl-[0rem] w-full'>
          <WithSiteHeader></WithSiteHeader>
          <WithSiteContent navResources={navItems}></WithSiteContent>
          <WithSiteFooter></WithSiteFooter>
        </div>
      </div>
    </div>
  )
}

export default getBlogPage;