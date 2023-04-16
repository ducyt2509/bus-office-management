import {
	Box,
	Flex,
	Text,
	Stack,
	Radio,
	RadioGroup,
	Switch,
	Textarea,
	FormControl,
	FormErrorMessage,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { GoLocation } from "react-icons/go";

export default function BusScheduleStep2(props) {
	const [radioLocationPickup, setRadioLocationPickup] = useState(props.locationPickup);
	const [radioLocationDropOff, setRadioLocationDropOff] = useState(props.locationDropOff);

	const handleChangeLocationPickup = useCallback(
		(value) => {
			let oldError = { ...props.error };
			if (!value) {
				oldError.pickupLocation = true;
			} else {
				oldError.pickupLocation = false;
			}
			if (value != "#") {
				props.setLocationPickup(value);
			}

			setRadioLocationPickup(value);
		},
		[props.error],
	);

	const handleChangeLocationDropOff = useCallback(
		(value) => {
			let oldError = { ...props.error };
			if (!value) {
				oldError.dropOffLocation = true;
			} else {
				oldError.dropOffLocation = false;
			}
			if (value != "#") {
				props.setLocationDropOff(value);
			}
			setRadioLocationDropOff(value);
		},
		[props.error],
	);

	let locationPickup = props.busScheduleInformation.location_bus_schedule
		? props.busScheduleInformation.location_bus_schedule.filter((e) => {
				return e.bus_location_type == 0;
		  })[0]?.bus_detail
		: [];

	let addressPickup = props.busScheduleInformation.location_bus_schedule
		? props.busScheduleInformation.location_bus_schedule.filter((e) => {
				return e.bus_location_type == 0;
		  })[0]?.bus_location_address
		: [];

	let locationDropOff = props.busScheduleInformation.location_bus_schedule
		? props.busScheduleInformation.location_bus_schedule.filter((e) => {
				return e.bus_location_type == 1;
		  })[0]?.bus_detail
		: [];

	let addressDropOff = props.busScheduleInformation.location_bus_schedule
		? props.busScheduleInformation.location_bus_schedule.filter((e) => {
				return e.bus_location_type == 1;
		  })[0]?.bus_location_address
		: [];

	locationPickup =
		locationPickup && locationPickup.length ? JSON.parse(locationPickup) : locationPickup;

	locationDropOff =
		locationDropOff && locationDropOff.length ? JSON.parse(locationDropOff) : locationDropOff;

	addressPickup =
		addressPickup && addressPickup.length ? JSON.parse(addressPickup) : addressPickup;

	addressDropOff =
		addressDropOff && addressDropOff.length ? JSON.parse(addressDropOff) : addressDropOff;

	const locationPickupHTML = locationPickup ? (
		locationPickup.map((location, index) => {
			const information = location.split(": ");
			const time = information[1];
			const position = information[0];
			const value = time + " - " + position;
			return (
				<Stack>
					<Radio value={value}>
						<Flex marginBottom={"2%!important"}>
							<Text
								fontWeight={"500"}
								fontSize={"16px"}
							>
								{time}
							</Text>
							<Text
								fontWeight={"500"}
								fontSize={"16px"}
							>
								&emsp;&bull;&ensp;{position}
							</Text>
						</Flex>
					</Radio>
					<Flex
						alignItems={"center"}
						marginLeft="33px!important"
						marginTop={"0!important"}
						marginBottom="8px!important"
					>
						<GoLocation />
						<Text marginLeft="3%">{addressPickup[index]}</Text>
					</Flex>
				</Stack>
			);
		})
	) : (
		<Text>Không có điểm đón</Text>
	);
	const locationDropOffHTML = locationDropOff ? (
		locationDropOff.map((location, index) => {
			const information = location.split(": ");
			const time = information[1];
			const position = information[0];
			const date = new Date(props.data.departure_date.split("T")[0]);
			const value = time + " - " + position;
			return (
				<Stack>
					<Radio value={value}>
						<Flex marginBottom={"2%!important"}>
							<Text
								fontWeight={"500"}
								fontSize={"16px"}
							>
								{time}
							</Text>
							<Text
								fontWeight={"500"}
								fontSize={"16px"}
							>
								&emsp;&bull;&ensp;{position}
							</Text>
						</Flex>
					</Radio>
					<Flex
						alignItems={"center"}
						marginLeft="33px!important"
						marginTop={"0!important"}
						marginBottom="8px!important"
					>
						<GoLocation />
						<Text marginLeft="3%">{addressDropOff[index]}</Text>
					</Flex>
				</Stack>
			);
		})
	) : (
		<Text>Không có điểm trả</Text>
	);
	return (
		<>
			<Box
				borderTop="1px solid #E2E8F0"
				borderBottom="1px solid #E2E8F0"
				margin="3% 0 1%"
			>
				<Flex
					margin="5% 0"
					alignItems={"center"}
					justifyContent="space-around"
				>
					<Stack
						width={"50%"}
						borderRight="1px solid"
					>
						<Text
							fontSize={"20px"}
							fontWeight={"500"}
							backgroundColor="#F5F5F5"
							padding="3%"
							marginRight="3%"
						>
							Điểm Đón
						</Text>
						<Stack
							marginRight="3%!important"
							maxHeight={"235px"}
							overflowY={"auto"}
						>
							<RadioGroup
								value={radioLocationPickup}
								onChange={handleChangeLocationPickup}
							>
								{locationPickupHTML}
								<Stack>
									<Radio value={"#"}>
										<Flex marginBottom={"2%!important"}>
											<Text
												fontWeight={"500"}
												fontSize={"16px"}
											>
												Khác
											</Text>
										</Flex>
									</Radio>
									{radioLocationPickup == "#" && (
										<Flex
											alignItems={"center"}
											marginLeft="33px!important"
											marginTop={"2%!important"}
											marginBottom="8px!important"
											maxWidth={"320px"}
										>
											<Textarea
												onChange={(e) =>
													props.setLocationPickup(e.target.value + " (dọc đường)")
												}
												placeholder="Nhập vị trí hoặc ghi chú"
											></Textarea>
										</Flex>
									)}
								</Stack>
							</RadioGroup>
						</Stack>
					</Stack>
					<Stack width={"50%"}>
						<Text
							fontSize={"20px"}
							fontWeight={"500"}
							backgroundColor="#F5F5F5"
							padding="3%"
							marginLeft="3%"
						>
							Điểm Trả
						</Text>
						<Stack
							marginLeft="3%!important"
							maxHeight={"235px"}
							overflowY={"auto"}
						>
							<RadioGroup
								value={radioLocationDropOff}
								onChange={handleChangeLocationDropOff}
							>
								{locationDropOffHTML}
								<Stack>
									<Radio value={"#"}>
										<Flex marginBottom={"2%!important"}>
											<Text
												fontWeight={"500"}
												fontSize={"16px"}
											>
												Khác
											</Text>
										</Flex>
									</Radio>
									{radioLocationDropOff == "#" && (
										<Flex
											alignItems={"center"}
											marginLeft="33px!important"
											marginTop={"2%!important"}
											marginBottom="8px!important"
											maxWidth={"320px"}
										>
											<Textarea
												onChange={(e) =>
													props.setLocationDropOff(e.target.value + " (dọc đường)")
												}
												placeholder="Nhập vị trí hoặc ghi chú"
											></Textarea>
										</Flex>
									)}
								</Stack>
							</RadioGroup>
						</Stack>
					</Stack>
				</Flex>
			</Box>
		</>
	);
}
