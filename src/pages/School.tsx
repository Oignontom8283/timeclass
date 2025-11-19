import { Link, useParams } from "react-router-dom";
import { useData } from "../contexts/DataContext"
import Timestamp from "../components/TimestampElement";
import ErrorGrow from "../components/ErrorGrow";

export default function School() {
  
  const data = useData();

  const { schoolId } = useParams(); // Get schoolId from route parameters

  const school = data.schools.find((school) => school.id === schoolId); // Find school by schoolId

  if (!school) { // If school not found, show error
    return (
      <ErrorGrow title="School not found" />
    )
  }
  
  const schedule = [ school?.scheduleStart, ...school?.schedule ]

  return (
    <div className="flex flex-col items-center min-h-0 grow">
      <div className="my-10 mb-7 flex flex-col items-center gap-2">
        <span className="font-bold text-black text-4xl">{school.name.en || school.name.original}</span>
        <h1 className="sr-only">Schedule for : {school.name.en ? `${school.name.original} — ${school.name.en}` : school.name.original}</h1>

        <div className="flex justify-evenly w-full">
          {school.website && <Link to={school.website} className="link" target="_blank" rel="noopener noreferrer">Website ↗</Link>}
          {school.scheduleOrigine && <Link to={school.scheduleOrigine} className="link" target="_blank" rel="noopener noreferrer">Original Schedule ↗</Link>}
        </div>
      </div>

      <div className="h-0.5 bg-gray-200 w-[50%]"/>

      <ul className="p-8 flex flex-col gap-6">
        {schedule.map((item, index) => (
          <li key={index} className="flex flex-col">
            
            <div className="flex justify-between">
              {/* Left */}
              <span className="text-xl font-bold">{item.label} :</span>

              {/* Right */}
              <span className="text-gray-500/70 text-base">{`${item.time.getHours()}h:${item.time.getMinutes()}m`}</span>
            </div>
            <Link to={`timestamp/${index}`}>
              <div className="bg-gray-300/50 p-2 rounded-xl border border-gray-400/70 shadow-sm inline-block my-4">
                <Timestamp timestamp={item.time} />
              </div>
            </Link>
          </li>
        ))}
      </ul>

    </div>
  )
}