import { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import {
	Text,
	Card,
	CardBody,
	Flex,
	Box,
	useDisclosure,
} from "@chakra-ui/react";
import TransactionDetails from "@/components/ticket/transaction-detail";

export default function Seat12User(props) {
	const seatVehicle = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"];
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [seatInformation, setSeatInformation] = useState();

	const handleOpenSeatInformation = async (data) => {
		onOpen();
		setSeatInformation(data);
	};

	const ModalHTML = (
		<TransactionDetails
			data={props.data}
			setData={props.setData}
			port={props.port}
			scheduleData={props.scheduleData}
			seatSelected={props.seatSelected}
			handleSeatSelected={props.handleSeatSelected}
			seatCustomerSelected={props.seatCustomerSelected}
			seatVehicle={seatVehicle}
			setSeatCustomerSelected={props.setSeatCustomerSelected}
			isOpen={isOpen}
			onOpen={onOpen}
			onClose={onClose}
			seatInformation={seatInformation}
		/>
	);

	const seatHTML = (id) => {
		let position;
		props.data.number_seat_selected
			.map((e) => e.seat)
			.forEach((element, index) => {
				if (element.includes(id)) {
					position = index;
				}
			});
		let pickup =
			props.data.number_seat_selected[position]?.tranship_address &&
			props.data.number_seat_selected[position]?.tranship_address.split("!@#$%^&*")[0]
				? "Trung chuyển"
				: props.data.number_seat_selected[position]?.pickup_location &&
				  props.data.number_seat_selected[position]?.pickup_location.includes(
						props.scheduleData.departure_location,
				  )
				? "Tại bến"
				: "Dọc đường";
		let drop =
			props.data.number_seat_selected[position]?.tranship_address &&
			props.data.number_seat_selected[position]?.tranship_address.split("!@#$%^&*")[1]
				? "Trung chuyển"
				: props.data.number_seat_selected[position]?.drop_off_location &&
				  props.data.number_seat_selected[position]?.drop_off_location.includes(
						props.scheduleData.arrive_location,
				  )
				? "Tại bến"
				: "Dọc đường";
		return (
			<Box
				border={"1px solid"}
				padding="5px 10px"
				fontWeight={600}
				minW="155px"
				maxW="155px"
				minH={"96px"}
				maxH={"96px"}
				marginRight={"10px"}
				cursor={"pointer"}
				backgroundColor={props.seatSelected.includes(id) ? "#F2CAC2" : "#fff"}
				_hover={{ backgroundColor: "#F2CAC2" }}
				onClick={() => props.handleSeatSelected(id)}
				onDoubleClick={() =>
					handleOpenSeatInformation(props.data.number_seat_selected[position])
				}
			>
				{props.seatCustomerSelected.includes(id) ? (
					<>
						<Text marginBottom={"1%"}>{id}</Text>
						<Text
							fontSize="13px"
							marginBottom={"2%"}
						>
							{props.data.number_seat_selected[position].passenger_name}
						</Text>
						<Text
							color={"#363636"}
							fontSize="11px"
							marginBottom={"2%"}
						>
							{props.data.number_seat_selected[position].passenger_phone}
						</Text>
						<Flex
							color={"#363636"}
							fontSize="10px"
							justifyContent={"space-between"}
						>
							<Text>{pickup}</Text>
							<Text>{drop}</Text>
						</Flex>
					</>
				) : (
					<AddIcon
						position={"relative"}
						left="60px"
						top="30px"
					/>
				)}
			</Box>
		);
	};

	return (
		<Card
			backgroundColor={"#F5F5F5"}
			margin="3% 0"
		>
			<CardBody
				margin={"0 auto"}
				w="100%"
			>
				<Box>
					<Flex
						marginBottom={"20px"}
						justifyContent="space-around"
					>
						<Flex>
							{seatHTML("A1")}
							{seatHTML("A2")}
						</Flex>
						<Flex>
							{seatHTML("A3")}
							{seatHTML("A4")}
						</Flex>
					</Flex>
					<Flex
						marginBottom={"20px"}
						justifyContent="space-around"
					>
						<Flex>
							{seatHTML("B1")}
							{seatHTML("B2")}
						</Flex>
						<Flex>
							{seatHTML("B3")}
							{seatHTML("B4")}
						</Flex>
					</Flex>
					<Flex justifyContent="space-around">
						<Flex>
							{seatHTML("C1")}
							{seatHTML("C2")}
						</Flex>
						<Flex>
							{seatHTML("C3")}
							{seatHTML("C4")}
						</Flex>
					</Flex>
				</Box>
				{ModalHTML}
			</CardBody>
		</Card>
	);
}
