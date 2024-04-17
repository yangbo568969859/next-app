import WithSiteHeader from '@/src/components/withSiteHeader'
import WithSiteFooter from '@/src/components/withSiteFooter'
import { WithSiteContent } from '@/src/components/withSiteContent'

import { getContentTreeItems } from '@/src/utils/navigation'

export default async function Home() {
  const navTreeResources = await getContentTreeItems()
  const navItems = navTreeResources.map((n: any) => {
    return {
      title: n.title,
      icon: n.icon,
      id: n.id,
      children: n.children,
      isDir: n.isDir,
      link: n.link,
    }
  })
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
  );
}
