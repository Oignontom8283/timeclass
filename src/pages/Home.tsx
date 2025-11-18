import CardsDiplayer from "../components/CardsDiplayer";

export default function Home() {

  return (
    <div className="flex flex-col items-center min-h-0 grow">
      <div className="mt-24 flex flex-col items-center justify-center gap-4">
        <sub className="text-3xl">Welcome to <span className="font-bold font-mono">TimeClass</span> !</sub>
        <h1 className="text-2xl italic">Schedule for your school.</h1>
      </div>
      <div className="mt-10">
        <CardsDiplayer />
      </div>
    </div>
  );
};