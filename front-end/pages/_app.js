import '@/styles/globals.css';
import '@/styles/bo_navbar.css';
import '@/styles/bo_login.css';
import '@/styles/bo_home.css';
import '@/styles/bo_contactus.css';
import '@/styles/bo_table.css';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/common/sidebar/SideBar';
import { StoreProvider } from '@/src/store';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <ChakraProvider>
      <StoreProvider>
        {router.pathname.includes('/admin') && <Sidebar />}
        <Component {...pageProps} />
      </StoreProvider>
    </ChakraProvider>
  );
}
