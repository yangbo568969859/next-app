import './layout.css';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="left"> 左侧</div>
      <div className="content">
        <div className="content-main">{children}</div>
      </div>
    </div>
  );
}
