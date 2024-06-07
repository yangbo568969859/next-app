import { useContext } from "react";
// import { useRouter } from "next/navigation";
import { ContentPageContext } from '@/src/components/withSiteMenus'

export function usePrevNext(menus: any, key: string) {
  // let router = useRouter();
  let aaa = useContext(ContentPageContext)
  console.log(aaa);
  let prev = undefined;
  let next = undefined;
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].link === `/${key}` && i < menus.length) {
      if (i > 0) {
        prev = menus[i - 1];
      }
      next = menus[i + 1];
    }
  }
  return {
    prev,
    next,
  }
  // let pages = Object.keys(menus).flatMap((category) => menus[category])
  // let pageIndex = router.query.pageIndex;
  // return {
  //   prev: pageIndex > - 1 ? pages[pageIndex - 1] : undefined,
  //   next: pageIndex > - 1 ? pages[pageIndex + 1] : undefined,
  // }
}