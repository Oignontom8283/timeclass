import { Link } from "react-router-dom";
import Error from "./Error";

export default function ErrorGrow({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center min-h-0 grow bg-red-50">
        <Error title={title}>
            {children || <Link to="/" className='text-blue-500 hover:text-blue-600 underline'>Return to Home</Link>}
        </Error>
    </div>
  )
}
