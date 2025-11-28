import Moveable from "react-moveable";
import TimestampElement from "../components/TimestampElement";
import { getReactTransform, setReactTransform } from "../utils/parser";

export default function Test() {
  return (
    <div className="w-screen h-screen bg-red-300 flex items-center justify-center">
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
          // Conserver le ratio de l'élément lors du scale
          const [scaleX, scaleY] = getReactTransform(e.transform, "scale") || [1, 1];
          
          // Utiliser la plus grande valeur pour maintenir le ratio
          const uniformScale = Math.max(scaleX, scaleY);
          
          e.target.style.transform = setReactTransform(e.transform, "scale", [uniformScale, uniformScale]);

          console.log("origine:", e.target.style.transform);
        }}

        onRotate={e => {
          e.target.style.transform = e.transform;
        }}

      />
      <div className="target">
        <TimestampElement timestamp={new Date("2026-01-01T12:00:00Z")} />
        {/* BONjour */}
      </div>
    </div>
  );
}