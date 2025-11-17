
export default function Error({ message, title, children }:{ message?: string, title?:string, children?: React.ReactNode }) {

  title = title || "Error";

  return (
    <div className='bg-red-400 border-2 border-red-500 p-4 rounded-2xl shadow-md max-w-md'>
      <h1 className='font-bold text-black text-2xl pb-3'>{title} :</h1>
      <div className="text-white">
        {children ? children : message ? <p>{message}</p> : <p>An unknown error occurred.</p>}
      </div>
    </div>
  )
}