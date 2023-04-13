import {
	Text,
	Card,
	CardBody,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Flex,
	Box,
	Stack,
} from "@chakra-ui/react";
export default function LocationPickAndDrop(props) {
	let location_pickup = props.scheduleData.location_bus_schedule
		? props.scheduleData.location_bus_schedule.filter((e) => {
				return e.bus_location_type == 0;
		  })[0]?.bus_detail
		: [];
	let addressPickup = props.scheduleData.location_bus_schedule
		? props.scheduleData.location_bus_schedule.filter((e) => {
				return e.bus_location_type == 0;
		  })[0]?.bus_location_address
		: [];
	let location_dropOff = props.scheduleData.location_bus_schedule
		? props.scheduleData.location_bus_schedule.filter((e) => {
				return e.bus_location_type == 1;
		  })[0]?.bus_detail
		: [];
	let addressDropOff = props.scheduleData.location_bus_schedule
		? props.scheduleData.location_bus_schedule.filter((e) => {
				return e.bus_location_type == 1;
		  })[0]?.bus_location_address
		: [];

	location_pickup =
		location_pickup && location_pickup.length ? JSON.parse(location_pickup) : location_pickup;

	location_dropOff =
		location_dropOff && location_dropOff.length ? JSON.parse(location_dropOff) : location_dropOff;

	addressPickup =
		addressPickup && addressPickup.length ? JSON.parse(addressPickup) : addressPickup;

	addressDropOff =
		addressDropOff && addressDropOff.length ? JSON.parse(addressDropOff) : addressDropOff;

	const locationPickupHTML = location_pickup
		? location_pickup.map((location, index) => {
				return (
					<>
						<Text
							fontSize={"20px"}
							fontWeight={"600"}
							marginBottom={"2%"}
							marginTop={index != 0 && "3%"}
						>
							{location.split(": ")[0]}
						</Text>
						{props.transportData.number_seat_selected.filter((e) =>
							e.pickup_location.includes(location.split(": ")[0]),
						).length ? (
							props.transportData.number_seat_selected
								.filter((e) => e.pickup_location.includes(location.split(": ")[0]))
								.map((e) => {
									return (
										<Box
											border="1px solid"
											padding={"15px 8%"}
											marginBottom={"10px"}
										>
											<Flex
												justifyContent={"space-between"}
												color={"#363636"}
												fontSize={"15.7px"}
												fontWeight={500}
											>
												<Stack w="60%">
													<Text marginBottom={"5px"}>
														Khách hàng: {e.passenger_name}
													</Text>
													<Text>SĐT: {e.passenger_phone}</Text>
												</Stack>
												<Stack w="40%">
													<Text marginBottom={"5px"}>Số ghế: {e.seat}</Text>
													<Text whiteSpace={"nowrap"}>
														Tình trạng:{" "}
														<span
															style={
																e.payment_status == 2
																	? { color: "#363636" }
																	: e.payment_status == 1
																	? { color: "green" }
																	: { color: "red" }
															}
														>
															{e.payment_status == 2
																? "Thanh toán khí lên xe"
																: e.payment_status == 1
																? "Đã thanh toán"
																: "Chưa thanh toán"}
														</span>
													</Text>
												</Stack>
											</Flex>
										</Box>
									);
								})
						) : (
							<Box
								border="1px solid"
								padding={"15px 8%"}
								marginBottom={"10px"}
							>
								<Text textAlign={"center"}>Không có khách tại điểm này</Text>
							</Box>
						)}
					</>
				);
		  })
		: null;

	const locationDropOffHTML = location_dropOff
		? location_dropOff.map((location, index) => {
				return (
					<>
						<Text
							fontSize={"20px"}
							fontWeight={"600"}
							marginBottom={"2%"}
							marginTop={index != 0 && "3%"}
						>
							{location.split(": ")[0]}
						</Text>
						{props.transportData.number_seat_selected.filter((e) =>
							e.drop_off_location.includes(location.split(": ")[0]),
						).length ? (
							props.transportData.number_seat_selected
								.filter((e) => e.drop_off_location.includes(location.split(": ")[0]))
								.map((e) => {
									return (
										<Box
											border="1px solid"
											padding={"15px 8%"}
											marginBottom={"10px"}
										>
											<Flex
												justifyContent={"space-between"}
												color={"#363636"}
												fontSize={"15.7px"}
												fontWeight={500}
											>
												<Stack w="60%">
													<Text marginBottom={"5px"}>
														Khách hàng: {e.passenger_name}
													</Text>
													<Text>SĐT: {e.passenger_phone}</Text>
												</Stack>
												<Stack w="40%">
													<Text marginBottom={"5px"}>Số ghế: {e.seat}</Text>
													<Text whiteSpace={"nowrap"}>
														Tình trạng:{" "}
														<span
															style={
																e.payment_status == 2
																	? { color: "#363636" }
																	: e.payment_status == 1
																	? { color: "green" }
																	: { color: "red" }
															}
														>
															{e.payment_status == 2
																? "Thanh toán khí lên xe"
																: e.payment_status == 1
																? "Đã thanh toán"
																: "Chưa thanh toán"}
														</span>
													</Text>
												</Stack>
											</Flex>
										</Box>
									);
								})
						) : (
							<Box
								border="1px solid"
								padding={"15px 8%"}
								marginBottom={"10px"}
							>
								<Text textAlign={"center"}>Không có khách tại điểm này</Text>
							</Box>
						)}
					</>
				);
		  })
		: null;

	return (
		<Card margin="3% 0">
			<CardBody
				margin={"0 auto"}
				w="100%"
			>
				<Tabs isFitted>
					<TabList mb="1em">
						<Tab>Điểm Đón</Tab>
						<Tab>Điểm Trả</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>{locationPickupHTML}</TabPanel>
						<TabPanel>{locationDropOffHTML}</TabPanel>
					</TabPanels>
				</Tabs>
			</CardBody>
		</Card>
	);
}
