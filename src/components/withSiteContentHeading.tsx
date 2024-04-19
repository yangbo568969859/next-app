import { Icons } from '@/src/components/UIBase/Icons'

type SiteContentHeadingProps = {
  depth: number;
  title: string;
  children?: Array<SiteContentHeadingProps>
}

type RealHeadingProp = Omit<SiteContentHeadingProps, 'children'> & {
  anchor: string;
}

function WithSiteContentHeading(props: any) {
  const { contentHeads } = props;
  const realList: Array<RealHeadingProp> = []
  contentHeads.forEach((value: any) => {
    realList.push({
      depth: value.depth,
      title: value.value,
      anchor: value.value,
    })
    if (value.children) {
      value.children.forEach((child: any) => {
        realList.push({
          depth: child.depth,
          title: child.value,
          anchor: child.value,
        })
      })
    }
  })
  if (contentHeads.length) {
    return (
      <div className="fixed z-20 top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-45rem))] w-[19.5rem] py-10 overflow-y-auto hidden xl:block">
        <div className="px-8">
          <h2 className="text-slate-900 font-semibold mb-4 text-sm leading-6 dark:text-slate-100">
            On This Page
          </h2>
          <ul className="text-slate-700 text-sm leading-6">
            {
              realList.map((item, index: number) => {
                if (item.depth === 2) {
                  return (
                    <li key={index}>
                      <a href={`#${item.anchor}`} className="block py-1 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300">{item.title}</a>
                    </li>
                  )
                } else {
                  return (
                    <li className="ml-4" key={index}>
                      <a href={`#${item.anchor}`} className="group flex items-start py-1 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300">
                        <div className='flex items-center mr-1'>
                        <Icons.arrawRight className="h-5 w-4 text-slate-400 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-300" />
                        </div>
                        <div>{item.title}</div>
                      </a>
                    </li>
                  )
                }
              })
            }
          </ul>
        </div>
      </div>
    )
  } else {
    return (
      <div className="fixed z-20 top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-45rem))] w-[19.5rem] py-10 overflow-y-auto hidden xl:block"></div>
    )
  }
}

export default WithSiteContentHeading
