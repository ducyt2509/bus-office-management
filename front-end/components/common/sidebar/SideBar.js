import React, { useState } from "react";
import { Flex, Text, IconButton, Divider, Avatar, Heading } from "@chakra-ui/react";
import { FiHome, FiCalendar, F } from "react-icons/fi";
// import {IoTicketOutline} from "react-icons/"
import { IoTicketOutline, IoBarChartOutline } from "react-icons/io5";
import { AiOutlineInbox } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import NavItem from "./NavItem";

export default function Sidebar() {
	const [navSize, changeNavSize] = useState("large");
	const [sideBarActive, setActiveSideBar] = useState(0);
	const handleSetAvtiveSideBar = (value) => {
		setActiveSideBar(value);
	};
	return (
		<Flex
			pos="sticky"
			h="800px"
			boxShadow="0 4px 12px 0 #888"
			w={navSize == "small" ? "75px" : "20%"}
			flexDir="column"
			justifyContent="flex-start"
		>
			<Text
				fontSize={"2.2rem"}
				p="15% 10% 5%"
				fontFamily={"Gugi"}
			>
				BOM
			</Text>
			<Flex
				p="5% 10%"
				flexDir="column"
				w="100%"
				alignItems={navSize == "small" ? "center" : "flex-start"}
				as="nav"
			>
				<NavItem
					navSize={navSize}
					icon={IoTicketOutline}
					title="Đặt Vé"
					handleSetAvtiveSideBar={handleSetAvtiveSideBar}
					active={sideBarActive == 0 ? true : false}
					value={0}
				/>
				<NavItem
					navSize={navSize}
					icon={IoBarChartOutline}
					title="Báo Cáo Kinh Doanh"
					handleSetAvtiveSideBar={handleSetAvtiveSideBar}
					active={sideBarActive == 1 ? true : false}
					value={1}
				/>
				<NavItem
					navSize={navSize}
					icon={AiOutlineInbox}
					suffixIcon={sideBarActive == 2 ? IoIosArrowDown : IoIosArrowUp}
					handleSetAvtiveSideBar={handleSetAvtiveSideBar}
					title="Quản Lí"
					active={sideBarActive == 2 ? true : false}
					value={2}
				/>
			</Flex>
		</Flex>
	);
}
