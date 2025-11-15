import { useData } from "../contexts/DataContext";
import { addressFormatter } from "../utils/formatters";

export default function Home() {

  const data = useData();

  return (
    <div>
      <div>
        <h1>TimeClass</h1>
        <p>Welcome to TimeClass !<br/> Schedule for your school.</p>
      </div>
      <ul>
        {data.schools.map(school => (
          <li key={school.id}>
            <h2>{school.name.original}</h2>
            <p>{addressFormatter(school.address)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};