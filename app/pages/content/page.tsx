import Link from 'next/link';

export default function PageContent() {
  return (
    <div>
      PageContent
      <Link href="/pages/details">页面跳转</Link>
    </div>
  );
}
