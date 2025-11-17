import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full h-12 flex items-center justify-center border-b border-gray-300 bg-zinc-50">
        <Link to="/">
          <div className='font-mono text-2xl font-bold'>TimeClass</div>
        </Link>
      </header>

      <main className="flex flex-col grow">
        <Outlet />
      </main>
    </div>
  );
};