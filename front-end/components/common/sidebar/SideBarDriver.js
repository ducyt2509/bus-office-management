import { Text, Flex, Box } from '@chakra-ui/react';
import { AiOutlineMenu } from 'react-icons/ai';
import { useCallback, useState } from 'react';

export default function SideBarDriver() {
  const [menuStatus, setMenuStatus] = useState(false);
  const handleShowMenu = useCallback(() => {
    setMenuStatus(!menuStatus);
  }, [menuStatus]);

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
            <li style={{ padding: '4%', borderBottom: '1px solid #fff' }}>Thông tin cá nhân</li>
            <li style={{ padding: '4%' }}>Đăng xuất</li>
          </ul>
        </Box>
      )}
    </Flex>
  );
}
