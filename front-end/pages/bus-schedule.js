import axios from "axios";
import { Flex, Text, Button } from "@chakra-ui/react";
import { GoLocation } from "react-icons/go";
import { BsCalendar } from "react-icons/bs";
import { MdOutlineSwapHorizontalCircle } from "react-icons/md";
import ListBusSchedule from "@/components/bus-schedule/bus-schedule-ticket";
export default function BusScheduleAll(props) {
	const listBusScheduleHTML =
		props.list_bus_schedule &&
		props.list_bus_schedule.map((busSchedule) => {
			return <ListBusSchedule data={busSchedule} />;
		});
	return (
		<>
			<Flex className={"bom-schedule-book-ticket"}>
				<Text className="bom-element">
					<GoLocation />
					&emsp;&ensp;Hà Nội
				</Text>
				<MdOutlineSwapHorizontalCircle className="bom-element" />
				<Text className="bom-element">
					<GoLocation />
					&emsp;&ensp;Hà Tĩnh
				</Text>
				<span className="bom-element">|</span>
				<Text className="bom-element">
					<BsCalendar />
					&emsp;18-03-2023
				</Text>
				<Button
					backgroundColor={"#F26A4C"}
					color={"#fff"}
					padding={"10px 0"}
					className="bom-element"
				>
					Tìm kiếm
				</Button>
			</Flex>
			{listBusScheduleHTML}
		</>
	);
}
export async function getServerSideProps(context) {
	const data = context.query;
	data.offset = 0;
	data.limit = 5;
	const port = process.env.BACK_END_PORT;
	let list_bus_schedule = [];
	const listBusSchedule = await axios.post(
		`http://localhost:${port}/bus-schedule/list-bus-schedule-all`,
		data,
	);
	if (listBusSchedule.data.statusCode == 200) {
		list_bus_schedule = [...listBusSchedule.data.data.list_bus_schedule];
	}
	return {
		props: {
			port,
			list_bus_schedule,
			data,
		}, // will be passed to the page component as props
	};
}
