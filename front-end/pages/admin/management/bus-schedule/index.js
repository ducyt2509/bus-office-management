import { Text, Heading, Card, CardHeader, CardBody, Flex, Image } from "@chakra-ui/react";
import axios from "axios";
import ActionBar from "@/components/bus-schedule/ActionBar";
import ListBusSchedule from "@/components/bus-schedule/ListBusSchedule";
import Pagination from "@/components/common/Pagination";
import { useStore } from "@/src/store";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

export default function ManagementBusSchedule(props) {
	const router = useRouter();
	const [state, dispath] = useStore();

	const [listBusSchedule, setListBusSchedule] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [querySearch, setQuerySearch] = useState("");
	const [numberBusSchedule, setNumberBusSchedule] = useState("");

	const handleGetListBusSchedule = useCallback(
		async (type, page, limit, value) => {
			page = typeof page == "number" ? page : 1;
			limit = limit ? limit : 7;
			if (typeof page == "number") {
				setCurrentPage(page);
			}
			const token = `Bearer ${state.dataUser.token}`;
			const offset = limit * (page - 1);
			const getListBusSchedule = await axios.post(
				`http://localhost:${props.BACK_END_PORT}/bus-schedule/list-bus-schedule`,
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
			if (getListBusSchedule.data.statusCode === 200) {
				setListBusSchedule(getListBusSchedule.data.data.list_bus_schedule);
				setNumberBusSchedule(getListBusSchedule.data.data.number_bus_schedule);
				if (type == "search") {
					setCurrentPage(1);
				}
			}
		},
		[state, querySearch],
	);
	const handleChangeQuerySearch = useCallback((e) => {
		const value = e.target.value;
		setQuerySearch(value);
		if (!value) {
			handleGetListBusSchedule("search", null, null, "");
		}
	});
	const handleGetBusScheduleInformation = useCallback((id) => {
		router.push({
			pathname: "/admin/management/bus-schedule/[id]",
			query: { id: id, method: "Refresh" },
		});
	});
	useEffect(() => {
		handleGetListBusSchedule();
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
				<Text marginRight="1%">Nguyễn Văn A</Text>
				<Image
					borderRadius="full"
					boxSize="50px"
					src="https://bit.ly/dan-abramov"
					alt="Nguyễn Văn A"
				/>
			</Flex>
			<div style={{ width: "90%", margin: "0 auto" }}>
				<Card backgroundColor={"#F5F5F5"}>
					<CardHeader>
						<Heading size="lg">Quản lí lịch trình</Heading>
					</CardHeader>
					<CardBody>
						<ActionBar
							querySearch={querySearch}
							setQuerySearch={setQuerySearch}
							handleGetListBusSchedule={handleGetListBusSchedule}
							handleChangeQuerySearch={handleChangeQuerySearch}
							handleGetBusScheduleInformation={handleGetBusScheduleInformation}
						/>
						<ListBusSchedule
							list={listBusSchedule}
							handleGetListBusSchedule={handleGetListBusSchedule}
							port={props.BACK_END_PORT}
							handleGetBusScheduleInformation={handleGetBusScheduleInformation}
						/>
						<Pagination
							list_number={numberBusSchedule}
							handleGetList={handleGetListBusSchedule}
							setList={setListBusSchedule}
							list={listBusSchedule}
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
