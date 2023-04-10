import {
	Text,
	Heading,
	Card,
	CardHeader,
	CardBody,
	Flex,
	Image,
	useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useStore } from "@/src/store";
import axios from "axios";
import ActionBar from "@/components/location/ActionBar";
import AddLocation from "@/components/location/AddLocation";
import ListLocation from "@/components/location/ListLocation";
import Pagination from "@/components/common/Pagination";

export default function ManagementOffice(props) {
	const [state, dispath] = useStore();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [listLocation, setListLocation] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [querySearch, setQuerySearch] = useState("");
	const [numberLocation, setNumberLocation] = useState("");
	const [locationId, setLocationId] = useState();
	const [location, setLocation] = useState({});

	const handleGetListLocation = useCallback(
		async (type, page, limit, value) => {
			limit = limit ? limit : 7;
			page = typeof page == "number" ? page : 1;
			const offset = limit * (page - 1);
			if (typeof page == "number") {
				setCurrentPage(page);
			}
			const token = `Bearer ${state.dataUser.token}`;
			const getListLocation = await axios.post(
				`http://localhost:${props.BACK_END_PORT}/location/list-location`,
				{
					offset: offset,
					limit: limit,
					query_search: value != undefined ? value : querySearch,
				},
				{
					headers: {
						token: token,
					},
				},
			);
			if (getListLocation.data.statusCode === 200) {
				setListLocation(getListLocation.data.data.listLocation);
				if (type == "search") {
					setCurrentPage(1);
				}
				setNumberLocation(getListLocation.data.data.numberLocation);
			}
		},
		[state, querySearch],
	);
	const handleChangeQuerySearch = useCallback((e) => {
		const value = e.target.value;
		setQuerySearch(value);
		if (!value) {
			handleGetListLocation("search", null, null, "");
		}
	});
	useEffect(() => {
		handleGetListLocation();
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
					alt="Nguyễn Văn A"
				/>
			</Flex>
			<div style={{ width: "90%", margin: "0 auto" }}>
				<Card backgroundColor={"#F5F5F5"}>
					<CardHeader>
						<Heading size="lg">Quản lí điểm đón trả</Heading>
					</CardHeader>
					<CardBody>
						<ActionBar
							onOpen={onOpen}
							setLocationId={setLocationId}
							querySearch={querySearch}
							setQuerySearch={setQuerySearch}
							handleGetListLocation={handleGetListLocation}
							handleChangeQuerySearch={handleChangeQuerySearch}
						/>
						<ListLocation
							list={listLocation}
							onOpen={onOpen}
							setLocationId={setLocationId}
							setLocation={setLocation}
							handleGetListLocation={handleGetListLocation}
							port={props.BACK_END_PORT}
						/>
						<Pagination
							list_number={numberLocation}
							handleGetList={handleGetListLocation}
							setList={setListLocation}
							list={listLocation}
							setCurrentPage={setCurrentPage}
							currentPage={currentPage}
						/>
						<AddLocation
							isOpen={isOpen}
							onClose={onClose}
							port={props.BACK_END_PORT}
							token={`Bearer ${state.dataUser.token}`}
							handleGetListLocation={handleGetListLocation}
							locationId={locationId}
							location={location}
							currentPage={currentPage}
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
