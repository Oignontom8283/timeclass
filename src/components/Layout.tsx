import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="w-full h-12 flex items-center justify-center border-b border-gray-300 bg-zinc-50">
        <div className='font-mono text-2xl font-bold'>TimeClass</div>
      </header>

      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

