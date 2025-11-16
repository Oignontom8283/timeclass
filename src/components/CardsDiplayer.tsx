import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext"
import { addressFormatter } from "../utils/formatters";
import Card from "./Card";

export default function CardsDiplayer() {

  const data = useData();

  return (
    <ul>
      {data.schools.map(school => (
        <li key={school.id} className="cursor-pointer hover:scale-[1.009]">
          <Link to={`/school/${school.id}`}>
            <Card title={school.name.en || school.name.original} titleSecondary={school.name.original} description={addressFormatter(school.address)} />
          </Link>
        </li>
      ))}
    </ul>
  )
}