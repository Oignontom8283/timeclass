import { useData } from '../contexts/DataContext';

export default function GlobalLayout({ children }: { children: React.ReactNode }) {

  const data = useData();

  if (data.loading) {
    return <div>Loading...</div>;
  }
  else if (data.error) {
    return <div>Error: {data.error.message}</div>;
  }
  else {
    return children;
  };
};
