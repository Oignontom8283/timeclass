import { Link, useParams } from "react-router-dom";
import ErrorGrow from "../components/ErrorGrow";
import { useData } from "../contexts/DataContext";
import TimestampElement from "../components/TimestampElement";
import { useEffect, useState } from "react";

export default function Timestamp() {

  const [textDisplayed, setTextDisplayed] = useState("");
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [inputWidth, setInputWidth] = useState(200);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullScreenMode(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange); // Set up event listener
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange); // Clean up event listener
  }, []);

  useEffect(() => {
    if (fullScreenMode) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [fullScreenMode])

  const { schoolId, timestampId } = useParams(); // Get schoolId and timestampId from route parameters
  const data = useData(); // Access data from context

  const school = data.schools.find((school) => school.id === schoolId); // Find school by schoolId
  if (!school) { // If school not found, show error
    return (
      <div className="flex flex-col min-h-screen grow">
        <ErrorGrow title="School not found" />
      </div>
    )
  }

  const time = school.scheduleAll.find((_, index) => index === Number(timestampId)); // Find time by timestampId
  if (!schoolId || !timestampId || !time) { // If parameters are invalid, show error
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

      {/* Base commands buttons */}
      <div className="fixed top-4 left-4 flex flex-rowjustify-center items-center gap-1">

        {!fullScreenMode ? ( // Fullscreen button only in non-fullscreen mode
          <button
            onClick={() => setFullScreenMode(true)}
            className="p-4 text-2xl focus:outline-none text-black hover:text-black/70 cursor-pointer transition-opacity"
            title="Enter fullscreen"
          >
            ⛶
          </button>
        ) : ( // Close button only in fullscreen mode
          <button
            onClick={() => setFullScreenMode(false)}
            className="p-4 text-2xl focus:outline-none text-black/70 opacity-0 hover:opacity-100 cursor-pointer"
            title="Exit fullscreen"
          >
            ✕
          </button>
        )}

        {!fullScreenMode && ( // Back button only in non-fullscreen mode
          <Link to={`/school/${schoolId}`} className="p-4 text-black hover:text-black/70 cursor-pointer transition-opacity" title="Back to schedule">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
        )}
      </div>

      {/* tools */}
      <div className={"fixed top-2 left-1/2 -translate-x-1/2 " + (fullScreenMode ? "opacity-0" : "opacity-100")}>
        {/* TODO: create tools here */}
      </div>
      
      {/* text input diplayer */}
      <div className={"fixed top-[37.5%] -translate-y-1/2 left-1/2 -translate-x-1/2 " + (fullScreenMode ? "border-0" : "border-dotted border-2 border-zinc-300 rounded-3xl")}> {/* 37.5% = 3/8 = (1/4 + 1/8) */}
        <span className="invisible absolute whitespace-pre text-xl p-4" ref={(span) => {span && setInputWidth(Math.max(span.offsetWidth, 200))}} >
          {textDisplayed || "Taper votre text ici..."}
        </span>
        <input
          type="text"
          value={textDisplayed}
          onChange={e => setTextDisplayed(e.target.value)}
          className="bg-transparent border-0 outline-0 text-center text-xl p-4 text-black"
          placeholder={fullScreenMode && textDisplayed.length === 0 ? "" : "Taper votre text ici..."}
          style={{ width: `${inputWidth}px` }}
        />
      </div>

    </div>
  )
}
