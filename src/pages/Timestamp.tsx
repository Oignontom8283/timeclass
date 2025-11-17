import { useParams } from "react-router-dom";
import ErrorGrow from "../components/ErrorGrow";
import { useData } from "../contexts/DataContext";
import TimestampElement from "../components/TimestampElement";

export default function Timestamp() {

  const { schoolId, timestampId } = useParams();

  const data = useData();

  const school = data.schools.find((school) => school.id === schoolId);

  if (!school) {
    return (
      <div className="flex flex-col min-h-screen grow">
        <ErrorGrow title="School not found" />
      </div>
    )
  }

  const time = school.scheduleAll.find((_, index) => index === Number(timestampId));

  if (!schoolId || !timestampId || !time) {
    return (
      <div className="flex flex-col min-h-screen grow">
        <ErrorGrow title="Invalid URL parameters" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center bg-zinc-50 min-h-screen"> {/* Prend tout l'écran */}
      
      <div className="scale-250">
        <TimestampElement timestamp={time.time} />
      </div>

      <button
        onClick={() => {
          if (document.fullscreenElement) {
        document.exitFullscreen();
          } else {
        document.documentElement.requestFullscreen();
          }
        }}
        className={`fixed top-5 left-5 p-2 text-2xl focus:outline-none text-black hover:text-black/70 cursor-pointer transition-opacity ${
          document.fullscreenElement ? "opacity-0 hover:opacity-100" : "opacity-100"
        }`}
        aria-label="Fullscreen"
        onMouseEnter={(e) => {
          if (document.fullscreenElement) {
            e.currentTarget.style.opacity = "1";
          }
        }}
        onMouseLeave={(e) => {
          if (document.fullscreenElement) {
            e.currentTarget.style.opacity = "0";
          }
        }}
      >
        {document.fullscreenElement ? "✖" : "⛶"}
      </button>
    </div>
  )
}
