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
import { useCallback, useEffect, useState } from "react";
import { useRef } from "react";

export default function AddOffice(props) {
	const toast = useToast();
	const toastIdRef = useRef();

	const [listCity, setListCity] = useState([]);

	const [officeName, setOfficeName] = useState("");
	const [city, setCity] = useState();
	const [office, setLocation] = useState();

	const [error, setError] = useState({
		officeName: false,
		city: false,
		office: false,
	});

	const handleChangeOfficeName = useCallback(
		(e) => {
			let value = e.target.value;
			let oldError = { ...error };
			if (!value) {
				oldError.officeName = true;
			} else {
				oldError.officeName = false;
			}
			setError(oldError);
			setOfficeName(e.target.value);
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
	const handleChangeOffice = useCallback(
		(e) => {
			let value = e.target.value;
			let oldError = { ...error };
			if (!value) {
				oldError.office = true;
			} else {
				oldError.office = false;
			}
			setError(oldError);
			setLocation(e.target.value);
		},
		[error],
	);

	const handleAddVehicle = useCallback(async () => {
		let oldError = { ...error };
		if (!officeName) {
			oldError.officeName = true;
		}
		if (!city) {
			oldError.city = true;
		}
		if (!office) {
			oldError.office = true;
		}
		if (oldError.officeName || oldError.city || oldError.office) {
			setError(oldError);
			return;
		}
		const submitData = {
			office_name: officeName,
			city_id: city,
			office_address: office,
		};
		if (props.officeId) {
			submitData.id = props.officeId;
			const updateOffice = await axios.put(
				`http://localhost:${props.port}/office/update-office`,
				submitData,
				{
					headers: { token: props.token },
				},
			);
			if (updateOffice.data.statusCode == 200) {
				toastIdRef.current = toast({
					title: "Thông tin văn phòng đã được cập nhật.",
					description: "Chúng tôi đã cập nhật thông tin văn phòng cho bạn.",
					status: "success",
					isClosable: true,
					position: "top",
					duration: 2000,
				});
				props.handleGetListOffice();
				props.onClose();
			} else {
				toastIdRef.current = toast({
					title: "Thông tin văn phòng không thể cập nhật.",
					description: "Xảy ra lỗi khi cập nhật thông tin văn phòng. Làm ơn hãy thử lại.",
					status: "error",
					isClosable: true,
					position: "top",
					duration: 2000,
				});
			}
		} else {
			const addOffice = await axios.post(
				`http://localhost:${props.port}/office/add-office`,
				submitData,
				{
					headers: { token: props.token },
				},
			);
			if (addOffice.data.statusCode == 200) {
				toastIdRef.current = toast({
					title: "Thông tin văn phòng đã được thêm.",
					description: "Chúng tôi đã thêm thông tin văn phòng cho bạn.",
					status: "success",
					isClosable: true,
					position: "top",
					duration: 2000,
				});
				props.handleGetListOffice();
				props.onClose();
			} else {
				toastIdRef.current = toast({
					title: "Không thể thêm mới Thông tin văn phòng.",
					description: "Xảy ra lỗi khi thêm thông tin văn phòng. Làm ơn hãy thử lại.",
					status: "error",
					isClosable: true,
					position: "top",
					duration: 2000,
				});
			}
		}
	}, [office, city, officeName, error]);

	const handleGetListCity = async () => {
		const getListCity = await axios.get(`http://localhost:${props.port}/city/list-city`, {
			headers: { token: props.token },
		});
		if (getListCity.data.statusCode == 200) {
			setListCity(getListCity.data.data?.listCity);
		}
	};

	useEffect(() => {
		if (props.officeId) {
			setOfficeName(props.office.office_name);
			setCity(props.office.city.id);
			setLocation(props.office.office_address);
			setError({
				officeName: false,
				city: false,
				office: false,
			});
		} else {
			setOfficeName("");
			setCity(0);
			setLocation("");
		}
	}, [props.officeId]);

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
				size="md"
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<Text
							fontSize={"3xl"}
							textAlign="center"
						>
							{!props.officeId ? "Tạo văn phòng" : "Chỉnh sửa thông tin văn phòng"}
						</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl
							marginBottom={"5%"}
							isRequired
							isInvalid={error.officeName}
						>
							<Flex>
								<FormLabel
									marginBottom="0"
									width={"51.5%"}
									fontWeight={"500"}
									mt={"2"}
								>
									Tên văn phòng
								</FormLabel>
								<Input
									value={officeName}
									onChange={handleChangeOfficeName}
								/>
							</Flex>
							<FormErrorMessage justifyContent={"flex-end"}>
								Tên văn phòng là bắt buộc
							</FormErrorMessage>
						</FormControl>

						<FormControl
							marginBottom={"5%"}
							isRequired
							isInvalid={error.city}
						>
							<Flex>
								<FormLabel
									marginBottom="0"
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
							marginBottom={"5%"}
							isRequired
							isInvalid={error.office}
						>
							<Flex>
								<FormLabel
									width={"51.5%"}
									fontWeight={"500"}
								>
									Địa chỉ
								</FormLabel>
								<Textarea
									value={office}
									onChange={handleChangeOffice}
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
							backgroundColor="#F26A4C"
							color="#fff"
							onClick={handleAddVehicle}
						>
							{!props.vehicleId ? "Tạo văn phòng" : "Chỉnh sửa thông tin văn phòng"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
