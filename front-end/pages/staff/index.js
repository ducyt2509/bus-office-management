import Ticket from '../admin/ticket';
import axios from 'axios';

export default function StaffScreen(props) {
  return <Ticket port={props.port} list_city={props.list_city} />;
}
export async function getStaticProps() {
  const getListCity = await axios.post(
    `http://localhost:${process.env.BACK_END_PORT}/city/list-city`
  );

  return {
    props: {
      port: process.env.BACK_END_PORT,
      list_city: getListCity.data.data?.listCity,
    },
  };
}
