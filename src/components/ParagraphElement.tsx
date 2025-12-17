import { useState } from "react";


export default function ParagraphElement({ value, onChange }: { value: string; onChange: (newValue: string) => void }) {

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={"p-1 font-sans w-full h-full " + (isEditing ? "bg-gray-500/90" : "")}>
      {!isEditing ? (
        <p
          onClick={() => setIsEditing(true)}
          className="cursor-text whitespace-pre-wrap m-0 p-0"
        >
          {value}
        </p>
      ) : (
        <textarea
          onChange={e => onChange(e.target.value)}
          value={value}
          className={"w-full h-full bg-transparent resize-none outline-none border-none whitespace-pre-wrap m-0 p-0" + (isEditing ? ' bg-white' : "")}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      )}
    </div>
  )
}