import { Select, Input, Button, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export default function HomeDestination(props) {
	const router = useRouter();
	const [startLocation, setStartLocation] = useState();
	const [endLocation, setEndLocation] = useState();
	const [departureDay, setDepartureDay] = useState();
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
		router.push({
			pathname: "/bus-schedule",
			query: submitData,
		});
	}, [startLocation, endLocation, departureDay, error]);
	const cityOption =
		props.list_city &&
		props.list_city.map((city) => <option value={city.id}>{city.city_name}</option>);
	return (
		<div className="home-destination">
			<form action="">
				<FormControl
					w={"25%"}
					isInvalid={error.from}
				>
					<FormLabel
						display="block"
						marginBottom="10px"
						fontStyle="normal"
						fontWeight="700"
						fontSize="20px"
						lineHeight="24px"
						color="#cd6814"
						for="from"
					>
						Điểm xuất phát
					</FormLabel>
					<Select
						placeholder="Chọn điểm xuất phát"
						size="md"
						p={1}
						w="100%"
						onChange={handleChangeStartLocation}
						value={startLocation}
					>
						{cityOption}
					</Select>
					{error.from && <FormErrorMessage>Điểm xuất phát là bắt buộc</FormErrorMessage>}
				</FormControl>
				<FormControl
					w={"25%"}
					isInvalid={error.to}
				>
					<FormLabel
						display="block"
						marginBottom="10px"
						fontStyle="normal"
						fontWeight="700"
						fontSize="20px"
						lineHeight="24px"
						color="#cd6814"
						for="to"
					>
						Điểm đến
					</FormLabel>
					<Select
						placeholder="Chọn điểm đến"
						size="md"
						p={1}
						w="100%"
						onChange={handleChangeEndLocation}
						value={endLocation}
					>
						{cityOption}
					</Select>
					{error.to && <FormErrorMessage>Điểm đến là bắt buộc</FormErrorMessage>}
				</FormControl>
				<FormControl
					w={"25%"}
					isInvalid={error.date}
				>
					<FormLabel
						display="block"
						marginBottom="10px"
						fontStyle="normal"
						fontWeight="700"
						fontSize="20px"
						lineHeight="24px"
						color="#cd6814"
						for="date"
					>
						Ngày đi
					</FormLabel>
					<Input
						placeholder="Select Date and Time"
						size="md"
						type="date"
						onChange={handleChangeDepartureDay}
						value={departureDay}
						min={new Date().toISOString().split("T")[0]}
					/>
					{error.date && <FormErrorMessage>Ngày đi là bắt buộc</FormErrorMessage>}
				</FormControl>
				<Button
					colorScheme="blue"
					onClick={searchBusSchedule}
				>
					Đặt Vé
				</Button>
			</form>
		</div>
	);
}
