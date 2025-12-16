

export default function ParagraphElement({ value, onChange }: { value: string; onChange: (newValue: string) => void }) {
  return (
    <div>
      <p>{value}</p>
    </div>
  )
}