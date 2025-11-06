import { Link } from 'react-router-dom';

export default function NotFound(){
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>This page could not be found.</p>
      <Link to="/">Return to Home</Link>
    </div>
  );
};