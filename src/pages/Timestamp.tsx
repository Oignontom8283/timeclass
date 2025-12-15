import { Link, useParams } from "react-router-dom";
import ErrorGrow from "../components/ErrorGrow";
import { useData } from "../contexts/DataContext";
import TimestampElement from "../components/TimestampElement";
import { useEffect, useMemo, useRef, useState } from "react";
import Moveable from "react-moveable";
import { getReactTransform, setReactTransform } from "../utils/parser";


enum ItemType {
  TIMESTAMP = "timestamp",
  PARAGRAPHE = "paragraph",
}

type ItemTypes = `${ItemType}`

/**
 * Map defining content types for specific item types.
 * Only include types that require non-null content.
 */
type ItemContentMap = {
  paragraph: string;
  // Add here ONLY the types that require a non-null content
  // exemple: "image": HTMLImageElement;
}

type MoveableItem = {
  [K in ItemTypes]: {
    id: string;
    type: K;
    ref: React.RefObject<HTMLDivElement | null>;
    content: K extends keyof ItemContentMap ? ItemContentMap[K] : null;
    imuable?: boolean;
    y: number;
    x: number;
    width: number;
    height: number;
    scaleY: number;
    scaleX: number;
    rotation: number;
  }
}[ItemTypes];


export default function Timestamp() {
  
  const [inputWidth, setInputWidth] = useState(200);


  const [textDisplayed, setTextDisplayed] = useState("");
  const [fullScreenMode, setFullScreenMode] = useState(false);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullScreenMode(document.fullscreenElement !== null);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange); // Set up event listener
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange); // Clean up event listener
  }, []);

  useEffect(() => {
    if (fullScreenMode) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          setFullScreenMode(false);
        });
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {
          /* ignore if already exited */
        });
      }
    }
  }, [fullScreenMode])
  
  
  const [movableItems, setMovableItems] = useState<MoveableItem[]>([]); // State to hold movable elements
  const [selectedItems, setSelectedItems] = useState<MoveableItem[]>([]); // State to hold selected elements
  const [oneSelectedItem, setOneSelectedItem] = useState<MoveableItem | null>(null); // State to hold single selected element
  // @ts-ignore
  const [isMultipleSelected, setIsMultipleSelected] = useState<boolean>(false); // State to indicate if multiple elements are selected

  // Update isMultipleSelected whenever selectedItems changes
  useEffect(() => {
    setIsMultipleSelected(selectedItems.length > 1);
    setOneSelectedItem(selectedItems.length === 1 ? selectedItems[0] : null);
  }, [selectedItems]);
  
  
  const timestampRef = useRef<HTMLDivElement | null>(null);
  const timestampItem: MoveableItem = { id: "0", type: "timestamp", ref: timestampRef, content: null, imuable: true, x: 0, y: 0, width: 0, height: 0, scaleX: 0, scaleY: 0, rotation: 0 };
  useEffect(() => {
    setMovableItems(prevItems => prevItems.some(item => item.id === "0")
      ? prevItems
      : [...prevItems, timestampItem]);
  }, [])

  const targets = useMemo(
    () => movableItems.map(el => el.ref.current).filter(Boolean) as HTMLElement[],
    [movableItems]
  );

  const onClickItem = (item: MoveableItem, e:React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!item.ref.current) return;

    // Add or remove from selection based on Shift key
    if (e.shiftKey) {
      setSelectedItems(prev => {

        // Check if item is already selected
        const isAlreadySelected = prev.includes(item);

        // If already selected, remove it; otherwise, add it
        return isAlreadySelected
          ? prev.filter(i => i !== item) // Remove from selection
          : [...prev, item]; // Add to selection
      });
    } else {
      // Single selection
      setSelectedItems([item]); // Set selectedItems to only the clicked item
    };
  }
  

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
    <div
      className="flex flex-col items-center justify-center bg-zinc-50 min-h-screen" // Prend tout l'écran
      onClick={() => setSelectedItems([])} // Deselect all on background click
    > 
      
      <Moveable
        target={targets}
        draggable={true}
        warpable={false}
        throttleDrag={0}
        throttleResize={0}
        edge={true}
        origin={false}
        keepRatio={false}
        rotatable={selectedItems.length === 1}
        hideDefaultLines={selectedItems.length === 0}
        hideThrottleDragRotateLine={true}
        resizable={oneSelectedItem?.type === ItemType.PARAGRAPHE}
        scalable={oneSelectedItem?.type === ItemType.TIMESTAMP}
        onDrag={e => e.target.style.transform = e.transform}
        onScale={e => {
          const [scaleX, scaleY] = getReactTransform(e.transform, "scale") || [1, 1]; // Get current scale values
          const uniformScale = Math.max(scaleX, scaleY); // Determine uniform scale
          e.target.style.transform = setReactTransform(e.transform, "scale", [uniformScale, uniformScale]); // Apply uniform scale
        }}
        onRotate={e => e.target.style.transform = e.transform}
        onDragStart={e => {
          const item = movableItems.find(el => el.ref.current === e.target); // Find the dragged item
          if (item && item.ref.current) { // If item found and has a ref
            if (!selectedItems.includes(item)) { // If item is not already selected
              setSelectedItems([item]); // Select only the dragged item
            }
          }
        }}
      />


      {/* Base commands buttons */}
      <div className="fixed top-4 left-4 flex flex-rowjustify-center items-center gap-1">

        {!fullScreenMode ? ( // Fullscreen button only in non-fullscreen mode
          <button // FULLSCREEN BUTTON
            onClick={() => setFullScreenMode(true)}
            className="p-4 text-2xl focus:outline-none text-black hover:text-black/70 cursor-pointer transition-opacity"
            title="Enter fullscreen"
          >
            ⛶
          </button>
        ) : ( // Close button only in fullscreen mode
          <button // EXIT FULLSCREEN BUTTON
            onClick={() => setFullScreenMode(false)}
            className="p-4 text-2xl focus:outline-none text-black/70 opacity-0 hover:opacity-100 cursor-pointer"
            title="Exit fullscreen"
          >
            ✕
          </button>
        )}

        {!fullScreenMode && ( // BACK BUTTON only in non-fullscreen mode
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



      {/* Timestamp item */}
      <div ref={timestampRef} onClick={e => onClickItem(timestampItem, e)} className="scale-250">
        <TimestampElement timestamp={time.time} />
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
