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

const getPage: FC<Params> = async ({ params }: Params) => {
  const { path = [] } = params;
  const { source, filename } = await dynamicRouter.getMarkdownFile(
    decodeURI(path.join('/'))
  )
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
