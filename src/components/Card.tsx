
export default function Card({title, titleSecondary, description}: { title: string; titleSecondary?: string; description: string }) {
  return (
    <div className="flex flex-col bg-zinc-50 p-2 border border-gray-300 rounded-lg shadow-md min-w-[320px] min-h-[85px]">
      <span className="font-bold">{title}</span>
      {titleSecondary && <span className="text-sm text-gray-600">{titleSecondary}</span>}
      <p className="italic text-sm mt-1">{description}</p>
    </div>
  )
}