import { formatMoney } from "@/helper";
import { Box, Flex, Card, CardBody, Stack, Text, StackDivider } from "@chakra-ui/react";
import { Seat12 } from "@/src/components/vehicle";
import { useState } from "react";

export default function TicketDetail(props) {
	const [seatSelected, setSeatSelected] = useState(props.data.seat && props.data.seat.split(", "));
	return (
		<>
			<Flex
				w="80%"
				margin={"3% auto 2%"}
				justifyContent="space-between"
				flexWrap="wrap"
			>
				<Box
					flexBasis={{ base: "100%", lg: "37%" }}
					marginBottom={"2%"}
				>
					<Text
						fontSize={"20px"}
						fontWeight="500"
						marginBottom={"2%"}
					>
						Chi tiết vé
					</Text>
					<Card
						border={"1px solid"}
						paddingLeft={"5%"}
						paddingRight={"5%"}
					>
						<CardBody>
							<Stack
								divider={<StackDivider />}
								spacing="3"
							>
								<Box>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"2%"}
									>
										Tuyến
									</Text>
									<Text
										fontWeight={"500"}
										marginBottom={"3%"}
									>
										{props.data?.route_name}
									</Text>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"2%"}
									>
										Thời gian
									</Text>
									<Text
										marginBottom={"3%"}
										fontWeight={"500"}
									>
										{props.data?.date_detail}
									</Text>
								</Box>
								<Box>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"2%"}
									>
										Điểm đón
									</Text>
									<Text
										marginBottom={"3%"}
										fontWeight={"500"}
									>
										{props.data?.pickup_location}
									</Text>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"2%"}
									>
										Điểm trả
									</Text>
									<Text
										marginBottom={"3%"}
										fontWeight={"500"}
									>
										{props.data?.drop_off_location}
									</Text>
								</Box>
								<Box>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"2%"}
									>
										Hành khách
									</Text>
									<Text
										fontWeight={"500"}
										marginBottom={"3%"}
									>
										{props.data?.passenger_name}
									</Text>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"2%"}
									>
										Số điện thoại
									</Text>
									<Text
										marginBottom={"3%"}
										fontWeight={"500"}
									>
										{props.data?.passenger_phone}
									</Text>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"2%"}
									>
										Email
									</Text>
									<Text
										marginBottom={"3%"}
										fontWeight={"500"}
									>
										{props.data?.email ? props.data?.email : props.data?.passenger_email}
									</Text>
								</Box>
							</Stack>
						</CardBody>
					</Card>
				</Box>
				<Box flexBasis={{ base: "100%", lg: "60%" }}>
					<Text
						fontSize={"20px"}
						fontWeight="500"
					>
						&nbsp;
					</Text>
					<Card
						border={"1px solid"}
						marginTop={"1%"}
					>
						<CardBody>
							<Flex justifyContent={"space-between"}>
								<Stack spacing="5">
									<Box>
										<Text
											fontSize={"14px"}
											color="#686868"
											marginBottom={"2%"}
										>
											Biển số xe
										</Text>
										<Text
											fontWeight={"500"}
											marginBottom={"8%"}
										>
											{props.data?.vehicle_plate}
										</Text>
										<Text
											fontSize={"14px"}
											color="#686868"
											marginBottom={"3%"}
										>
											Ghế ngồi
										</Text>
										<Text
											marginBottom={"8%"}
											fontWeight={"500"}
										>
											{props.data?.seat}
										</Text>
										<Text
											fontSize={"14px"}
											color="#686868"
											marginBottom={"3%"}
										>
											Mã vé
										</Text>
										<Text
											marginBottom={"8%"}
											fontWeight={"500"}
										>
											{props.data?.id}
										</Text>
									</Box>
								</Stack>
								{props.data?.vehicle_type_id == 1 && (
									<Seat12
										seatSelected={seatSelected}
										setSeatSelected={setSeatSelected}
										page="ticket detail"
									/>
								)}
							</Flex>
						</CardBody>
					</Card>
					<Flex
						alignItems={"center"}
						justifyContent={"space-between"}
						marginTop={"2%"}
					>
						<Text
							fontSize={"14px"}
							fontWeight="500"
						>
							Phương thức thanh toán:
						</Text>
						<Text
							fontSize={"16px"}
							color={"#686868"}
						>
							{props.data.payment_status == 0
								? "Thanh toán khi lên xe"
								: "Thanh toán VNPAY - QR"}
						</Text>
					</Flex>
					<Flex
						alignItems={"center"}
						justifyContent={"space-between"}
						marginTop={"2%"}
					>
						<Text
							fontSize={"20px"}
							fontWeight="500"
						>
							Tổng tiền:
						</Text>
						<Text
							fontWeight={"700"}
							fontSize={"20px"}
							color={"#F26A4C"}
						>
							{formatMoney(props.data?.ticket_price)}
						</Text>
					</Flex>
				</Box>
			</Flex>
			{/* make upper code reponsive to mobile */}
		</>
	);
}
export async function getServerSideProps(context) {
	const data = context.query;
	return {
		props: {
			data,
			port: process.env.BACK_END_PORT,
		}, // will be passed to the page component as props
	};
}
