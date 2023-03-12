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
	useDisclosure,
	Image,
} from "@chakra-ui/react";
import axios from "axios";
import { useStore } from "@/src/store";
import { useCallback, useEffect, useState } from "react";
import ListBus from "@/components/bus/ListBus";
import ActionBar from "@/components/bus/ActionBar";
import Pagination from "@/components/common/Pagination";
import AddBus from "@/components/bus/AddBus";

export default function ManagementBus(props) {
	const [state, dispath] = useStore();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [listBus, setListBus] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [dynamicListBus, setDynamicListBus] = useState([]);
	const [querySearch, setQuerySearch] = useState("");
	const [numberBus, setNumberBus] = useState("");
	const [vehicleId, setVehicleId] = useState();
	const [vehicle, setVehicle] = useState({});

	const handleGetListBus = useCallback(
		async (offset, limit) => {
			const token = `Bearer ${state.dataUser.token}`;
			offset = offset ? offset : 0;
			limit = limit ? limit : 7;
			const getListBus = await axios.post(
				`http://localhost:${props.BACK_END_PORT}/bus/list-bus`,
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
			if (getListBus.data.statusCode === 200) {
				setListBus(getListBus.data.data.list_bus);
				setDynamicListBus(getListBus.data.data.list_bus);
				setCurrentPage(1);
				setNumberBus(getListBus.data.data.number_bus);
			}
		},
		[state],
	);
	useEffect(() => {
		handleGetListBus();
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
						<Heading size="lg">Quản lí xe</Heading>
					</CardHeader>
					<CardBody>
						<Tabs>
							<TabList>
								<Tab>Xe khách</Tab>
								<Tab>Xe trung chuyển</Tab>
							</TabList>
							<TabPanels>
								<TabPanel>
									<ActionBar
										onOpen={onOpen}
										setVehicleId={setVehicleId}
									/>
									<ListBus
										list={listBus}
										onOpen={onOpen}
										setVehicleId={setVehicleId}
										setVehicle={setVehicle}
										handleGetListBus={handleGetListBus}
										port={props.BACK_END_PORT}
									/>
									<Pagination
										list_number={numberBus}
										handleGetList={handleGetListBus}
										setList={setListBus}
										list={listBus}
										currentPage={currentPage}
									/>
									<AddBus
										isOpen={isOpen}
										onClose={onClose}
										port={props.BACK_END_PORT}
										token={`Bearer ${state.dataUser.token}`}
										handleGetListBus={handleGetListBus}
										vehicleId={vehicleId}
										vehicle={vehicle}
									/>
								</TabPanel>
								<TabPanel></TabPanel>
							</TabPanels>
						</Tabs>
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
