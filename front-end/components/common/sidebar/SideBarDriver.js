import { Text, Flex, Box } from '@chakra-ui/react';
import { AiOutlineMenu } from 'react-icons/ai';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '@/src/store';

export default function SideBarDriver() {
  const [state, dispatch, axiosJWT] = useStore();
  const router = useRouter();
  const [menuStatus, setMenuStatus] = useState(false);
  const handleShowMenu = useCallback(() => {
    setMenuStatus(!menuStatus);
  }, [menuStatus]);

  const handleLogOut = useCallback(async () => {
    try {
      const logOut = await axiosJWT.post(
        `http://localhost:5000/logout`,
        { id: state.dataUser.id },
        {
          withCredentials: true,
          headers: { token: `Bearer ${state.dataUser.token}` },
        }
      );
      if (logOut.data.statusCode == 200) {
        router.push('/');
      }
    } catch (err) {
      console.log(err);
    }
  }, [state]);

  return (
    <Flex
      backgroundColor="#F26A4C"
      color={'#fff'}
      justifyContent={'space-between'}
      flexWrap={'wrap'}
      position="fixed"
      width={'100%'}
      zIndex="2"
    >
      <Text fontFamily="Gugi" fontSize="38px" margin={'1% 5%'}>
        BOM
      </Text>
      <Box width="40px" height="40px" textAlign="center" margin="2%">
        <AiOutlineMenu
          fontSize="38px"
          margin="0 auto"
          textAlign="center"
          onClick={handleShowMenu}
        />
      </Box>
      {menuStatus && (
        <Box width={'100%'} fontSize={'20px'} textAlign={'end'} paddingBottom={'10px'}>
          <ul style={{ width: '90%', margin: '0 auto', listStyle: 'none' }}>
            <li
              style={{ padding: '4%', borderBottom: '1px solid #fff' }}
              onClick={() => {
                router.push('/driver/settings/user-information');
                setMenuStatus(!menuStatus);
              }}
            >
              Thông tin cá nhân
            </li>
            <li style={{ padding: '4%' }} onClick={handleLogOut}>Đăng xuất</li>
          </ul>
        </Box>
      )}
    </Flex>
  );
}
