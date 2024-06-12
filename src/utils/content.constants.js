import siteConfig from '../../site.json' assert { type: 'json' };

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

// ALGOLIA 环境变量
export const NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY || '';
export const NEXT_PUBLIC_ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
export const NEXT_PUBLIC_ALGOLIA_INDEX = process.env.NEXT_PUBLIC_ALGOLIA_INDEX || '';
export const NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY || '';

// 应用环境变量
export const NEXT_PUBLIC_HOST = process.env.NEXT_PUBLIC_HOST || '';

export const PAGE_METADATA = {
  title: siteConfig.title,
}
