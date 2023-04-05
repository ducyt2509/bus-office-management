import { Box, Flex, Text, Stack, Button } from "@chakra-ui/react";
import Image from "next/image";
import EmptyChair from "@/images/icons/empty-chair.png";
import SoldChair from "@/images/icons/sold-chair.png";
import SelectChair from "@/images/icons/select-chair.png";
import { Seat12 } from "@/components/vehicle";

export default function BusScheduleStep1(props) {
	return (
		<Box
			borderTop="1px solid #E2E8F0"
			borderBottom="1px solid #E2E8F0"
			margin="3% 0"
		>
			<Flex
				margin="5% 0  "
				alignItems={"center"}
				justifyContent="space-around"
			>
				<Stack>
					<Flex
						alignItems={"center"}
						marginBottom="10% !important"
					>
						<Image
							src={EmptyChair}
							style={{ width: "25%", maxHeight: "50px !important" }}
						/>
						<Text
							marginLeft={"10%"}
							whiteSpace="nowrap"
							color="#7d7d7d"
							fontWeight={"500"}
						>
							Ghế còn trống
						</Text>
					</Flex>
					<Flex
						alignItems={"center"}
						marginBottom="10% !important"
					>
						<Image
							src={SoldChair}
							style={{ width: "25%", maxHeight: "50px !important" }}
						/>
						<Text
							marginLeft={"10%"}
							whiteSpace="nowrap"
							color="#7d7d7d"
							fontWeight={"500"}
						>
							Ghế đã bán
						</Text>
					</Flex>
					<Flex
						alignItems={"center"}
						marginBottom="10% !important"
					>
						<Image
							src={SelectChair}
							style={{ width: "25%", maxHeight: "50px !important" }}
						/>
						<Text
							marginLeft={"10%"}
							whiteSpace="nowrap"
							color="#7d7d7d"
							fontWeight={"500"}
						>
							Ghế bạn chọn
						</Text>
					</Flex>
				</Stack>
				{props.data?.bus[0]?.vehicle_type_id == 1 && (
					<Seat12
						seatSelected={props.seatSelected}
						setSeatSelected={props.setSeatSelected}
						seatCustomerSelected={props.seatCustomerSelected}
					/>
				)}
			</Flex>
		</Box>
	);
}
