import Moveable from "react-moveable";
import TimestampElement from "../components/TimestampElement";

export default function Test() {
  return (
    <div className="w-screen h-screen bg-red-300">
      <Moveable
        target={".target"}
        draggable={true}
        resizable={false}
        scalable={true}
        warpable={false}
        throttleDrag={0}
        throttleResize={0}
        edge={true}
        origin={false}
        rotatable={true}

        onDrag={e => {
          e.target.style.transform = e.transform;
        }}

        onScale={e => {
          e.target.style.transform = e.transform;
          console.log(e.target.style.transform);
          
        }}

      />
      <div className="target w-64 h-64 bg-blue-700">
        {/* <TimestampElement timestamp={new Date("2026-01-01T12:00:00Z")} /> */}
        BONjour
      </div>
    </div>
  );
}