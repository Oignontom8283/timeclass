import { useData } from '../contexts/DataContext';

export default function GlobalLayout({ children }: { children: React.ReactNode }) {

  const data = useData();

  if (data.loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }
  else if (data.error) {
    return <div>Error: {data.error.message}</div>;
  }
  else {
    return children;
  };
};
