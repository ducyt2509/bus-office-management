import { useRouter } from 'next/router';
import { useStore } from '@/src/store';

export default function AdminPage(props) {
  const [state, dispatch] = useStore();
  console.log(state);
  const router = useRouter();
  console.log();
  return <>Admin home</>;
}
export async function getServerSideProps(context) {
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
    },
  };
}
