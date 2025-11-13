import type { ReactNode } from 'react';
import { useData } from '../contexts/DataContext';

export default function Layout({ children }: { children: ReactNode }) {

  const data = useData();

  if (data.loading) {
    return <div>Loading...</div>;
  }
  else if (data.error) {
    return <div>Error: {data.error.message}</div>;
  }
  else {
    return (
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    );
  };
};
