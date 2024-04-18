/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['tsx', 'ts', 'js', 'jsx', 'mdx'],
  reactStrictMode: true,
  images: {
    domains: ['cos.codefe.top', 'webnav.codefe.top']
  }
};

export default nextConfig;
