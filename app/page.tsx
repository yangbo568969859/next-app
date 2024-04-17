import WithSiteHeader from '@/src/components/withSiteHeader'
import WithSiteFooter from '@/src/components/withSiteFooter'
import { WithSiteContent } from '@/src/components/withSiteContent'

import { getContentTreeItems } from '@/src/utils/navigation'

export default async function Home() {
  // const navResources = await getContentMenus()
  const navTreeResources = await getContentTreeItems('')
  const navItems = navTreeResources.map((n: any, index: number) => {
    return {
      title: n.title,
      icon: n.icon,
      id: n.id,
      links: n.children?.filter((n: any) => {
        console.log('title', n.title)
        return !['images', 'image', 'img'].includes(n.title.toLowerCase())
      }),
      url: n.link,
      isDir: n.isDir,
      link: n.link,
    }
  })
  return (
    <div className='container relative'>
      <div className='flex'>
        {/* <div className='fixed z-20 hidden min-h-screen w-[16rem] transition-all duration-300 ease-in-out sm:block'>
          <WithSiteSideBar navItems={navItems}></WithSiteSideBar>
        </div> */}
        <div className='sm:pl-[0rem] w-full'>
          <WithSiteHeader></WithSiteHeader>
          <WithSiteContent navResources={navItems}></WithSiteContent>
          <WithSiteFooter></WithSiteFooter>
        </div>
      </div>
    </div>
  );
}
