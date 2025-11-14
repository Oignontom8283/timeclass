import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="">
        <div></div>
      </header>

      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

