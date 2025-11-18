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
    return (
      <div className='flex justify-center items-center min-h-screen bg-red-200'>
        <div className='bg-red-400 border-2 border-red-500 p-4 rounded-2xl'>
          <h1 className='font-bold text-black text-4xl pb-4'>ERROR :</h1>
          <p className='text-white'>{data.error.message}</p>
        </div>
      </div>
    );
  }
  else {
    return children;
  };
};
