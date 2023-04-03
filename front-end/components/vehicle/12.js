import { Flex, Stack } from "@chakra-ui/react";
import Image from "next/image";
import EmptyChair from "@/images/icons/empty-chair.png";
import SoldChair from "@/images/icons/sold-chair.png";
import SelectChair from "@/images/icons/select-chair.png";
import Steering from "@/images/icons/steering.png";
import { useCallback } from "react";

export default function Seat12(props) {
	const handleSeatSelected = useCallback(
		(id) => {
			const oldSeat = [...props.seatSelected];
			if (!oldSeat.includes(id)) {
				oldSeat.push(id);
			} else {
				oldSeat.splice(oldSeat.indexOf(id), 1);
			}
			props.setSeatSelected(oldSeat);
		},
		[props.seatSelected],
	);

	const ChairHTML = (id) => {
		return (
			<Image
				src={props.seatSelected && props.seatSelected.includes(id) ? SelectChair : EmptyChair}
				style={{ cursor: "pointer", width: "43%", height: "100%" }}
				onClick={() => {
					props.page != "ticket detail" && handleSeatSelected(id);
				}}
			/>
		);
	};

	const SoldChairHTML = (
		<Image
			src={SoldChair}
			style={{ cursor: "not-allowed", width: "43%", height: "100%" }}
		/>
	);
	const SelectChairHTML = (
		<Image
			src={SelectChair}
			style={{ cursor: "pointer", width: "43%", height: "100%" }}
		/>
	);
	const SteeringHTML = (
		<Image
			src={Steering}
			style={{ cursor: "pointer", width: "25%" }}
		/>
	);
	return (
		<Stack
			className="bom-vehicle-type"
			justifyContent={"space-evenly"}
			w={props.page == "ticket detail" && "25%"}
			pointerEvents={props.page == "ticket detail" && "none"}
		>
			<Flex marginBottom="8%">{SteeringHTML}</Flex>
			<Flex
				justifyContent={"space-between"}
				marginBottom="10% !important"
			>
				<Flex
					width={"42%"}
					justifyContent="space-between"
				>
					{ChairHTML("A1")}
					{ChairHTML("A2")}
				</Flex>
				<Flex
					width={"42%"}
					justifyContent="space-between"
				>
					{ChairHTML("A3")}
					{ChairHTML("A4")}
				</Flex>
			</Flex>
			<Flex
				justifyContent={"space-between"}
				marginBottom="10% !important"
			>
				<Flex
					width={"42%"}
					justifyContent="space-between"
				>
					{ChairHTML("B1")}
					{ChairHTML("B2")}
				</Flex>
				<Flex
					width={"42%"}
					justifyContent="space-between"
				>
					{ChairHTML("B3")}
					{ChairHTML("B4")}
				</Flex>
			</Flex>
			<Flex
				justifyContent={"space-between"}
				marginBottom="10% !important"
			>
				<Flex
					width={"42%"}
					justifyContent="space-between"
				>
					{ChairHTML("C1")}
					{ChairHTML("C2")}
				</Flex>
				<Flex
					width={"42%"}
					justifyContent="space-between"
				>
					{ChairHTML("C3")}
					{ChairHTML("C4")}
				</Flex>
			</Flex>
		</Stack>
	);
}
