import { formatDate } from "@/helper";
import { convertTime, validate } from "@/helper";
import {
	Text,
	Heading,
	InputGroup,
	Card,
	CardBody,
	Flex,
	Stack,
	Box,
	Image,
	Button,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useState, useCallback } from "react";
import { GoLocation } from "react-icons/go";
import { MdOutlineSwapHorizontalCircle } from "react-icons/md";
import { Seat12User } from "@/components/vehicle";

export default function Ticket(props) {
	const [startLocation, setStartLocation] = useState(47);
	const [listBusSchedule, setListBusSchedule] = useState([]);
	const [endLocation, setEndLocation] = useState(32);
	const [departureDay, setDepartureDay] = useState();
	const [scheduleSelected, setScheduleSelected] = useState();
	const [scheduleData, setScheduleData] = useState();
	const [seatSelected, setSeatSelected] = useState([]);
	const [transportData, setTransportData] = useState();
	const [editButtonStatus, setEditButtonStatus] = useState(false);
	const [deleteButtonStatus, setDeleteButtonStatus] = useState(false);
	const [seatCustomerSelected, setSeatCustomerSelected] = useState([]);
	const [error, setError] = useState({
		from: false,
		to: false,
		date: false,
	});
	const handleChangeStartLocation = (e) => {
		let value = e.target.value;
		let oldError = { ...error };
		if (!value) {
			oldError.from = true;
		} else {
			oldError.from = false;
		}
		setError(oldError);
		setStartLocation(value);
	};

	const handleChangeEndLocation = (e) => {
		let value = e.target.value;
		let oldError = { ...error };
		if (!value) {
			oldError.to = true;
		} else {
			oldError.to = false;
		}
		setError(oldError);
		setEndLocation(value);
	};

	const handleChangeDepartureDay = (e) => {
		let value = e.target.value;
		let oldError = { ...error };
		if (!value) {
			oldError.date = true;
		} else {
			oldError.date = false;
		}
		setError(oldError);
		setDepartureDay(value);
	};

	const handleSwapLocation = useCallback(() => {
		setEndLocation(startLocation);
		setStartLocation(endLocation);
	}, [startLocation, endLocation]);

	const handleSCheduleSelected = useCallback((id, schedule, transport) => {
		setScheduleSelected(id);
		setScheduleData(schedule);
		setTransportData(transport);
		setSeatCustomerSelected(
			transport.number_seat_selected
				.map((e) => e.seat)
				.join()
				.split(",")
				.map((e) => e.trim()),
		);
	});

	const handleSeatSelected = useCallback(
		(id) => {
			let cloneSeatSelected = [...seatSelected];
			if (!cloneSeatSelected.includes(id)) {
				cloneSeatSelected.push(id);
			} else {
				cloneSeatSelected.splice(cloneSeatSelected.indexOf(id), 1);
			}
			setSeatSelected(cloneSeatSelected);
			let editStatus = true;
			let deleteStatus = true;
			if (!cloneSeatSelected.length) {
				editStatus = false;
				deleteStatus = false;
			}
			if (cloneSeatSelected.length > 1) {
				editStatus = false;
			}
			cloneSeatSelected.forEach((seat) => {
				if (!seatCustomerSelected.includes(seat)) {
					editStatus = false;
					deleteStatus = false;
				}
			});
			setEditButtonStatus(editStatus);
			setDeleteButtonStatus(deleteStatus);
		},
		[seatSelected, seatCustomerSelected],
	);

	const searchBusSchedule = useCallback(async () => {
		let oldError = { ...error };
		if (!startLocation) {
			oldError.from = true;
		}
		if (!endLocation) {
			oldError.to = true;
		}
		if (!departureDay) {
			oldError.date = true;
		}
		if (oldError.from || oldError.to || oldError.date) {
			setError(oldError);
			return;
		}
		const submitData = {
			departure_location_id: startLocation,
			arrive_location_id: endLocation,
			refresh_date: departureDay,
		};
		const listBusSchedule = await axios.post(
			`http://localhost:${props.port}/bus-schedule/list-bus-schedule-all`,
			submitData,
		);
		if (listBusSchedule.data.statusCode == 200) {
			setListBusSchedule(listBusSchedule.data.data.list_bus_schedule);
		}
	}, [startLocation, endLocation, departureDay, error]);

	const cityOption =
		props.list_city &&
		props.list_city.map((city) => <option value={city.id}>{city.city_name}</option>);

	const ListBusScheduleHTML = listBusSchedule.map((schedule, position) => {
		return (
			<>
				{schedule && schedule.transport && schedule.transport.length
					? schedule.transport.map((vehicle, index) => {
							const number_seat_selected =
								vehicle.number_seat_selected && vehicle.number_seat_selected.length
									? vehicle.number_seat_selected
											.map((e) => e.seat)
											.join()
											.split(",").length
									: 0;
							const number_seat_unselected =
								vehicle.bus[0].number_seat - number_seat_selected;
							return (
								<Box
									border={"1px solid"}
									borderRadius={"10px"}
									padding={"0 1%"}
									marginRight={"1%"}
									minW={"80px"}
									fontSize={"13px"}
									fontWeight={"600"}
									color={"#363636"}
									cursor={"pointer"}
									backgroundColor={
										position + "" + index == scheduleSelected ? "#F2CAC2" : "#fff"
									}
									_hover={{ backgroundColor: "#F2CAC2" }}
									maxH="60px"
									onClick={() =>
										handleSCheduleSelected(position + "" + index, schedule, vehicle)
									}
								>
									<Stack>
										<Text>{convertTime(schedule.time_from, 0)}</Text>
										<Flex>
											<Text marginRight={"5px"}>-----</Text>
											<Text>
												{number_seat_selected + "/" + vehicle.bus[0].number_seat}
											</Text>
										</Flex>
									</Stack>
								</Box>
							);
					  })
					: null}
			</>
		);
	});

	const ScheduleDataHTML = scheduleData && transportData && (
		<Card
			border={"1px solid"}
			width={"100%"}
			margin={"0 auto"}
			marginTop={"2%"}
		>
			<CardBody>
				<Flex
					justifyContent={"space-between"}
					fontSize={"13px"}
				>
					<Stack>
						<Flex>
							<Text
								fontWeight="600"
								color={"#363636"}
							>
								Biển số:&ensp;
							</Text>
							<Text
								fontWeight="600"
								color={"#363636"}
							>
								{transportData?.bus[0].vehicle_plate}
							</Text>
						</Flex>
						<Flex>
							<Text
								fontWeight="600"
								color={"#363636"}
							>
								Loại xe:&ensp;
							</Text>
							<Text
								fontWeight="600"
								color={"#363636"}
							>
								{transportData?.bus[0].vehicle_type_name}
							</Text>
						</Flex>
					</Stack>
					<Stack>
						<Flex>
							<Text
								fontWeight="600"
								color={"#363636"}
							>
								Tài xế:&ensp;
							</Text>
							<Text
								fontWeight="600"
								color={"#363636"}
							>
								{transportData?.bus[0]?.main_driver}
							</Text>
						</Flex>
						<Flex>
							<Text
								fontWeight="600"
								color={"#363636"}
							>
								Phụ xe:&ensp;
							</Text>
							<Text
								fontWeight="600"
								color={"#363636"}
							>
								{transportData?.bus[0]?.support_driver}
							</Text>
						</Flex>
					</Stack>
					<Stack>
						<Flex>
							<Text
								fontWeight="600"
								color={"#363636"}
							>
								Số vé đã đặt:&ensp;
							</Text>
							<Text
								fontWeight="600"
								color={"#363636"}
							>
								{transportData.number_seat_selected &&
								transportData.number_seat_selected.length
									? transportData.number_seat_selected
											.map((e) => e.seat)
											.join()
											.split(",").length
									: 0}
							</Text>
						</Flex>
						<Flex>
							<Text
								fontWeight="600"
								color={"#363636"}
							>
								Số vé đã thanh toán:&ensp;
							</Text>
							<Text
								fontWeight="600"
								color={"#363636"}
							>
								{transportData?.number_seat_sold}
							</Text>
						</Flex>
					</Stack>
				</Flex>
				<Text
					marginTop="1%"
					fontWeight={"600"}
				>
					Chi tiết: Chuyến {convertTime(scheduleData.time_from, 0) + " "}; Ngày:{" "}
					{new Date(formatDate(transportData?.departure_date)).toLocaleDateString()} ; Tuyến:{" "}
					{scheduleData?.city_from + " - " + scheduleData?.city_to}
				</Text>
			</CardBody>
		</Card>
	);
	const ButtonGroupHTML = scheduleData && transportData && (
		<Flex
			marginTop="1%"
			justifyContent={"space-between"}
		>
			<Flex>
				{editButtonStatus && (
					<Button
						leftIcon={<EditIcon />}
						backgroundColor={"#fff"}
						border="1px solid"
						borderRadius={"5px"}
						marginRight={"15px"}
					>
						Sửa
					</Button>
				)}
				{deleteButtonStatus && (
					<Button
						leftIcon={<DeleteIcon />}
						backgroundColor={"#fff"}
						border="1px solid"
						borderRadius={"5px"}
					>
						Xóa
					</Button>
				)}
			</Flex>
			<Flex>
				<Button
					backgroundColor={"#fff"}
					border="1px solid"
					borderRadius={"5px"}
					marginRight={"15px"}
				>
					Xuất phơi
				</Button>
				<Button
					backgroundColor={"#fff"}
					border="1px solid"
					borderRadius={"5px"}
					marginRight={"15px"}
				>
					DS đón trả
				</Button>
				<Button
					backgroundColor={"#fff"}
					border="1px solid"
					borderRadius={"5px"}
					marginRight={"15px"}
				>
					T/chuyển
				</Button>
				<Button
					backgroundColor={"#fff"}
					border="1px solid"
					borderRadius={"5px"}
				>
					Xuất bến
				</Button>
			</Flex>
		</Flex>
	);
	const VehicleHTML = scheduleData && transportData && (
		<Seat12User
			data={transportData}
			setData={setTransportData}
			port={props.port}
			scheduleData={scheduleData}
			seatSelected={seatSelected}
			handleSeatSelected={handleSeatSelected}
			seatCustomerSelected={seatCustomerSelected}
			setSeatCustomerSelected={setSeatCustomerSelected}
		/>
	);
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
				<Text marginRight="1%">Dan Abramov</Text>
				<Image
					borderRadius="full"
					boxSize="50px"
					src="https://bit.ly/dan-abramov"
					alt="Dan Abramov"
				/>
			</Flex>
			<Box
				width="90%"
				margin="0 auto"
			>
				<Heading>Đặt vé</Heading>
				<Flex
					alignItems={"center"}
					justifyContent={"space-between"}
					w="95%"
					marginTop={"2%"}
					marginBottom={"1%"}
				>
					<Flex className={"bom-schedule-book-ticket admin"}>
						<Flex className="bom-element admin">
							<GoLocation />
							<select
								value={startLocation}
								onChange={handleChangeStartLocation}
								placeholder="Chọn điểm xuất phát"
							>
								{cityOption}
							</select>
						</Flex>

						<MdOutlineSwapHorizontalCircle
							className="bom-element admin"
							onClick={handleSwapLocation}
							cursor={"pointer"}
						/>
						<Flex className="bom-element admin">
							<GoLocation />
							<select
								value={endLocation}
								onChange={handleChangeEndLocation}
							>
								{cityOption}
							</select>
						</Flex>
						<span className="bom-element admin">|</span>
						<InputGroup className="bom-element admin">
							<input
								type="date"
								placeholder="Phone number"
								onChange={handleChangeDepartureDay}
								value={departureDay}
								min={validate.min_date}
							/>
						</InputGroup>
					</Flex>
					<Button
						backgroundColor={"#fff"}
						color={"#000"}
						border={"1px solid"}
						padding={"10px 20px"}
						className="bom-element admin"
						onClick={searchBusSchedule}
					>
						Tìm kiếm
					</Button>
				</Flex>
				<Flex
					maxW={"100%"}
					overflowX={"auto"}
				>
					{ListBusScheduleHTML}
				</Flex>
				{ScheduleDataHTML}
				{ButtonGroupHTML}
				{VehicleHTML}
			</Box>
		</div>
	);
}
export async function getStaticProps() {
	const getListCity = await axios.get(
		`http://localhost:${process.env.BACK_END_PORT}/city/list-city`,
	);
	return {
		props: {
			port: process.env.BACK_END_PORT,
			list_city: getListCity.data.data?.listCity,
		},
	};
}
