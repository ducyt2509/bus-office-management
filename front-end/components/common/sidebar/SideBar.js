import React, { useCallback, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { IoTicketOutline, IoBarChartOutline } from 'react-icons/io5';
import { AiOutlineInbox, AiOutlineSetting } from 'react-icons/ai';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import SideItem from './SideItem';
import RevenueReport from '@/pages/admin/revenue-report';
import Ticket from '@/pages/admin/ticket';

export default function Sidebar() {
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
  const [navSize, changeNavSize] = useState('large');
  const [sideBarActive, setActiveSideBar] = useState(0);
  const handleSetActiveSideBar = useCallback(
    (value) => {
      if (sideBarActive == value && (value == 2 || value == 3)) value = 4;
      setActiveSideBar(value);
    },
    [sideBarActive]
  );
  return (
    <Flex
      pos="fixed"
      h="100vh"
      boxShadow="0 4px 12px 0 #888"
      w={navSize == 'small' ? '75px' : '17%'}
      flexDir="column"
      justifyContent="flex-start"
      id='bom-side-bar'
    >
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
    </Flex>
  );
}
