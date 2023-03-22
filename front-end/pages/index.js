import axios from 'axios';

import HomeContent from '../components/home/content/HomeContent';
import HomeDestination from '@/components/home/book-ticket/HomeDestination';
import PopularRoute from '@/components/home/content/PopularRoute';
import LoginForm from '../components/home/login';

export default function HomePage(props) {
  const LoginFormHTML= <LoginForm />
  const HomeContentHTML = <HomeContent />;
  const HomeDestinationHTML = (
    <HomeDestination list_city={props.list_city} port={props.BACK_END_PORT} />
  );

  const PopularRouteHTML = <PopularRoute />;

  return (
    <>
      <header>
        {LoginFormHTML}
        {HomeContentHTML}
        {HomeDestinationHTML}
      </header>
      <main>{PopularRouteHTML}</main>
    </>
  );
}
export async function getStaticProps() {
  const getListCity = await axios.get(
    `http://localhost:${process.env.BACK_END_PORT}/city/list-city`
  );
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
      list_city: getListCity.data.data?.listCity,
    },
  };
}
