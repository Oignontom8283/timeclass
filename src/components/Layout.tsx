import { Outlet } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

export default function Layout() {

  const data = useData();

  if (data.loading) {
    return <div>Loading...</div>;
  }
  else if (data.error) {
    return <div>Error: {data.error.message}</div>;
  }
  else {
    return (
      <div className="min-h-screen flex flex-col bg-base-100">
        <header className="navbar bg-primary text-primary-content shadow-lg">

        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    );
  };
};
