import React from "react";
import { Flex, Text, Icon, Link, Menu, MenuButton, MenuList } from "@chakra-ui/react";

export default function NavItem({
	icon,
	title,
	handleSetAvtiveSideBar,
	active,
	navSize,
	suffixIcon,
	value,
}) {
	return (
		<Flex
			marginTop="10px"
			flexDir="column"
			w="100%"
			alignItems={navSize == "small" ? "center" : "flex-start"}
			onClick={() => handleSetAvtiveSideBar(value)}
		>
			<Menu placement="right">
				<Link
					backgroundColor={active && "#363636"}
					p={3}
					borderRadius={8}
					_hover={{ textDecor: "none", backgroundColor: "#363636", color: "#fff" }}
					color={active ? "#fff" : "#686868"}
					w={navSize == "large" && "100%"}
				>
					<MenuButton w="100%">
						<Flex justifyContent="space-between">
							<Flex>
								<Icon
									as={icon}
									fontSize="xl"
								/>
								<Text
									ml={5}
									whiteSpace="nowrap"
									display={navSize == "small" ? "none" : "flex"}
								>
									{title}
								</Text>
							</Flex>
							{suffixIcon && (
								<Icon
									as={suffixIcon}
									fontSize="xl"
								/>
							)}
						</Flex>
					</MenuButton>
				</Link>
			</Menu>
		</Flex>
	);
}
