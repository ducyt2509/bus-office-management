import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Flex,
	Input,
	Select,
	Text,
	Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function AddRoute(props) {
	const [listCity, setListCity] = useState([]);

	const [cityFrom, setCityFrom] = useState("");
	const [cityTo, setCityTo] = useState("");
	const [route, setRoute] = useState();

	const handleChangeCityFrom = (e) => {
		setCityFrom(e.target.value);
	};

	const handleChangeCityTo = (e) => {
		setCityTo(e.target.value);
	};

	const handleChangeRoute = (e) => {
		setRoute(e.target.value);
	};

	const handleAddRoute = useCallback(async () => {
		const submitData = {
			city_from_id: cityFrom,
			city_to_id: cityTo,
		};
		if (props.routeId) {
			submitData.id = props.routeId;
			const updateRoute = await axios.put(
				`http://localhost:${props.port}/route/update-route`,
				submitData,
				{
					headers: { token: props.token },
				},
			);
			if (updateRoute.data.statusCode == 200) {
				props.handleGetListRoute();
				props.onClose();
			}
		} else {
			const addRoute = await axios.post(
				`http://localhost:${props.port}/route/add-route`,
				submitData,
				{
					headers: { token: props.token },
				},
			);
			if (addRoute.data.statusCode == 200) {
				props.handleGetListRoute();
				props.onClose();
			}
		}
	}, [route, cityFrom, cityTo]);

	const handleGetListCity = async () => {
		const getListCity = await axios.get(`http://localhost:${props.port}/city/list-city`, {
			headers: { token: props.token },
		});
		if (getListCity.data.statusCode == 200) {
			setListCity(getListCity.data.data?.listCity);
		}
	};

	useEffect(() => {
		if (props.routeId) {
			setCityFrom(props.route.city_from_id);
			setCityTo(props.route.city_to_id);
			setRoute(props.route);
		} else {
			setCityFrom(0);
			setCityTo(0);
			setRoute();
		}
	}, [props.routeId]);

	useEffect(() => {
		if (props.isOpen) {
			handleGetListCity();
		}
	}, [props.isOpen]);
	return (
		<>
			<Modal
				isOpen={props.isOpen}
				onClose={props.onClose}
				size="xl"
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<Text
							fontSize={"3xl"}
							textAlign="center"
						>
							{!props.routeId ? "Tạo tuyến mới" : "Chỉnh sửa thông tin tuyến đường"}
						</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex marginBottom={"5%"}>
							<Text
								width={"50%"}
								fontWeight={"500"}
								mt={"10px"}
							>
								Tỉnh/Thành phố đi :
							</Text>
							<Select
								placeholder="Chọn tỉnh/thành phố"
								value={cityFrom}
								onChange={handleChangeCityFrom}
							>
								{listCity.map((city) => {
									return <option value={city?.id}>{city?.city_name}</option>;
								})}
							</Select>
						</Flex>

						<Flex marginBottom={"5%"}>
							<Text
								width={"50%"}
								fontWeight={"500"}
								mt={"10px"}
							>
								Tỉnh/Thành phố đến :
							</Text>
							<Select
								placeholder="Chọn tỉnh/thành phố"
								value={cityTo}
								onChange={handleChangeCityTo}
							>
								{listCity.map((city) => {
									return <option value={city?.id}>{city?.city_name}</option>;
								})}
							</Select>
						</Flex>
					</ModalBody>

					<ModalFooter justifyContent={"space-around"}>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={props.onClose}
							backgroundColor="#fff"
							color="#686868"
							border={"1px solid #686868"}
						>
							Huỷ
						</Button>
						<Button
							backgroundColor="#686868"
							color="#fff"
							onClick={handleAddRoute}
						>
							{!props.routeId ? "Tạo tuyến mới" : "Chỉnh sửa"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
