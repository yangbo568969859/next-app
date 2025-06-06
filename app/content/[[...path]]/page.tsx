import { FC } from 'react';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRenderer } from '@/src/components/Mdx/MdxRender'
import rehypePrettyCode from 'rehype-pretty-code';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
// import MdxCode from '@/src/components/Mdx/MdxCode';
import { dynamicRouter } from '@/src/utils/content.dynamic'
import WithSiteHeader from '@/src/components/withSiteHeader'
import WithSiteContentHeading from '@/src/components/withSiteContentHeading'
import WithSiteContentInfo from '@/src/components/withSiteContentInfo'
import WithSiteMenus from '@/src/components/withSiteMenus'
import WithSiteMenusNav from '@/src/components/withSiteMenusNav'
import { getMenusByPath } from '@/src/utils/navigation'
import {
  NEXT_PUBLIC_HOST
} from '@/src/utils/content.constants'
import './markdown.css';

interface Params {
  params: {
    param: string;
    path: Array<string>;
    locale: string;
  };
}

const processImages = (node: any, pagePath: string) => {
  if (node.type === 'element' && node.tagName === 'img') {
    const src = node.properties.src;
    const alt = node.properties.alt || '';
    const title = node.properties.title || '';
    node.properties.src = imageHandler(src, alt, title, pagePath);
  } else if (node.type === 'element' && node.tagName === 'a') {
    if (node.properties.href && (node.properties.href.indexOf('./') > -1 || node.properties.href.indexOf('../') > -1)) {
      console.log('processImages', node.properties.href);
      node.properties.href = '';
      // let href = ''
      // node.properties.href = href;
    }
    node.properties.target = '_blank';
    // node.properties.ref = 'nofollow noopener noreferrer';
  } else if (node.children) {
    node.children.forEach((item: any) => {
      processImages(item, pagePath)
    });
  }
}
const imageHandler = (src: string, alt: string, title: string, pagePath: string) => {
  console.log('imageHandler', NEXT_PUBLIC_HOST);
  // 检查图片路径是否为相对路径
  if (src.startsWith('./') || src.startsWith('../')) {
    if (src.startsWith('../')) {
      pagePath = pagePath.split('/').splice(0, pagePath.split('/').length - 1).join('/');
    }
    // 将相对路径转换为线上图片地址
    const onlineImageUrl = `${NEXT_PUBLIC_HOST}/mdAssets/${pagePath}/${src.replace(/^\.\/|\.\.\//, '')}`;
    // console.log(onlineImageUrl);
    return onlineImageUrl;
  }
  // 如果不是相对路径,直接返回原始的图片标签
  return src;
}

// const components = {
//   pre: MdxCode,
// };

const getPage: FC<Params> = async ({ params }: Params) => {
  const { path = [] } = params;
  const pagePath = path.join('/');
  const decodePagePath = decodeURI(pagePath)
  const { source, filename } = await dynamicRouter.getMarkdownFile(decodePagePath)
  // console.log('source, filename', pagePath, filename)
  const relativePath = path.splice(0, path.length - 1);
  const res = await dynamicRouter.getContentInfo(source);
  const menus = await getMenusByPath(decodePagePath);
  if (source.length && filename.length) {
    const { MDXContent, meta, readingTime } = await dynamicRouter.getMDXContent(source, filename);
    // const mdxSource = await serialize(source);
    return (
      <div className="w-full relative">
        <WithSiteHeader></WithSiteHeader>
        {
          (decodePagePath).indexOf('frontend/resumes') > -1 ? null :
          <WithSiteMenus menus={menus} selectKey={decodePagePath}></WithSiteMenus>
        }
        <div className='max-w-8xl mx-auto px-4 sm:px-6 md:px-8'>
          <div className="lg:pl-[19.5rem]">
            <div className="max-w-3xl mx-auto pt-10 xl:max-w-none xl:ml-0 xl:mr-[15.5rem] xl:pr-16">
              <WithSiteContentInfo meta={meta} readingTime={readingTime} />
              <div className='markdown'>
                <MDXRemote
                  source={ MDXContent || '' }
                  options={{
                    parseFrontmatter: true,
                    mdxOptions: {
                      // @ts-ignore
                      remarkPlugins: [remarkGfm, remarkHtml],
                      rehypePlugins: [
                        // Generates `id` attributes for headings (H1, ...)
                        rehypeSlug,
                        // @ts-ignore
                        rehypeKatex,
                        [
                          // @ts-ignore
                          rehypePrettyCode,
                          {
                            theme: 'material-theme-palenight',
                          },
                        ],
                        () => (tree) => {
                          processImages(tree, relativePath.join('/'));
                        }
                      ],
                    },
                  }}
                />
              </div>
              <footer className='text-sm leading-6 mt-12 mb-12'>
                {
                  (decodePagePath).indexOf('frontend/resumes') > -1 ? null :
                    <WithSiteMenusNav menus={menus} selectKey={decodePagePath}></WithSiteMenusNav>
                }
              </footer>
            </div>
          </div>
        </div>
        <WithSiteContentHeading contentHeads={res}></WithSiteContentHeading>
        {/* <div className='absolute -bottom-12 left-0 right-0 h-20 cus-linear-bg'></div> */}
      </div>
    );
  }
  return notFound();
};

// export const generateMetadata = async ({ params }: any) => {
//   const { path = [] } = params;
//   return dynamicRouter.getPageMetadata(decodeURI(path.join('/')));
// };

export default getPage;
