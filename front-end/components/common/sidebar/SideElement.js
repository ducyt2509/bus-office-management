import { Flex, Text, Link, Menu, MenuButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
export default function SideElement({ navSize, active, href, sideBarActive }) {
  const router = useRouter();
  const sideElementForManagement = sideBarActive == 2 && (
    <Flex w={'100%'} flexDirection="column">
      <Flex marginTop="10px" w="100%" alignItems={navSize == 'small' ? 'center' : 'flex-start'}>
        <div style={{ width: '10%' }}></div>
        <Menu>
          <Link
            as={NextLink}
            backgroundColor={router.pathname == '/admin/management/route' && '#686868'}
            p={3}
            borderRadius={8}
            _hover={{ textDecor: 'none', backgroundColor: '#686868', color: '#fff' }}
            color={router.pathname == '/admin/management/route' ? '#fff' : '#686868'}
            w={'90%'}
            href={href.route}
          >
            <MenuButton w="100%">
              <Text whiteSpace="nowrap" display={navSize == 'small' ? 'none' : 'flex'}>
                Quản lý tuyến đường
              </Text>
            </MenuButton>
          </Link>
        </Menu>
      </Flex>
      <Flex marginTop="10px" w="100%" alignItems={navSize == 'small' ? 'center' : 'flex-start'}>
        <div style={{ width: '10%' }}></div>
        <Menu>
          <Link
            as={NextLink}
            backgroundColor={router.pathname == '/admin/management/bus-schedule' && '#686868'}
            p={3}
            borderRadius={8}
            _hover={{ textDecor: 'none', backgroundColor: '#686868', color: '#fff' }}
            color={router.pathname == '/admin/management/bus-schedule' ? '#fff' : '#686868'}
            w={'90%'}
            href={href.busSchedule}
          >
            <MenuButton w="100%">
              <Text whiteSpace="nowrap" display={navSize == 'small' ? 'none' : 'flex'}>
                Quản lý lịch trình
              </Text>
            </MenuButton>
          </Link>
        </Menu>
      </Flex>
      <Flex marginTop="10px" w="100%" alignItems={navSize == 'small' ? 'center' : 'flex-start'}>
        <div style={{ width: '10%' }}></div>
        <Menu>
          <Link
            as={NextLink}
            backgroundColor={router.pathname == '/admin/management/bus' && '#686868'}
            p={3}
            borderRadius={8}
            _hover={{ textDecor: 'none', backgroundColor: '#686868', color: '#fff' }}
            color={router.pathname == '/admin/management/bus' ? '#fff' : '#686868'}
            w={'90%'}
            href={href.bus}
          >
            <MenuButton w="100%">
              <Text whiteSpace="nowrap" display={navSize == 'small' ? 'none' : 'flex'}>
                Quản lý xe
              </Text>
            </MenuButton>
          </Link>
        </Menu>
      </Flex>
      <Flex marginTop="10px" w="100%" alignItems={navSize == 'small' ? 'center' : 'flex-start'}>
        <div style={{ width: '10%' }}></div>
        <Menu>
          <Link
            as={NextLink}
            backgroundColor={router.pathname == '/admin/management/location' && '#686868'}
            p={3}
            borderRadius={8}
            _hover={{ textDecor: 'none', backgroundColor: '#686868', color: '#fff' }}
            color={router.pathname == '/admin/management/location' ? '#fff' : '#686868'}
            w={'90%'}
            href={href.location}
          >
            <MenuButton w="100%">
              <Text whiteSpace="nowrap" display={navSize == 'small' ? 'none' : 'flex'}>
                Quản lý điểm đón trả
              </Text>
            </MenuButton>
          </Link>
        </Menu>
      </Flex>
      <Flex marginTop="10px" w="100%" alignItems={navSize == 'small' ? 'center' : 'flex-start'}>
        <div style={{ width: '10%' }}></div>
        <Menu>
          <Link
            as={NextLink}
            backgroundColor={router.pathname == '/admin/management/office' && '#686868'}
            p={3}
            borderRadius={8}
            _hover={{ textDecor: 'none', backgroundColor: '#686868', color: '#fff' }}
            color={router.pathname == '/admin/management/office' ? '#fff' : '#686868'}
            w={'90%'}
            href={href.office}
          >
            <MenuButton w="100%">
              <Text whiteSpace="nowrap" display={navSize == 'small' ? 'none' : 'flex'}>
                Quản lý văn phòng
              </Text>
            </MenuButton>
          </Link>
        </Menu>
      </Flex>
      <Flex marginTop="10px" w="100%" alignItems={navSize == 'small' ? 'center' : 'flex-start'}>
        <div style={{ width: '10%' }}></div>
        <Menu>
          <Link
            as={NextLink}
            backgroundColor={router.pathname == '/admin/management/employee' && '#686868'}
            p={3}
            borderRadius={8}
            _hover={{ textDecor: 'none', backgroundColor: '#686868', color: '#fff' }}
            color={router.pathname == '/admin/management/employee' ? '#fff' : '#686868'}
            w={'90%'}
            href={href.employee}
          >
            <MenuButton w="100%">
              <Text whiteSpace="nowrap" display={navSize == 'small' ? 'none' : 'flex'}>
                Quản lý nhân sự
              </Text>
            </MenuButton>
          </Link>
        </Menu>
      </Flex>
    </Flex>
  );
  const sideElementForSetting = sideBarActive == 3 && (
    <Flex w={'100%'} flexDirection="column">
      <Flex marginTop="10px" w="100%" alignItems={navSize == 'small' ? 'center' : 'flex-start'}>
        <div style={{ width: '10%' }}></div>
        <Menu>
          <Link
            as={NextLink}
            backgroundColor={router.pathname == '/admin/setting/personal-information' && '#686868'}
            p={3}
            borderRadius={8}
            _hover={{ textDecor: 'none', backgroundColor: '#686868', color: '#fff' }}
            color={router.pathname == '/admin/setting/personal-information' ? '#fff' : '#686868'}
            w={'90%'}
            href={href.personalInformation}
          >
            <MenuButton w="100%">
              <Text whiteSpace="nowrap" display={navSize == 'small' ? 'none' : 'flex'}>
                Thông tin cá nhân
              </Text>
            </MenuButton>
          </Link>
        </Menu>
      </Flex>
      <Flex marginTop="10px" w="100%" alignItems={navSize == 'small' ? 'center' : 'flex-start'}>
        <div style={{ width: '10%' }}></div>
        <Menu>
          <Link
            as={NextLink}
            backgroundColor={router.pathname == '/admin/setting/change-password' && '#686868'}
            p={3}
            borderRadius={8}
            _hover={{ textDecor: 'none', backgroundColor: '#686868', color: '#fff' }}
            color={router.pathname == '/admin/setting/change-password' ? '#fff' : '#686868'}
            w={'90%'}
            href={href.changePassword}
          >
            <MenuButton w="100%">
              <Text whiteSpace="nowrap" display={navSize == 'small' ? 'none' : 'flex'}>
                Thay đổi mật khẩu
              </Text>
            </MenuButton>
          </Link>
        </Menu>
      </Flex>
    </Flex>
  );
  return (
    <>
      {sideElementForManagement}
      {sideElementForSetting}
    </>
  );
}
