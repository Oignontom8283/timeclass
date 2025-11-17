import { Link, useParams } from "react-router-dom";
import { useData } from "../contexts/DataContext"
import Error from "../components/Error";

export default function School() {
  
  const data = useData();

  const { schoolId } = useParams(); // Get schoolId from route parameters

  const school = data.schools.find((school) => school.id === schoolId); // Find school by schoolId

  if (!school) { // If school not found, show error
    return (
      <div className="flex justify-center items-center min-h-0 grow bg-red-50">
        <Error title="School Not Found">
          <Link to="/" className='text-blue-500 hover:text-blue-600 underline'>Return to Home</Link>
        </Error>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center min-h-0 grow">
      <div className="mt-10 mb-10">
        <h1 className="font-bold text-black text-4xl">{school.name.en || school.name.original}</h1>
      </div>

      <div className="h-0.5 bg-gray-200 w-[50%]"/>

      <div className="p-8">
        <pre>{JSON.stringify(data.schools, null, 2)}</pre>
      </div>

    </div>
  )
}