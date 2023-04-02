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
	useToast,
	FormControl,
	FormLabel,
	FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef } from "react";
import { useCallback, useEffect, useState } from "react";

export default function AddLocation(props) {
	const toast = useToast();
	const toastIdRef = useRef();
	const [listCity, setListCity] = useState([]);
	const [locationName, setLocationName] = useState("");
	const [city, setCity] = useState();
	const [address, setAddress] = useState();

	const [error, setError] = useState({
		locationName: false,
		city: false,
		address: false,
	});

	const handleChangeLocationName = useCallback(
		(e) => {
			let value = e.target.value;
			let oldError = { ...error };
			if (!value) {
				oldError.locationName = true;
			} else {
				oldError.locationName = false;
			}
			setError(oldError);
			setLocationName(e.target.value);
		},
		[error],
	);
	const handleChangeCity = useCallback(
		(e) => {
			let value = e.target.value;
			let oldError = { ...error };
			if (!value) {
				oldError.city = true;
			} else {
				oldError.city = false;
			}
			setError(oldError);
			setCity(e.target.value);
		},
		[error],
	);
	const handleChangeAddress = useCallback(
		(e) => {
			let value = e.target.value;
			let oldError = { ...error };
			if (!value) {
				oldError.address = true;
			} else {
				oldError.address = false;
			}
			setError(oldError);
			setAddress(e.target.value);
		},
		[error],
	);

	const handleAddLocation = useCallback(async () => {
		let oldError = { ...error };
		if (!locationName) {
			oldError.locationName = true;
		}
		if (!city) {
			oldError.city = true;
		}
		if (!address) {
			oldError.address = true;
		}
		if (oldError.locationName || oldError.city || oldError.address) {
			setError(oldError);
			return;
		}
		const submitData = {
			address: address,
			location_name: locationName,
			city_id: city,
		};
		if (props.locationId) {
			submitData.id = props.locationId;
			const updateLocation = await axios.put(
				`http://localhost:${props.port}/location/update-location`,
				submitData,
				{
					headers: { token: props.token },
				},
			);
			if (updateLocation.data.statusCode == 200) {
				toastIdRef.current = toast({
					title: "Điểm đón trả đã được cập nhật.",
					description: "Chúng tôi đã cập nhật điểm đón trả cho bạn.",
					status: "success",
					isClosable: true,
					position: "top",
					duration: 2000,
				});
				props.handleGetListLocation(props.currentPage);
				props.onClose();
			} else {
				toastIdRef.current = toast({
					title: "Điểm đón trả không thể cập nhật.",
					description: "Xảy ra lỗi khi cập nhật điểm đón trả. Làm ơn hãy thử lại.",
					status: "error",
					isClosable: true,
					position: "top",
					duration: 2000,
				});
			}
		} else {
			const addLocation = await axios.post(
				`http://localhost:${props.port}/location/add-location`,
				submitData,
				{
					headers: { token: props.token },
				},
			);
			if (addLocation.data.statusCode == 200) {
				toastIdRef.current = toast({
					title: "Điểm đón trả đã được thêm.",
					description: "Chúng tôi đã thêm điểm đón trả cho bạn.",
					status: "success",
					isClosable: true,
					position: "top",
					duration: 2000,
				});
				props.handleGetListLocation(props.currentPage);
				props.onClose();
			} else {
				toastIdRef.current = toast({
					title: "Không thể thêm mới điểm đón trả.",
					description: "Xảy ra lỗi khi thêm điểm đón trả. Làm ơn hãy thử lại.",
					status: "error",
					isClosable: true,
					position: "top",
					duration: 2000,
				});
			}
		}
		setLocationName("");
		setCity(0);
	}, [address, city, locationName, error]);

	const handleGetListCity = async () => {
		const getListCity = await axios.get(`http://localhost:${props.port}/city/list-city`, {
			headers: { token: props.token },
		});
		if (getListCity.data.statusCode == 200) {
			setListCity(getListCity.data.data?.listCity);
		}
	};

	useEffect(() => {
		if (props.locationId) {
			setLocationName(props.location.location_name);
			setCity(props.location.city_id);
			setAddress(props.location.address);
			setError({
				locationName: false,
				city: false,
				address: false,
			});
		} else {
			setLocationName("");
			setCity(0);
			setAddress("");
		}
	}, [props.locationId]);

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
				size="lg"
			>
				<ModalOverlay />
				<ModalContent p={3}>
					<ModalHeader>
						<Text
							fontSize={"3xl"}
							textAlign="center"
						>
							{!props.locationId ? "Tạo điểm đón trả" : "Chỉnh sửa thông tin điểm đón trả"}
						</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl
							marginBottom="5%"
							isRequired
							isInvalid={error.locationName}
						>
							<Flex>
								<FormLabel
									width={"51.5%"}
									fontWeight={"500"}
									mt={"2"}
								>
									Tên địa điểm
								</FormLabel>
								<Input
									value={locationName}
									onChange={handleChangeLocationName}
								/>
							</Flex>
							<FormErrorMessage justifyContent={"flex-end"}>
								Tên địa điểm là bắt buộc
							</FormErrorMessage>
						</FormControl>
						<FormControl
							marginBottom="5%"
							isRequired
							isInvalid={error.city}
						>
							<Flex>
								<FormLabel
									width={"50%"}
									fontWeight={"500"}
									mt={"2"}
								>
									Tỉnh/Thành phố
								</FormLabel>
								<Select
									placeholder="Chọn tỉnh/thành phố"
									value={city}
									onChange={handleChangeCity}
								>
									{listCity.map((city) => {
										return <option value={city?.id}>{city?.city_name}</option>;
									})}
								</Select>
							</Flex>
							<FormErrorMessage justifyContent={"flex-end"}>
								Tỉnh/Thành phố là bắt buộc
							</FormErrorMessage>
						</FormControl>
						<FormControl
							marginBottom="5%"
							isRequired
							isInvalid={error.city}
						>
							<Flex>
								<FormLabel
									width={"51.5%"}
									fontWeight={"500"}
								>
									Địa chỉ
								</FormLabel>
								<Textarea
									value={address}
									onChange={handleChangeAddress}
								/>
							</Flex>
							<FormErrorMessage justifyContent={"flex-end"}>
								Địa chỉ là bắt buộc
							</FormErrorMessage>
						</FormControl>
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
							onClick={handleAddLocation}
						>
							{!props.locationId ? "Tạo Điểm Đón Trả" : "Chỉnh Sửa Điểm Đón Trả"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
