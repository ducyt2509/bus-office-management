import { useRouter } from 'next/router';
import { useStore } from '@/src/store';

export default function AdminPage(props) {
  const [state, dispatch] = useStore();
  const router = useRouter();
  return <>Admin home</>;
}
export async function getServerSideProps(context) {
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
    },
  };
}
