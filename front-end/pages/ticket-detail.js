import { formatMoney } from "@/helper";
import {
	Box,
	Flex,
	Card,
	CardBody,
	RadioGroup,
	Radio,
	Stack,
	Button,
	Heading,
	Text,
	StackDivider,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalFooter,
	ModalBody,
	FormControl,
	FormLabel,
	FormErrorMessage,
} from "@chakra-ui/react";

export default function TicketDetail(props) {
	return (
		<>
			{" "}
			<Flex
				w="80%"
				margin={"3% auto 2%"}
				justifyContent="space-between"
			>
				<Box w="40%">
					<Text
						fontSize={"20px"}
						fontWeight="500"
						marginBottom={"2%"}
					>
						Chi tiết vé
					</Text>
					<Card border={"1px solid"}>
						<CardBody>
							<Stack
								divider={<StackDivider />}
								spacing="5"
							>
								<Box>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"4%"}
									>
										Tuyến
									</Text>
									<Text
										fontWeight={"500"}
										marginBottom={"6%"}
									>
										{props.data?.passenger_name}
									</Text>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"4%"}
									>
										Thời gian
									</Text>
									<Text
										marginBottom={"6%"}
										fontWeight={"500"}
									>
										+84{props.data?.passenger_phone}
									</Text>
								</Box>
								<Box>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"4%"}
									>
										Điểm đón
									</Text>
									<Text
										marginBottom={"6%"}
										fontWeight={"500"}
									>
										{props.data?.pickup_location}
									</Text>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"4%"}
									>
										Điểm trả
									</Text>
									<Text
										marginBottom={"6%"}
										fontWeight={"500"}
									>
										{props.data?.drop_off_location}
									</Text>
								</Box>
								<Box>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"4%"}
									>
										Hành khách
									</Text>
									<Text
										fontWeight={"500"}
										marginBottom={"6%"}
									>
										{props.data?.passenger_name}
									</Text>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"4%"}
									>
										Số điện thoại
									</Text>
									<Text
										marginBottom={"6%"}
										fontWeight={"500"}
									>
										+84{props.data?.passenger_phone}
									</Text>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"4%"}
									>
										Email
									</Text>
									<Text
										marginBottom={"6%"}
										fontWeight={"500"}
									>
										{props.data?.email}
									</Text>
								</Box>
							</Stack>
						</CardBody>
					</Card>
				</Box>
				<Box w={"50%"}>
					<Card
						border={"1px solid"}
						marginTop={"6%"}
					>
						<CardBody>
							<Stack
								divider={<StackDivider />}
								spacing="5"
							>
								<Box>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"4%"}
									>
										Hành khách
									</Text>
									<Text
										fontWeight={"500"}
										marginBottom={"6%"}
									>
										{props.data?.passenger_name}
									</Text>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"4%"}
									>
										Số điện thoại
									</Text>
									<Text
										marginBottom={"6%"}
										fontWeight={"500"}
									>
										+84{props.data?.passenger_phone}
									</Text>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"4%"}
									>
										Email
									</Text>
									<Text
										marginBottom={"6%"}
										fontWeight={"500"}
									>
										{props.data?.email}
									</Text>
								</Box>
								<Box>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"4%"}
									>
										Điểm đón
									</Text>
									<Text
										marginBottom={"6%"}
										fontWeight={"500"}
									>
										{props.data?.pickup_location}
									</Text>
									<Text
										fontSize={"14px"}
										color="#686868"
										marginBottom={"4%"}
									>
										Điểm trả
									</Text>
									<Text
										marginBottom={"6%"}
										fontWeight={"500"}
									>
										{props.data?.drop_off_location}
									</Text>
								</Box>
							</Stack>
						</CardBody>
					</Card>
					<Flex
						alignItems={"center"}
						justifyContent={"space-between"}
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
			{/* <Flex
				borderTop="2px solid rgb(217, 217, 217)"
				alignItems={"center"}
				justifyContent="space-evenly"
			>
				<Button
					backgroundColor={"#F26A4C"}
					color="#fff"
					padding="2% 10%"
					margin="2% 0"
					onClick={handleBookingTicket}
				>
					THANH TOÁN BẢO MẬT
				</Button>
				<Text color={"#686868"}>
					Bằng việc nhấn nút Thanh toán bảo mật, bạn đồng ý với Chính sách bảo mật thanh toán
				</Text>
			</Flex> */}
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
