import { readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { cache } from 'react';
import { VFile } from 'vfile';
import { matter as VFileMatter } from 'vfile-matter';
import { glob } from 'glob';
import { normalize, join } from 'path';
import * as matter from 'gray-matter';
import { evaluate } from '@mdx-js/mdx';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import { PAGE_METADATA } from '@/src/utils/content.constants'
import { getMenusByPath } from '@/src/utils/navigation'
import siteConfig from '../../site.json' assert { type: 'json' };

const createCachedMarkdownCache = () => {
  return new Map();
}
const getDynamicRouter = async () => {
  const cachedMarkdownFiles = createCachedMarkdownCache();

  const pathnameToFilename = new Map();
  const globCacheByPath = new Map();
  const getMarkdownFiles = async (root, cwd, ignore = []) => {
    const cacheKey = `${root}${cwd}${ignore.join('')}`;
    if (!globCacheByPath.has(cacheKey)) {
      globCacheByPath.set(cacheKey, glob('**/*.{md,mdx}', { root, cwd, ignore }));
    }
    return globCacheByPath.get(cacheKey);
  }
  const websitePages = await getMarkdownFiles(
    process.cwd(),
    'src/content'
  );

  websitePages.forEach((filename) => {
    let pathname = filename.replace(/((\/)?(index))?\.mdx?$/i, '');
    if (pathname.length > 1 && pathname.endsWith('\\')) {
      pathname = pathname.substring(0, pathname.length - 1);
    }
    pathname = normalize(pathname).replace('.', '');
    pathnameToFilename.set(pathname, filename);
  })


  const _getMarkdownFile = async (pathname = '') => {
    const normalizedPathname = normalize(pathname).replace('.', '');
    if (pathnameToFilename.has(normalizedPathname)) {
      const filename = pathnameToFilename.get(normalizedPathname);
      
      let filePath = join(process.cwd(), 'src/content');
      if (cachedMarkdownFiles.has(pathname)) {
        const fileContent = cachedMarkdownFiles.get(pathname);
        return {
          source: fileContent,
          filename,
        }
      }
      if (existsSync(join(filePath, filename))) {
        filePath = join(filePath, filename)
        const fileContent = await readFile(filePath, 'utf-8');
        cachedMarkdownFiles.set(pathname, fileContent);

        return {
          source: fileContent,
          filename,
        }
      }
    }
    return { filename: '', source: '' };
  }

  const getMarkdownFile = cache(async (pathname) => {
    return await _getMarkdownFile(pathname);
  });


  const getPathname = () => {}

  const _getMDXContent = async (source = '', filename = '') => {
    // const sourceAsVirtualFile = new VFile(source);
    // const fileExtension = filename.endsWith('.mdx') ? 'mdx' : 'md';

    // return compileMDX(sourceAsVirtualFile, fileExtension);
    
    const { data, content } = matter(source);
    getContentInfo(content);
    return { MDXContent: source, meta: data };
  }
  const getMDXContent = cache(async(source, filename) => {
    return await _getMDXContent(source, filename);
  })

  function headingTree() {
    return (node, file) => {
      file.data.headings = getHeadings(node);
    };
  }

  function transformNode(node, output, indexMap) {
    const transformedNode = {
      value: node.children[0].value,
      depth: node.depth,
      children: [],
    };
  
    if (node.depth === 2) {
      output.push(transformedNode);
      indexMap[node.depth] = transformedNode;
    } else {
      const parent = indexMap[node.depth - 1];
      if (parent) {
        parent.children.push(transformedNode);
        indexMap[node.depth] = transformedNode;
      }
    }
  }

  function getHeadings(root) {
    const output = [];
    const indexMap = {};
    visit(root, "heading", (node) => {
      transformNode(node, output, indexMap);
    })
    return output;
  }
  const getContentInfo = cache(async(source) => {
    const { data } = await remark().use(headingTree).process(source)
    return data.headings || []
  })

  const reactRuntime = { Fragment, jsx, jsxs };
  const compileMDX = async (source, fileExtension) => {
    const { data } = VFileMatter(source, { strip: true });

    const { default: MDXContent } = await evaluate(source, {
      format: fileExtension,
      ...reactRuntime
    });

    const { headings, matter: frontmatter, readingTime } = source.data;

    return { MDXContent, headings, frontmatter, readingTime };
  }

  const _getPageMetadata = async (path = '') => {
    const pageMetadata = { ...PAGE_METADATA };
    const { source = '' } = await getMarkdownFile(path);

    const { data } = matter(source);
    if (!data.title) {
      // const info = await dynamicRouter.getContentInfo(source)
    }
    pageMetadata.title = data.title
      ? `${siteConfig.title} — ${data.title}`
      : siteConfig.title;

    return pageMetadata;
  }
  const getPageMetadata = cache(async (path) => {
    return await _getPageMetadata(path);
  });

  const _getCurrentPageMenus = async (path) => {
    const res = await getMenusByPath(path);
    return res;
  }
  const getCurrentPageMenus = cache(async (path) => {
    return await _getCurrentPageMenus(path);
  })

  return {
    getMarkdownFile,
    getPathname,
    getMDXContent,
    getContentInfo,
    getPageMetadata,
    getCurrentPageMenus,
  }
}

export const dynamicRouter = await getDynamicRouter();