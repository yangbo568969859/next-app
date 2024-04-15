import { FC } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { getContentBySlug } from '@/src/utils/content';
import WithSiteHeader from '@/src/components/withSiteHeader'
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
  // @ts-ignore
  const { content: MDXContent } = await getContentBySlug(path.join('/'));
  return (
    <div className="w-full">
      <WithSiteHeader></WithSiteHeader>
      <div className="mx-auto max-w-2xl bg-[--bg] px-5 py-12 text-[--text]">
        <div className="markdown mt-10">
          <MDXRemote
            source={MDXContent || ''}
            options={{
              parseFrontmatter: true,
              mdxOptions: {
                // @ts-ignore
                remarkPlugins: [remarkMath],
                rehypePlugins: [
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
  );
};

export default getPage;
