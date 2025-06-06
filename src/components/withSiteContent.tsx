import Link from "next/link"
import Image from "next/image"

import { Button } from '@/src/components/UIBase/Button'


function WithSiteContentItems(props: any) {
  const { link } = props;
  let title, description = link.description;
  if (link.meta && link.meta.title) {
    title = link.meta.title;
    description = link.meta.description;
  } else {
    title = link.title;
  }
  return (
    <Link
      href={link.isDir ? `/blog${link.link}` : `/content${link.link}` }
    >
      <div className="relative mb-6 flex min-h-[122px] min-w-0 cursor-pointer flex-col justify-between break-words rounded-lg border border-gray-200 p-4 shadow-md transition-all hover:-translate-y-1 hover:scale-105 hover:bg-border hover:shadow-lg xl:mb-0">
        <div className="flex items-center">
          <div className="mr-3 flex h-10 w-10 overflow-hidden rounded-md">
            {
              link.icon 
                ? <Image
                    src={link.icon}
                    className="object-fill"
                    alt=""
                    width={40}
                    height={40}
                  /> 
                : <span className="h-full w-full rounded-full bg-purple-500 text-center font-bold leading-10">{ title.slice(0, 1) }</span>
            }
          </div>
          <span className="text-xl font-bold text-primary">{ title }</span>
        </div>
        <div className="mt-2 line-clamp-1 text-sm text-primary" title={description}>
          { description }
        </div>
        {/* <div className="absolute right-2 bottom-2">
          <Button variant="ghost"
            size="sm">
            { link.isDir ? '进入目录' : '进入文件' }
          </Button>
        </div> */}
      </div>
    </Link>
  )
}

function WithSiteContent(props: any) {
  const { navResources } = props;
  return (
    <div className="w-full px-0 pt-4 md:px-12">
      <div className="mx-auto w-full px-4 md:px-6">
        {
          navResources.map((category: any) => {
            return (
              <div id={category.id} key={category.id} className="mb-4 md:mb-8">
                <div className="my-4 flex">
                  <h1 className="mb-2 text-2xl font-bold text-primary/80 sm:text-3xl">{ category.title }</h1>
                  <p className="ml-4 mt-2 h-8 text-xs align-baseline text-slate-500 leading-7 hidden md:flex">{ category.description }</p>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  {
                    category.children && category.children.length ? category.children.map((link: any) => (
                      <WithSiteContentItems link={link} key={`${link.id}`} />
                    )) : <div></div>
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export { WithSiteContent }
