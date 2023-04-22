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
import Sidebar from '@/src/components/common/sidebar/SideBar';
import NavBar from '@/src/components/home/login';
import { StoreProvider } from '@/src/store';
import SideBarDriver from '@/src/components/common/sidebar/SideBarDriver';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <ChakraProvider>
      <StoreProvider>
        {(router.pathname.includes('/admin') || router.pathname.includes('/staff')) && <Sidebar />}
        {router.pathname.includes('/driver') && <SideBarDriver />}
        {router.pathname != '/contact-us' &&
          router.pathname != '/' &&
          !router.pathname.includes('/admin') &&
          !router.pathname.includes('/staff') &&
          !router.pathname.includes('/driver') && <NavBar />}
        <Component {...pageProps} />
      </StoreProvider>
    </ChakraProvider>
  );
}
