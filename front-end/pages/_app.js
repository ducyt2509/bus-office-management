import '@/styles/globals.css';
import '@/styles/bo_navbar.css';
import '@/styles/bo_login.css';
import { ChakraProvider } from '@chakra-ui/react';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
