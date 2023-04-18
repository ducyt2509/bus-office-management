import { useStore } from '@/src/store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminPage(props) {
  const router = useRouter();
  const [state, dispatch] = useStore();
  useEffect(() => {
    router.push('/admin/ticket');
  }, []);
  return <></>;
}
export async function getServerSideProps(context) {
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
    },
  };
}
