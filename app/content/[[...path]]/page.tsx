import { FC } from 'react';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { dynamicRouter } from '@/src/utils/content.dynamic'
import WithSiteHeader from '@/src/components/withSiteHeader'
import WithSiteContentHeading from '@/src/components/withSiteContentHeading'
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
  } else if (node.children) {
    node.children.forEach((item: any) => {
      processImages(item, pagePath)
    });
  }
}
const imageHandler = (src: string, alt: string, title: string, pagePath: string) => {
  console.log('imageHandler', src);
  // 检查图片路径是否为相对路径
  if (src.startsWith('./') || src.startsWith('../')) {
    // 将相对路径转换为线上图片地址
    const onlineImageUrl = `http://localhost:3000/mdAssets/${pagePath}/${src.replace(/^\.\/|\.\.\//, '')}`;
    console.log(onlineImageUrl);
    return onlineImageUrl;
  }
  // 如果不是相对路径,直接返回原始的图片标签
  return src;
}

const getPage: FC<Params> = async ({ params }: Params) => {
  const { path = [] } = params;
  const pagePath = path.join('/');
  const { source, filename } = await dynamicRouter.getMarkdownFile(
    decodeURI(pagePath)
  )
  const relativePath = path.splice(0, path.length - 1);
  const res = await dynamicRouter.getContentInfo(source)
  if (source.length && filename.length) {
    const { MDXContent, meta } = await dynamicRouter.getMDXContent(source, filename);
    return (
      <div className="w-full">
        <WithSiteHeader></WithSiteHeader>
        <div className='max-w-8xl mx-auto px-4 sm:px-6 md:px-8'>
          <div className="lg:pl-[19.5rem]">
            <div className="max-w-3xl mx-auto pt-10 xl:max-w-none xl:ml-0 xl:mr-[15.5rem] xl:pr-16">
              <div className='markdown'>
                <MDXRemote
                  source={ MDXContent || '' }
                  // components={
                  //   {
                  //     code: 
                  //   }
                  // }
                  options={{
                    parseFrontmatter: true,
                    mdxOptions: {
                      // @ts-ignore
                      remarkPlugins: [remarkMath],
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
            </div>
          </div>
        </div>
        <WithSiteContentHeading contentHeads={res}></WithSiteContentHeading>
      </div>
    );
  }
  return notFound();
};

export default getPage;
