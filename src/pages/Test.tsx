import { useState, useRef } from "react";
import Moveable from "react-moveable";
import TimestampElement from "../components/TimestampElement";
import { getReactTransform, setReactTransform } from "../utils/parser";

type ElementType = "timestamp" | "text";

interface MoveableElement {
  id: string;
  type: ElementType;
  ref: React.RefObject<HTMLDivElement | null>;
  content?: any;
  width?: number;
  height?: number;
}

export default function Test() {
  const [selectedTargets, setSelectedTargets] = useState<HTMLElement[]>([]);
  const [selectedElements, setSelectedElements] = useState<MoveableElement[]>([]);
  const [elements, setElements] = useState<MoveableElement[]>([]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const elementRefs = useRef<Map<string, React.RefObject<HTMLDivElement | null>>>(new Map());

  const isMultipleSelected = selectedTargets.length > 1;
  const selectedType = selectedElements.length === 1 ? selectedElements[0].type : null;

  const createElementRef = (id: string) => {
    if (!elementRefs.current.has(id)) {
      const ref: React.RefObject<HTMLDivElement | null> = { current: null };
      elementRefs.current.set(id, ref);
    }
    return elementRefs.current.get(id)!;
  };

  const addElement = (type: ElementType) => {
    const id = `element-${Date.now()}-${Math.random()}`;
    const newElement: MoveableElement = {
      id,
      type,
      ref: createElementRef(id),
      content: type === "timestamp" 
        ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000)
        : "Texte éditable",
      width: type === "text" ? 200 : undefined,
      height: type === "text" ? 100 : undefined,
    };
    setElements(prev => [...prev, newElement]);
  };

  const updateElementContent = (id: string, newContent: string) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, content: newContent } : el
    ));
  };

  const updateElementSize = (id: string, width: number, height: number) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, width, height } : el
    ));
  };

  const handleTargetClick = (element: MoveableElement, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!element.ref.current) return;

    if (e.shiftKey) {
      // Mode sélection multiple avec Shift
      setSelectedTargets(prev => {
        const isAlreadySelected = prev.includes(element.ref.current!);
        if (isAlreadySelected) {
          // Retirer de la sélection
          setSelectedElements(prevEls => prevEls.filter(el => el.id !== element.id));
          return prev.filter(t => t !== element.ref.current);
        } else {
          // Ajouter à la sélection
          setSelectedElements(prevEls => [...prevEls, element]);
          return [...prev, element.ref.current!];
        }
      });
    } else {
      // Sélection simple
      setSelectedTargets([element.ref.current]);
      setSelectedElements([element]);
    }
  };

  const handleTextDoubleClick = (element: MoveableElement, e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === "text") {
      setEditingTextId(element.id);
    }
  };

  const renderElement = (element: MoveableElement) => {
    switch (element.type) {
      case "timestamp":
        return <TimestampElement timestamp={element.content} />;
      case "text":
        const isEditing = editingTextId === element.id;
        return (
          <div 
            className="bg-white p-4 rounded shadow-lg overflow-hidden"
            style={{
              width: element.width ? `${element.width}px` : '200px',
              height: element.height ? `${element.height}px` : '100px',
            }}
          >
            {isEditing ? (
              <textarea
                autoFocus
                value={element.content}
                onChange={(e) => updateElementContent(element.id, e.target.value)}
                onBlur={() => setEditingTextId(null)}
                className="w-full h-full resize-none border-none outline-none text-gray-800 bg-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="text-gray-800 whitespace-pre-wrap h-full overflow-auto">
                {element.content}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen bg-red-300 relative">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <button
          onClick={() => addElement("timestamp")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + Timestamp
        </button>
        <button
          onClick={() => addElement("text")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          + Texte
        </button>
      </div>

      {/* Canvas */}
      <div 
        className="w-full h-full flex items-center justify-center"
        onClick={(e) => {
          // Désélectionner si on clique sur le fond
          if (e.target === e.currentTarget) {
            setSelectedTargets([]);
            setSelectedElements([]);
            setEditingTextId(null);
          }
        }}
      >
        <Moveable
          target={elements.map(el => el.ref.current).filter(Boolean) as HTMLElement[]}
          draggable={true}
          resizable={selectedType === "text"}
          scalable={selectedType === "timestamp" && !isMultipleSelected}
          warpable={false}
          throttleDrag={0}
          throttleResize={0}
          edge={true}
          origin={false}
          rotatable={selectedType === "timestamp" && !isMultipleSelected}
          keepRatio={false}
          hideDefaultLines={selectedTargets.length === 0}

          onClickGroup={e => {
            // Sélection du groupe au clic
            const clickedElement = elements.find(el => el.ref.current === e.inputTarget);
            if (clickedElement) {
              handleTargetClick(clickedElement, e.inputEvent as any);
            }
          }}

          onDragStart={e => {
            // Auto-sélectionner au début du drag
            const draggedElement = elements.find(el => el.ref.current === e.target);
            if (draggedElement && draggedElement.ref.current) {
              if (!selectedTargets.includes(draggedElement.ref.current)) {
                setSelectedTargets([draggedElement.ref.current]);
                setSelectedElements([draggedElement]);
              }
            }
          }}

          onDragGroup={e => {
            // En sélection multiple
            e.events.forEach((ev: any) => {
              ev.target.style.transform = ev.transform;
            });
          }}

          onDrag={e => {
            // En sélection simple
            e.target.style.transform = e.transform;
          }}

            onResize={e => {
              // Redimensionnement pour les éléments texte
              if (selectedType === "text" && selectedElements.length === 1) {
                const element = selectedElements[0];
                e.target.style.width = `${e.width}px`;
                e.target.style.height = `${e.height}px`;
                updateElementSize(element.id, e.width, e.height);
              }
            }}

            onScale={e => {
              // Scale pour les éléments timestamp
              if (selectedType === "timestamp") {
                const [scaleX, scaleY] = getReactTransform(e.transform, "scale") || [1, 1];
                const uniformScale = Math.max(scaleX, scaleY);
                e.target.style.transform = setReactTransform(e.transform, "scale", [uniformScale, uniformScale]);
              }
            }}

            onRotate={e => {
              // Rotation pour les éléments timestamp
              if (selectedType === "timestamp") {
                e.target.style.transform = e.transform;
              }
            }}

          />

        {/* Render all elements */}
        {elements.map((element) => (
          <div
            key={element.id}
            ref={element.ref}
            className="absolute target cursor-move"
            onClick={(e) => handleTargetClick(element, e)}
            onDoubleClick={(e) => handleTextDoubleClick(element, e)}
          >
            {renderElement(element)}
          </div>
        ))}
      </div>
    </div>
  );
}