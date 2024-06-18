'use client'
import { Icons } from '@/src/components/UIBase/Icons'
import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import GithubSlugger from 'github-slugger'

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
  const slugger = new GithubSlugger() 
  contentHeads.forEach((value: any) => {
    if (value.value.indexOf('title') > -1 && value.value.indexOf('description') > -1 && value.value.indexOf('date') > -1) {
      
    } else {
      realList.push({
        depth: value.depth,
        title: value.value,
        anchor: value.value && slugger.slug(value.value),
      })
      // console.log(slugger.slug(value.value))
      if (value.children) {
        value.children.forEach((child: any) => {
          realList.push({
            depth: child.depth,
            title: child.value,
            anchor: child.value && slugger.slug(child.value),
          })
        })
      }
    }
  })
  // const [activeNavId, setActiveNavId] = useState(realList && realList.length ? realList[0].anchor : '')
  const [activeNavId, setActiveNavId] = useState('')
  // const renderCount = useRef(0)
  useEffect(() => {
    // console.log('renderCount', renderCount.current)
    // if (renderCount.current < 2) {
    //   renderCount.current++
    //   return
    // }
    const ele = document.getElementById(`${activeNavId}`)
    const elePos = ele?.getBoundingClientRect().top || 0
    const offsetPos = elePos + window.pageYOffset - 80
    window.scrollTo({
      top: offsetPos,
      behavior: 'smooth'
    })
  }, [activeNavId])
  if (contentHeads.length && realList.length) {
    return (
      <div className="fixed z-20 top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-45rem))] w-[19.5rem] py-10 overflow-y-auto hidden xl:block">
        <div className="px-8">
          <h2 className="text-slate-900 font-semibold mb-4 text-sm leading-6 dark:text-slate-100">
            目录
          </h2>
          <ul className="text-slate-700 text-sm leading-6">
            {
              realList.map((item, index: number) => {
                if (item.depth === 2) {
                  return (
                    <li key={index}>
                      <a onClick={() => setActiveNavId(item.anchor)} className={clsx("cursor-pointer block py-1",
                      activeNavId === item.anchor ? "text-sky-500 dark:text-sky-400" : "hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300")}>{item.title}</a>
                    </li>
                  )
                } else {
                  return (
                    <li className="ml-4" key={index}>
                      <a onClick={() => setActiveNavId(item.anchor)} className={clsx("group cursor-pointer flex items-start py-1", activeNavId === item.anchor ? "text-sky-500 dark:text-sky-400" : "dark:text-slate-400")}>
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
