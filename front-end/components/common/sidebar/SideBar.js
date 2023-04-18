import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Stack, Text } from '@chakra-ui/react';
import { CiLogout } from 'react-icons/ci';
import { IoTicketOutline, IoBarChartOutline } from 'react-icons/io5';
import { AiOutlineInbox, AiOutlineSetting } from 'react-icons/ai';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import SideItem from './SideItem';
import RevenueReport from '@/pages/admin/revenue-report';
import Ticket from '@/pages/admin/ticket';
import axios from 'axios';
import { useStore } from '@/src/store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Sidebar() {
  const router = useRouter();
  const path = {
    busSchedule: '/admin/management/bus-schedule',
    bus: '/admin/management/bus',
    employee: '/admin/management/employee',
    location: '/admin/management/location',
    office: '/admin/management/office',
    route: '/admin/management/route',
    revenueReport: '/admin/revenue-report',
    ticket: '/admin/ticket',
    personalInformation: '/admin/setting/personal-information',
    changePassword: '/admin/setting/change-password',
    transport: '/admin/management/transport',
  };
  const [state, dispatch, axiosJWT] = useStore();
  const [navSize, changeNavSize] = useState('large');
  const [sideBarActive, setActiveSideBar] = useState(0);
  const handleSetActiveSideBar = useCallback(
    async (value) => {
      if (value == 99) {
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
        return;
      }

      if (sideBarActive == value && (value == 2 || value == 3)) value = 4;
      setActiveSideBar(value);
      Cookies.set('sideBarActive', value);
    },
    [sideBarActive, state]
  );
  useEffect(() => {
    const value = Cookies.get('sideBarActive');
    setActiveSideBar(value);
  }, []);
  return (
    <Flex
      pos="fixed"
      h="100vh"
      boxShadow="0 4px 12px 0 #888"
      w={navSize == 'small' ? '75px' : '17%'}
      flexDir="column"
      justifyContent="flex-start"
      id="bom-side-bar"
    >
      <Stack>
        <Text fontSize={'2.2rem'} p="15% 10% 5%" fontFamily={'Gugi'}>
          BOM
        </Text>
        <Flex
          p="5% 10%"
          flexDir="column"
          w="100%"
          alignItems={navSize == 'small' ? 'center' : 'flex-start'}
          as="nav"
        >
          <SideItem
            navSize={navSize}
            icon={IoTicketOutline}
            title="Đặt Vé"
            handleSetActiveSideBar={handleSetActiveSideBar}
            active={sideBarActive == 0 ? true : false}
            value={0}
            href={path.ticket}
            component={Ticket}
          />
          <SideItem
            navSize={navSize}
            icon={IoBarChartOutline}
            title="Báo Cáo Kinh Doanh"
            handleSetActiveSideBar={handleSetActiveSideBar}
            active={sideBarActive == 1 ? true : false}
            value={1}
            href={path.revenueReport}
            component={RevenueReport}
          />
          <SideItem
            navSize={navSize}
            icon={AiOutlineInbox}
            suffixIcon={sideBarActive == 2 ? IoIosArrowDown : IoIosArrowUp}
            handleSetActiveSideBar={handleSetActiveSideBar}
            title="Quản Lí"
            active={sideBarActive == 2 ? true : false}
            value={2}
            sideBarActive={sideBarActive}
            href={path}
          />
          <SideItem
            navSize={navSize}
            icon={AiOutlineSetting}
            suffixIcon={sideBarActive == 3 ? IoIosArrowDown : IoIosArrowUp}
            handleSetActiveSideBar={handleSetActiveSideBar}
            title="Cài đặt"
            active={sideBarActive == 3 ? true : false}
            value={3}
            sideBarActive={sideBarActive}
            href={path}
          />
        </Flex>
      </Stack>

      <Flex padding="5% 10%">
        <SideItem
          navSize={navSize}
          icon={CiLogout}
          handleSetActiveSideBar={handleSetActiveSideBar}
          title="Đăng xuất"
          value={99}
          sideBarActive={sideBarActive}
          href={path}
        />
      </Flex>
    </Flex>
  );
}
