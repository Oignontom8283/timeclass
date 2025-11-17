import { Link } from 'react-router-dom';
import Error from '../components/Error';

export default function NotFound() {
  return (
    <div className='min-h-screen min-w-screen flex justify-center items-center bg-red-200'>
      <Error>
        <p>This page could not be found.</p>
        <Link to="/" className='text-blue-600 hover:text-blue-500 underline'>Return to Home</Link>
      </Error>
    </div>
  );
};