import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { Flex } from '@chakra-ui/react';
import { color } from 'framer-motion';

export default function NavBar(props) {
  const [menuStatus, setMenuStatus] = useState(false);
  const handleShowMenu = useCallback(() => {
    setMenuStatus(!menuStatus);
  }, [menuStatus]);

  const router = useRouter();
  return (
    <div
      className="bom-navbar"
      style={
        router.pathname != '/' && !router.pathname.includes('/contact-us')
          ? { borderBottom: '2px solid #d9d9d9' }
          : {}
      }
    >
      <Flex
        color={'#fff'}
        justifyContent={'space-between'}
        flexWrap={'wrap'}
        width={'100%'}
        zIndex="2"
        className="bom-navbar-flex"
      >
        <div className="bom-navbar-bom-logo">
          <Link href={'/'}>
            <h1
              style={
                router.pathname != '/' && !router.pathname.includes('/contact-us')
                  ? { color: '#F26A4C' }
                  : { color: '#fff' }
              }
            >
              BOM
            </h1>
          </Link>
        </div>
        <ul className="bom-navbar-component">
          <li>
            <Link href={'/ticket'}>
              <div
                style={
                  router.pathname != '/' && !router.pathname.includes('/contact-us')
                    ? { color: '#F26A4C' }
                    : {}
                }
              >
                Tra cứu vé
              </div>
            </Link>
          </li>
          <li>
            <Link href={'/about-us'}>
              <div
                style={
                  router.pathname != '/' && !router.pathname.includes('/contact-us')
                    ? { color: '#F26A4C' }
                    : {}
                }
              >
                Về chúng tôi
              </div>
            </Link>
          </li>
          <li>
            <Link href={'/contact-us'}>
              <div
                style={
                  router.pathname != '/' && !router.pathname.includes('/contact-us')
                    ? { color: '#F26A4C' }
                    : {}
                }
              >
                Liên hệ
              </div>
            </Link>
          </li>
          <li>
            <Box
              backgroundColor={'#F26A4C'}
              borderRadius={'md'}
              onClick={props.handleShowLoginForm}
            >
              Đăng nhập
            </Box>
          </li>
        </ul>
        <Box width="40px" height="40px" textAlign="center" margin="2%" className="boxres">
          <AiOutlineMenu
            fontSize="38px"
            margin="0 auto"
            textAlign="center"
            onClick={handleShowMenu}
          />
        </Box>
        {menuStatus && (
          <Box width={'100%'} fontSize={'20px'} textAlign={'end'}>
            <ul style={{ width: '90%', margin: '0 auto', listStyle: 'none' }}>
              <li
                style={{ padding: '4%', borderBottom: '1px solid #fff' }}
                onClick={() => {
                  router.push('/ticket');
                  setMenuStatus(!menuStatus);
                }}
              >
                Tra cứu vé
              </li>
              <li
                style={{ padding: '4%', borderBottom: '1px solid #fff' }}
                onClick={() => {
                  router.push('/about-us');
                  setMenuStatus(!menuStatus);
                }}
              >
                Về chúng tôi
              </li>
              <li
                style={{ padding: '4%', borderBottom: '1px solid #fff' }}
                onClick={() => {
                  router.push('/contact-us');
                  setMenuStatus(!menuStatus);
                }}
              >
                Liên hệ
              </li>
              <li style={{ padding: '4%' }} onClick={props.handleShowLoginForm}>
                Đăng nhập
              </li>
            </ul>
          </Box>
        )}
      </Flex>
    </div>
  );
}
