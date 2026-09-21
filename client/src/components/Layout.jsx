import Sidebar, { MobileNav } from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 pb-16 sm:pb-0">{children}</div>
      <MobileNav />
    </div>
  );
}