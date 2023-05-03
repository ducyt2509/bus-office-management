import axios from "axios";
import { ChevronLeftIcon, SearchIcon, InfoIcon, CheckIcon } from "@chakra-ui/icons";
import { Text, Flex, Stack, Box, Input, IconButton, Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { actions, useStore } from "@/src/store";
import Cookies from "js-cookie";

export default function BusScheduleDriver(props) {
	const toast = useToast();
	const toastIdRef = useRef();
	const [state, dispatch, axiosJWT] = useStore();
	const [data, setData] = useState(props.data);
	const [status, setStatus] = useState(props.status);
	const router = useRouter();
	const handleBackMainScreen = () => {
		router.push("/driver");
	};
	const handleCheckCustomerInTheCar = useCallback(
		async (id, paymentStatus) => {
			try {
				const submitData = {
					id: id,
					payment_status: 2,
					role_id: 3,
				};
				if (paymentStatus == 0) {
					submitData.cashier = state.dataUser.id;
				}
				let updateTransactionById = await axiosJWT.put(
					`http://localhost:${props.port}/transaction/update-transaction`,
					submitData,
					{
						headers: {
							token: `Bearer ${state.dataUser.token}`,
						},
					},
				);
				if (updateTransactionById.data.statusCode == 200) {
					let createTicket = await axios.post(
						`http://localhost:${props.port}/ticket/create-ticket`,
						{
							transaction_id: id,
						},
						{
							headers: {
								token: `Bearer ${state.dataUser.token}`,
							},
						},
					);
					if (createTicket) {
						let cloneData = [...data];
						cloneData = cloneData.map((e) => {
							e.id == id ? (e.payment_status = 2) : null;
							return e;
						});
						setData(cloneData);
					} else {
						await axiosJWT.put(
							`http://localhost:${props.port}/transaction/update-transaction`,
							{
								id: id,
								payment_status: paymentStatus,
								role_id: 3,
							},
							{
								headers: {
									token: `Bearer ${state.dataUser.token}`,
								},
							},
						);
					}
					toastIdRef.current = toast({
						title: "Khánh hàng đã được đánh dấu lên xe",
						status: "success",
						isClosable: true,
						position: "top",
						duration: 2000,
					});
				}
			} catch (err) {
				if (err.response.data.statusCode == 401) {
					toastIdRef.current = toast({
						title: "Phiên của bạn đã hết hạn.",
						description: "Phiên đã hết hạn vui lòng đăng nhập lại.",
						status: "error",
						isClosable: true,
						position: "top",
						duration: 2000,
					});
				} else {
					toastIdRef.current = toast({
						title: err.response.data.data.message,
						description: "Không thể cập nhật thông tin khách hàng. Làm ơn hãy thử lại.",
						status: "error",
						isClosable: true,
						position: "top",
						duration: 2000,
					});
				}
			}
		},
		[data, state],
	);

	const handleDisembark = useCallback(async () => {
		Date.prototype.addDays = function (days) {
			var date = new Date(this.valueOf());
			date.setDate(date.getDate() + days);
			return date;
		};
		try {
			const getTransportById = await axiosJWT.post(
				`http://localhost:${props.port}/transport/get-transport-by-id`,
				{
					id: props.id,
				},
				{ headers: { token: `Bearer ${state.dataUser.token}` } },
			);

			if (getTransportById.data.statusCode == 200) {
				if (getTransportById.data.data.departure_date.split("T")[0] != props.date_detail) {
					toastIdRef.current = toast({
						title: "Xe đã xuất bến",
						description: "Xe đã xuất bến và không thể xuất bến lần nữa.",
						status: "error",
						isClosable: true,
						position: "top",
						duration: 2000,
					});
					return;
				}
				let submitData = {
					id: getTransportById.data.data.id,
					bus_id: getTransportById.data.data.bus_id,
					bus_schedule_id: getTransportById.data.data.bus_schedule_id,
					departure_date: new Date(getTransportById.data.data.departure_date)
						.addDays(getTransportById.data.data.schedule_frequency)
						.toISOString(),
				};
				const updateDepartureDate = await axiosJWT.put(
					`http://localhost:${props.port}/transport/update-transport`,
					submitData,
					{
						headers: { token: `Bearer ${state.dataUser.token}` },
					},
				);
				if (updateDepartureDate.data.statusCode == 200) {
					setStatus(false);
					toastIdRef.current = toast({
						title: "Xe đã xuất bến thành công",
						description: "Chúng tôi đã cập nhật hành trình xe cho bạn.",
						status: "success",
						isClosable: true,
						position: "top",
						duration: 2000,
					});
				}
			}
		} catch (err) {
			if (err.response.data.statusCode == 401) {
				toastIdRef.current = toast({
					title: "Phiên của bạn đã hết hạn.",
					description: "Phiên đã hết hạn vui lòng đăng nhập lại.",
					status: "error",
					isClosable: true,
					position: "top",
					duration: 2000,
				});
			} else {
				toastIdRef.current = toast({
					title: err.response.data.data.message,
					description: "Có lỗi xảy ra trong quá trình thao tác làm ơn hãy thử lại",
					status: "error",
					isClosable: true,
					position: "top",
					duration: 2000,
				});
			}
		}
	}, [props.id, state]);

	const CustomerNotInTheCarHTML = data
		.filter((e) => e.payment_status != 2)
		.map((customer) => {
			const pickup_location = customer.pickup_location.includes(" - ")
				? customer.pickup_location.split(" - ")[1]
				: customer.pickup_location;
			const drop_off_location = customer.drop_off_location.includes(" - ")
				? customer.drop_off_location.split(" - ")[1]
				: customer.drop_off_location;
			return (
				<Box
					fontSize={"19px"}
					fontWeight={"500"}
					color={"#363636"}
					marginBottom={"3%"}
				>
					<Flex
						backgroundColor={customer.payment_status == 0 ? "#F2CAC2" : "#86f0bd"}
						justifyContent={"space-between"}
						fontSize={"22px"}
						fontWeight={"700"}
						padding=" 2% 4%"
					>
						<Text>{customer.passenger_phone}</Text>
						<Text>{customer.seat}</Text>
					</Flex>
					<Flex
						padding="2% 4%"
						alignItems={"center"}
					>
						<Stack>
							<Text>Hành khách:</Text>
							<Text>Mã vé:</Text>
							<Text>Điểm đón:</Text>
							<Text>Điểm trả:</Text>
						</Stack>
						<Stack margin="0 4%">
							<Text>{customer.passenger_name}</Text>
							<Text>{customer.id}</Text>
							<Text>{pickup_location}</Text>
							<Text>{drop_off_location}</Text>
						</Stack>
						{customer.payment_status != 2 && (
							<IconButton
								fontSize="30px"
								backgroundColor="#00B65F"
								color="#fff"
								icon={<CheckIcon />}
								w="70px"
								h="70px"
								onClick={() =>
									handleCheckCustomerInTheCar(customer.id, customer.payment_status)
								}
							/>
						)}
					</Flex>
				</Box>
			);
		});

	const CustomerInTheCarHTML = data
		.filter((e) => e.payment_status == 2)
		.map((customer) => {
			const pickup_location = customer.pickup_location.includes(" - ")
				? customer.pickup_location.split(" - ")[1]
				: customer.pickup_location;
			const drop_off_location = customer.drop_off_location.includes(" - ")
				? customer.drop_off_location.split(" - ")[1]
				: customer.drop_off_location;
			return (
				<Box
					fontSize={"19px"}
					fontWeight={"500"}
					color={"#363636"}
					marginBottom={"3%"}
				>
					<Flex
						backgroundColor={customer.payment_status == 0 ? "#F2CAC2" : "#86f0bd"}
						justifyContent={"space-between"}
						fontSize={"22px"}
						fontWeight={"700"}
						padding=" 2% 4%"
					>
						<Text>{customer.passenger_phone}</Text>
						<Text>{customer.seat}</Text>
					</Flex>
					<Flex
						padding="2% 4%"
						alignItems={"center"}
					>
						<Stack>
							<Text>Hành khách:</Text>
							<Text>Mã vé:</Text>
							<Text>Điểm đón:</Text>
							<Text>Điểm trả:</Text>
						</Stack>
						<Stack margin="0 4%">
							<Text>{customer.passenger_name}</Text>
							<Text>{customer.id}</Text>
							<Text>{pickup_location}</Text>
							<Text>{drop_off_location}</Text>
						</Stack>
					</Flex>
				</Box>
			);
		});

	const now = new Date();
	const offset = now.getTimezoneOffset();
	const date = new Date().getDate();
	const month = new Date().getMonth();
	const year = new Date().getFullYear();

	useEffect(() => {
		let userData = Cookies.get("dataUser") ? Cookies.get("dataUser") : "";
		try {
			userData = JSON.parse(userData);
		} catch (error) {
			userData = {};
		}
		dispatch(actions.setDataUser(userData));
	}, []);

	return (
		<>
			<Stack
				width={"96%"}
				margin={"0 auto"}
				spacing="5"
				className="bom-driver-screen"
			>
				<Box marginTop="20%">
					<Flex
						fontSize={"30px"}
						alignItems={"center"}
						marginBottom="5%"
					>
						<ChevronLeftIcon
							fontSize={"40px"}
							onClick={handleBackMainScreen}
						/>
						<Text
							fontWeight={"500"}
							color={"#363636"}
							marginLeft={"1%"}
						>
							{props.location}
						</Text>
					</Flex>
					<Flex justifyContent={"space-between"}>
						<Input
							w="75%"
							marginLeft="4%"
							border={"1px solid #000!important"}
							marginBottom="5%"
							height={"40px"}
							placeHolder="Tìm kiếm"
							fontSize={"18px"}
						/>
						<IconButton
							marginRight="4%"
							aria-label="Search database"
							icon={<SearchIcon />}
							backgroundColor={"#fff"}
							border={"1px solid #000"}
						/>
					</Flex>
				</Box>
			</Stack>
			<Box>
				<Flex
					fontSize={"18px"}
					alignItems={"flex-end"}
					marginBottom={"3%"}
					marginLeft={"4%"}
				>
					<Text
						color={"red"}
						fontSize={"20px"}
						fontWeight={"500"}
						marginRight={"2%"}
					>
						{data.filter((e) => e.payment_status != 2).length}
					</Text>
					<Text>
						chưa lên xe <InfoIcon />
					</Text>
				</Flex>
				{CustomerNotInTheCarHTML}

				<Flex
					fontSize={"18px"}
					alignItems={"flex-end"}
					marginBottom={"3%"}
					marginLeft={"4%"}
					marginTop={"2%"}
				>
					<Text
						color={"red"}
						fontSize={"20px"}
						fontWeight={"500"}
						marginRight={"2%"}
					>
						{data.filter((e) => e.payment_status == 2).length}
					</Text>
					<Text>
						đã lên xe <InfoIcon />
					</Text>
				</Flex>
				{CustomerInTheCarHTML}
			</Box>
			{status ? (
				<Button
					position="fixed"
					bottom="30px"
					width="90%"
					margin="0 auto"
					left="0"
					right="0"
					padding="24px 0"
					backgroundColor="#F26A4C"
					color="#fff"
					onClick={handleDisembark}
				>
					Xuất Bến
				</Button>
			) : null}
		</>
	);
}
export async function getServerSideProps(context) {
	let port = process.env.BACK_END_PORT;
	let data = [];
	let location = context.query.location;
	let status = true;
	let getListUserByBusSChedule = await axios.post(
		`http://localhost:${port}/transaction/list-transaction`,
		{
			transport_id: context.query.transport_id,
			date_detail: context.query.date_detail,
			role_id: 3,
		},
	);
	if (getListUserByBusSChedule.data.statusCode == 200) {
		data = getListUserByBusSChedule.data.data.list_transaction;
	}

	const date = new Date().getDate();
	let month =
		new Date().getMonth() + 1 < 10
			? "0" + (new Date().getMonth() + 1)
			: new Date().getMonth() + 1;
	const year = new Date().getFullYear();
	if (
		new Date(context.query.date_detail).toString() !=
		new Date(year + "-" + month + "-" + date).toString()
	) {
		status = false;
	}

	return {
		props: {
			port,
			data,
			location,
			id: context.query.transport_id,
			status,
			date_detail: context.query.date_detail,
		}, // will be passed to the page component as props
	};
}
