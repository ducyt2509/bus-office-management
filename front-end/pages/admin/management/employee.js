import {
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Text,
	Heading,
	Card,
	CardHeader,
	CardBody,
	Flex,
	Image,
	useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ActionBar from "@/components/employee/ActionBar";
import AddEmployee from "@/components/employee/AddEmployee";
import ListEmployee from "@/components/employee/ListEmployee";
import Pagination from "@/components/common/Pagination";
import { useStore } from "@/src/store";

export default function ManagementEmployees(props) {
	const [state, dispath] = useStore();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [listUser, setListUser] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [dynamicListBus, setDynamicListUser] = useState([]);
	const [querySearch, setQuerySearch] = useState("");
	const [numberUser, setNumberUser] = useState("");
	const [userId, setUserId] = useState();
	const [user, setUser] = useState({});

	const handleGetListUser = useCallback(
		async (page, limit) => {
			page = page ? page - 1 : 0;
			if (page) {
				setCurrentPage(page);
			}
			const token = `Bearer ${state.dataUser.token}`;
			limit = limit ? limit : 7;
			const offset = limit * page;
			const getListUser = await axios.post(
				`http://localhost:${props.BACK_END_PORT}/user/list-user`,
				{
					offset: offset,
					limit: limit,
				},
				{
					headers: {
						token: token,
					},
				},
			);
			if (getListUser.data.statusCode === 200) {
				setListUser(getListUser.data.data.list_user);
				setDynamicListUser(getListUser.data.data.list_user);
				setCurrentPage(1);
				setNumberUser(getListUser.data.data.number_user);
			}
		},
		[state, currentPage],
	);
	useEffect(() => {
		handleGetListUser();
	}, []);
	return (
		<div style={{ position: "relative", left: "20%", width: "80%" }}>
			<Flex
				alignItems={"center"}
				justifyContent="flex-end"
				width={"84%"}
				margin="0 auto"
				marginBottom={"2%"}
				paddingTop="2%"
			>
				<Text marginRight="1%">{state.dataUser.user_name}</Text>
				<Image
					borderRadius="full"
					boxSize="50px"
					src={state.dataUser.avatar ? state.dataUser.avatar : "https://bit.ly/dan-abramov"}
					alt="Dan Abramov"
				/>
			</Flex>
			<div style={{ width: "90%", margin: "0 auto" }}>
				<Card backgroundColor={"#F5F5F5"}>
					<CardHeader>
						<Heading size="lg">Quản lí nhân viên</Heading>
					</CardHeader>
					<CardBody>
						<ActionBar
							onOpen={onOpen}
							setUserId={setUserId}
						/>
						<ListEmployee
							list={listUser}
							onOpen={onOpen}
							setUserId={setUserId}
							setUser={setUser}
							handleGetListUser={handleGetListUser}
							port={props.BACK_END_PORT}
						/>
						<Pagination
							list_number={numberUser}
							handleGetList={handleGetListUser}
							setList={setListUser}
							list={listUser}
							currentPage={currentPage}
						/>
						<AddEmployee
							isOpen={isOpen}
							onClose={onClose}
							port={props.BACK_END_PORT}
							token={`Bearer ${state.dataUser.token}`}
							handleGetListUser={handleGetListUser}
							userId={userId}
							user={user}
						/>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
export async function getStaticProps() {
	return {
		props: {
			BACK_END_PORT: process.env.BACK_END_PORT,
		},
	};
}
