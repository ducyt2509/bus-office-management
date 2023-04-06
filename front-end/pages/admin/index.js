import { useRouter } from 'next/router';
import { useStore } from '@/src/store';
import { useEffect } from 'react';

export default function AdminPage(props) {
  const [state, dispatch] = useStore();
  const router = useRouter();
  useEffect(() => {
    router.push('/admin/ticket');
  }, []);
  return <>Admin home</>;
}
export async function getServerSideProps(context) {
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
    },
  };
}
