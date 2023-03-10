import React, { useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { IoTicketOutline, IoBarChartOutline } from 'react-icons/io5';
import { AiOutlineInbox } from 'react-icons/ai';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import NavItem from './NavItem';
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
  };
  const [navSize, changeNavSize] = useState('large');
  const [sideBarActive, setActiveSideBar] = useState(0);
  const handleSetAvtiveSideBar = (value) => {
    setActiveSideBar(value);
  };
  return (
    <Flex
      pos="fixed"
      h="800px"
      boxShadow="0 4px 12px 0 #888"
      w={navSize == 'small' ? '75px' : '20%'}
      flexDir="column"
      justifyContent="flex-start"
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
        <NavItem
          navSize={navSize}
          icon={IoTicketOutline}
          title="Đặt Vé"
          handleSetAvtiveSideBar={handleSetAvtiveSideBar}
          active={sideBarActive == 0 ? true : false}
          value={0}
          href={path.ticket}
          component={Ticket}
        />
        <NavItem
          navSize={navSize}
          icon={IoBarChartOutline}
          title="Báo Cáo Kinh Doanh"
          handleSetAvtiveSideBar={handleSetAvtiveSideBar}
          active={sideBarActive == 1 ? true : false}
          value={1}
          href={path.revenueReport}
          component={RevenueReport}
        />
        <NavItem
          navSize={navSize}
          icon={AiOutlineInbox}
          suffixIcon={sideBarActive == 2 ? IoIosArrowDown : IoIosArrowUp}
          handleSetAvtiveSideBar={handleSetAvtiveSideBar}
          title="Quản Lí"
          active={sideBarActive == 2 ? true : false}
          value={2}
          href={path}
        />
      </Flex>
    </Flex>
  );
}
