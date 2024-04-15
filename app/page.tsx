import WithSiteHeader from '@/src/components/withSiteHeader'
import WithSiteFooter from '@/src/components/withSiteFooter'
import { WithSiteContent } from '@/src/components/withSiteContent'
import WithSiteSideBar from '@/src/components/withSiteSideBar'

import { getContentMenus } from '@/src/utils/content'

export default async function Home() {
  const navResources = await getContentMenus()
  const navItems = navResources.map((n, index) => {
    return {
      title: n.name,
      icon: 'https://cos.codefe.top/images/ray-so-icon.png',
      id: index,
      links: [
        {},
        {},
        {},
        {},
      ]
    }
  })
  return (
    <div className='container relative'>
      <div className='flex'>
        <div className='fixed z-20 hidden min-h-screen w-[16rem] transition-all duration-300 ease-in-out sm:block'>
          <WithSiteSideBar navItems={navItems}></WithSiteSideBar>
        </div>
        <div className='sm:pl-[16rem] w-full'>
          <WithSiteHeader></WithSiteHeader>
          <WithSiteContent navResources={navItems}></WithSiteContent>
          <WithSiteFooter></WithSiteFooter>
        </div>
      </div>
    </div>
  );
}
