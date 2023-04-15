import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminPage(props) {
  const router = useRouter();
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
