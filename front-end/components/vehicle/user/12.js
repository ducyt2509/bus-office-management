import { useCallback, useState } from "react";
import { AddIcon, SmallCloseIcon, SmallAddIcon } from "@chakra-ui/icons";
import { GoLocation } from "react-icons/go";
import {
	Text,
	Card,
	CardBody,
	Flex,
	Box,
	Modal,
	StackDivider,
	Radio,
	RadioGroup,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Stack,
	Input,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Select,
	Button,
	Textarea,
	useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { formatMoney, validate } from "@/helper";

export default function Seat12User(props) {
	const seatVehicle = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"];
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [statusAddSeat, setStatusAddSeat] = useState(false);
	const [seat, setSeat] = useState([]);
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userPhone, setUserPhone] = useState("");
	const [locationPickup, setLocationPickup] = useState("");
	const [__locationPickup, __setLocationPickup] = useState("");
	const [__locationDropOff, __setLocationDropOff] = useState("");
	const [locationDropOff, setLocationDropOff] = useState("");
	const [transhipAddress, setTranshipAddress] = useState("");
	const [note, setNote] = useState("");
	const [price, setPrice] = useState("");
	const [addSeat, setAddSeat] = useState("");
	const [paymentStatus, setPaymentStatus] = useState();
	const [error, setError] = useState({
		userName: false,
		userEmail: false,
		userPhone: false,
		price: false,
		paymentStatus: false,
	});

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

	const locationPickupHTML = location_pickup ? (
		location_pickup.map((location, index) => {
			const information = location.split(": ");
			const time = information[1];
			const position = information[0];
			const date = new Date(props.data.departure_date);
			const value = time + " - " + date.toLocaleDateString() + " - " + position;
			return (
				<Stack
					marginBottom={index != location_pickup.length - 1 ? "10px" : ""}
					marginLeft={"5px"}
				>
					<Radio value={value}>
						<Flex
							marginBottom={"2%!important"}
							color={value == locationPickup ? "#F26A4C" : "#363636"}
						>
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
						marginTop={"5px!important"}
						marginBottom="8px!important"
					>
						<GoLocation />
						<Text
							marginLeft="3%"
							fontSize={"12px"}
						>
							{addressPickup[index]}
						</Text>
					</Flex>
				</Stack>
			);
		})
	) : (
		<Text>Không có điểm đón</Text>
	);
	const locationDropOffHTML = location_dropOff ? (
		location_dropOff.map((location, index) => {
			const information = location.split(": ");
			const time = information[1];
			const position = information[0];
			const date = new Date(props.data.departure_date);
			const value = time + " - " + date.toLocaleDateString() + " - " + position;
			return (
				<Stack
					marginBottom={"10px"}
					marginLeft={"5px"}
				>
					<Radio value={value}>
						<Flex
							marginBottom={"2%!important"}
							color={value == locationPickup ? "#F26A4C" : "#363636"}
						>
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

	const handleChangeUserName = useCallback(
		(e) => {
			let value = e.target.value;
			let oldError = { ...error };
			if (!value) {
				oldError.userName = true;
			} else {
				oldError.userName = false;
			}
			setError(oldError);
			setUserName(value);
		},
		[error],
	);

	const handleChangeUserEmail = useCallback(
		(e) => {
			let value = e.target.value;
			let oldError = { ...error };
			if (value) {
				if (!value.match(validate.email)) {
					oldError.userEmail = true;
				} else {
					oldError.userEmail = false;
				}
			} else {
				oldError.userEmail = false;
			}
			setError(oldError);
			setUserEmail(value);
		},
		[error],
	);
	const handleChangeUserPhone = useCallback(
		(e) => {
			let value = e.target.value;
			let oldError = { ...error };
			if (!value || !value.match(validate.phone)) {
				oldError.userPhone = true;
			} else {
				oldError.userPhone = false;
			}
			setError(oldError);
			setUserPhone(value);
		},
		[error],
	);

	const handleChangeTranshipAddress = useCallback((e) => {
		let value = e.target.value;
		setTranshipAddress(value);
	});

	const handleChangeNote = useCallback((e) => {
		let value = e.target.value;
		setNote(value);
	});

	const delteteSeatSelected = useCallback(
		(id) => {
			let cloneSeat = [...seat];
			cloneSeat.splice(seat.indexOf(id), 1);
			setSeat(cloneSeat);
		},
		[seat],
	);

	const handleAddNewSeat = useCallback(
		(id) => {
			setStatusAddSeat(!statusAddSeat);
		},
		[seat, statusAddSeat],
	);

	const addNewSeat = useCallback(() => {
		let checkSeatRemain = seatVehicle.filter(
			(s) => !props.seatCustomerSelected.includes(s) && !seat.includes(s),
		);
		let cloneSeat = [...seat];
		if (checkSeatRemain.length == 1) {
			cloneSeat.push(checkSeatRemain[0]);
		} else {
			cloneSeat.push(addSeat);
		}
		setSeat(cloneSeat);
		setStatusAddSeat(false);
	}, [seat, addSeat, props.seatCustomerSelected]);

	const handleOpenSeatInformation = async (data) => {
		onOpen();
		if (!data) {
			setSeat([]);
			setUserName("");
			setUserPhone("");
			setUserEmail("");
			setTranshipAddress("");
      setNote("")
			setPrice(props.scheduleData.price);
			setPaymentStatus(0);
			return;
		}
		const getTransaction = await axios.post(
			`http://localhost:${props.port}/transaction/get-transaction-by-id`,
			{ id: data.id },
			{
				headers: { token: props.token },
			},
		);
		if (getTransaction.data.statusCode == 200) {
			let userInformation = getTransaction.data.data.transaction;
			console.log(userInformation);
			setSeat(userInformation.seat.split(", "));
			setUserName(userInformation.passenger_name);
			setUserPhone(userInformation.passenger_phone);
			setUserEmail(userInformation.passenger_email);
			setTranshipAddress(userInformation.tranship_address);
			setPrice(userInformation.ticket_price);
			setPaymentStatus(userInformation.payment_status);
      setNote(userInformation.note);
      __setLocationDropOff(userInformation.tranship_address ? "2" : userInformation.note ? "1" : 0);
      __setLocationPickup(userInformation.tranship_address ? "2" : userInformation.note ? "1" : 0);
      

		}
	};

	const ModalHTML = (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Text
						fontSize={"3xl"}
						textAlign="center"
					>
						Thông tin khách hàng
					</Text>
				</ModalHeader>
				<ModalBody>
					<Stack
						divider={<StackDivider />}
						spacing="7"
					>
						<Box>
							<FormControl
								isRequired
								isInvalid={false}
							>
								<Flex alignItems={"center"}>
									<FormLabel
										fontWeight={"500"}
										mt={"2"}
										w="35%"
									>
										Ghế đã chọn:
									</FormLabel>
									<Flex
										maxW={"80%"}
										overflowX="auto"
									>
										{seat.map((seat) => {
											return (
												<Flex
													backgroundColor={"#d6d6d6"}
													minWidth="55px"
													minHeight="25px"
													paddingLeft="7px"
													borderRadius={"5px"}
													alignItems="center"
													justifyContent={"space-between"}
													marginRight="10px"
												>
													<Text fontWeight={"500"}>{seat}</Text>{" "}
													<SmallCloseIcon
														cursor={"pointer"}
														onClick={() => delteteSeatSelected(seat)}
													/>
												</Flex>
											);
										})}
										{seatVehicle.filter(
											(s) =>
												!props.seatCustomerSelected.includes(s) && !seat.includes(s),
										).length > 0 && (
											<Flex
												backgroundColor={"#d6d6d6"}
												minW="25px"
												minH="25px"
												borderRadius={"5px"}
												alignItems="center"
												justifyContent={"center"}
											>
												<SmallAddIcon
													cursor={"pointer"}
													onClick={handleAddNewSeat}
												/>
											</Flex>
										)}
									</Flex>
								</Flex>
								<FormErrorMessage justifyContent={"flex-end"}>
									Ghế đã chọn là bắt buộc
								</FormErrorMessage>
							</FormControl>
							<Box
								marginTop={"3%"}
								boxShadow={"3px 2px 10px 0px #ccc"}
								padding={"10px"}
								w="90%"
								display={
									statusAddSeat &&
									seatVehicle.filter(
										(s) => !props.seatCustomerSelected.includes(s) && !seat.includes(s),
									).length > 0
										? "block"
										: "none"
								}
								position={"absolute"}
								zIndex={"999"}
								backgroundColor={"#fff"}
							>
								<FormControl
									isRequired
									alignItems={"center"}
								>
									<Flex alignItems={"center"}>
										<Flex
											width={"80%"}
											alignItems={"center"}
										>
											<FormLabel width={"50%"}>Thêm ghế:</FormLabel>
											<Select
												value={addSeat}
												onChange={(e) => setAddSeat(e.target.value)}
											>
												{seatVehicle
													.filter(
														(s) =>
															!props.seatCustomerSelected.includes(s) &&
															!seat.includes(s),
													)
													.map((s) => {
														return <option value={s}>{s}</option>;
													})}
											</Select>
										</Flex>

										<Button
											marginLeft={"5%"}
											colorScheme="blue"
											onClick={addNewSeat}
										>
											Thêm
										</Button>
									</Flex>
								</FormControl>
							</Box>
						</Box>
						<Box>
							<FormControl
								marginBottom="5%"
								isRequired
								isInvalid={false}
							>
								<Flex>
									<FormLabel
										width={"51.5%"}
										fontWeight={"500"}
										mt={"2"}
									>
										Hành khách:
									</FormLabel>
									<Input
										value={userName}
										onChange={handleChangeUserName}
									/>
								</Flex>
								<FormErrorMessage justifyContent={"flex-end"}>
									Hành khách là bắt buộc
								</FormErrorMessage>
							</FormControl>
							<FormControl
								marginBottom="5%"
								isInvalid={false}
							>
								<Flex>
									<Text
										width={"55%"}
										fontWeight={"500"}
										mt="2"
									>
										Email:
									</Text>
									<Input
										value={userEmail}
										onChange={handleChangeUserEmail}
									/>
								</Flex>
								<FormErrorMessage justifyContent={"flex-end"}>
									Email sai định dạng
								</FormErrorMessage>
							</FormControl>

							<FormControl
								marginBottom="5%"
								isRequired
								isInvalid={false}
							>
								<Flex>
									<FormLabel
										width={"50%"}
										fontWeight={"500"}
										mt={"2"}
									>
										Số điện thoại:
									</FormLabel>
									<Input
										value={userPhone}
										onChange={handleChangeUserPhone}
									/>
								</Flex>
								<FormErrorMessage justifyContent={"flex-end"}>
									{userPhone == ""
										? "Số điện thoại là bắt buộc"
										: "Số điện thoại sai định dạng"}
								</FormErrorMessage>
							</FormControl>
							<FormControl marginBottom="5%">
								<Flex>
									<Text
										width={"55%"}
										fontWeight={"500"}
										mt="2"
									>
										Ghi chú:
									</Text>
									<Textarea
										value={transhipAddress}
										onChange={handleChangeTranshipAddress}
									/>
								</Flex>
							</FormControl>
						</Box>
						<Box>
							<FormControl marginBottom="5%">
								<Flex>
									<FormLabel
										width={"51.5%"}
										fontWeight={"500"}
									>
										Điểm đón:
									</FormLabel>
									<Select
										placeholder="Chọn điểm đón"
										value={__locationPickup}
										onChange={(e) => __setLocationPickup(e.target.value)}
									>
										<option value="0">Tại bến</option>
										<option value="1">Dọc đường</option>
										<option value="2">Trung chuyển</option>
									</Select>
								</Flex>
								{__locationPickup != 0 ? (
									<>
										<RadioGroup
											value={locationPickup}
											onChange={setLocationPickup}
											maxHeight={"250px"}
											overflowY={"auto"}
											margin={"10px 0"}
										>
											{locationPickupHTML}
											<Stack
												marginBottom={"10px"}
												marginLeft={"5px"}
											>
												{__locationPickup == 1 && (
													<>
														<Radio>
															<Text
																fontWeight={"500"}
																fontSize={"16px"}
															>
																Khác
															</Text>
														</Radio>
														<Textarea
															marginLeft="33px!important"
															w="320px"
															marginTop={"5px!important"}
														></Textarea>
													</>
												)}
											</Stack>
										</RadioGroup>
										{__locationPickup == 2 && (
											<>
												<Text
													fontWeight={"500"}
													marginBottom={"10px"}
												>
													Trung chuyển lúc đón
												</Text>
												<Textarea></Textarea>
											</>
										)}
									</>
								) : null}
							</FormControl>
							<FormControl>
								<Flex>
									<FormLabel
										width={"51.5%"}
										fontWeight={"500"}
									>
										Điểm trả:
									</FormLabel>
									<Select
										placeholder="Chọn điểm trả"
										value={__locationDropOff}
										onChange={(e) => __setLocationDropOff(e.target.value)}
									>
										<option value="0">Tại bến</option>
										<option value="1">Dọc đường</option>
										<option value="2">Trung chuyển</option>
									</Select>
								</Flex>
								{__locationDropOff != 0 ? (
									<>
										<RadioGroup
											value={locationDropOff}
											onChange={setLocationDropOff}
											maxHeight={"250px"}
											overflowY={"auto"}
											margin={"10px 0"}
										>
											{locationDropOffHTML}
											<Stack
												marginBottom={"10px"}
												marginLeft={"5px"}
											>
												{__locationDropOff == 1 && (
													<>
														<Radio>
															<Text
																fontWeight={"500"}
																fontSize={"16px"}
															>
																Khác
															</Text>
														</Radio>
														<Textarea
															marginLeft="33px!important"
															w="320px"
															marginTop={"5px!important"}
														></Textarea>
													</>
												)}
											</Stack>
										</RadioGroup>
										{__locationDropOff == 2 && (
											<>
												<Text
													fontWeight={"500"}
													marginBottom={"10px"}
												>
													Trung chuyển lúc trả
												</Text>
												<Textarea></Textarea>
											</>
										)}
									</>
								) : null}
							</FormControl>
						</Box>
						<Box>
							<FormControl
								marginBottom="5%"
								isRequired
								isInvalid={false}
							>
								<Flex>
									<FormLabel
										width={"51.5%"}
										fontWeight={"500"}
										mt={"2"}
									>
										Giá vé:
									</FormLabel>
									<Input
										value={formatMoney(props.scheduleData.price)}
										disabled
									/>
								</Flex>
							</FormControl>
							<FormControl marginBottom="5%">
								<Flex>
									<FormLabel
										width={"51.5%"}
										fontWeight={"500"}
									>
										Trạng thái thanh toán
									</FormLabel>
									<Select
										placeholder="Chọn hình thức thanh toán"
										value={paymentStatus}
									>
										<option value="0">Chưa thanh toán</option>
										<option value="1">Đã thanh toán</option>
										<option value="2">Thanh toán khi lên xe</option>
									</Select>
								</Flex>
							</FormControl>
						</Box>
						<Box marginBottom={"5%"}>
							<Flex
								marginBottom="5%"
								justifyContent={"space-between"}
								fontWeight="600"
								color="#363636"
								fontSize={"18px"}
							>
								<Text>Tổng tiền:</Text>
								<Text>{formatMoney(price)}</Text>
							</Flex>
							<Flex justifyContent={"space-between"}>
								<Flex>
									<Button
										backgroundColor={"#fff"}
										border="1px solid"
										marginRight={"10px"}
									>
										Huỷ vé
									</Button>
									<Button
										backgroundColor={"#fff"}
										border="1px solid"
									>
										Hoàn tác
									</Button>
								</Flex>
								<Flex>
									<Button
										backgroundColor="#F26A4C"
										color="#fff"
										marginRight={"10px"}
									>
										Cập nhật
									</Button>
									<Button
										backgroundColor={"#fff"}
										border="1px solid"
										onClick={onClose}
									>
										Đóng
									</Button>
								</Flex>
							</Flex>
						</Box>
					</Stack>
				</ModalBody>
			</ModalContent>
		</Modal>
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
							<Text>
								{props.data.number_seat_selected[position].pickup_location.includes(
									props.scheduleData.departure_location,
								)
									? "Tại bến"
									: "Dọc đường"}
							</Text>
							<Text>
								{props.data.number_seat_selected[position].drop_off_location.includes(
									props.scheduleData.arrive_location,
								)
									? "Tại bến"
									: "Dọc đường"}
							</Text>
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
