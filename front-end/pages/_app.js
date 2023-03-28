import '@/styles/globals.css';
import '@/styles/bom_navbar.css';
import '@/styles/bom_login.css';
import '@/styles/bom_home.css';
import '@/styles/bom_contactus.css';
import '@/styles/bom_table.css';
import '@/styles/bom_bus_schedule.css';
import '@/styles/bom_vehicle_type.css';
import '@/styles/bom_personal_info.css';
import '@/styles/bom_toast_position.css';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/common/sidebar/SideBar';
import NavBar from '@/components/home/login';
import { StoreProvider } from '@/src/store';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <ChakraProvider>
      <StoreProvider>
        {router.pathname.includes('/admin') && <Sidebar />}
        {router.pathname != '/contact-us' &&
          router.pathname != '/' &&
          !router.pathname.includes('/admin') && <NavBar />}
        <Component {...pageProps} />
      </StoreProvider>
    </ChakraProvider>
  );
}
