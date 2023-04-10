import { SlPencil } from "react-icons/sl";
import { IoTrashBinOutline, IoPersonOutline, IoCallOutline } from "react-icons/io5";
import { Stack, IconButton, Flex, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useCallback } from "react";
import { useRef } from "react";
import { useRouter } from "next/router";

export default function ListEmployee(props) {
	const toast = useToast();
	const toastIdRef = useRef();
	const router = useRouter();
	const handleActiveModal = (userId, user, e) => {
		e.stopPropagation();
		props.setUser(user);
		props.setUserId(userId);
		props.onOpen();
	};
	const handleDeleteUser = async (userId, e) => {
		e.stopPropagation();
		const deleteUser = await axios.delete(
			`http://localhost:${props.port}/user/delete-user`,
			{ data: { id: userId } },
			{
				headers: { token: props.token },
			},
		);
		if (deleteUser.data.statusCode == 200) {
			toastIdRef.current = toast({
				title: "Thông tin nhân viên đã được xoá.",
				description: "Chúng tôi đã xoá thông tin nhân viên cho bạn",
				status: "success",
				isClosable: true,
				position: "top",
				duration: 2000,
			});
			props.handleGetListUser();
		} else {
			toastIdRef.current = toast({
				title: "Thông tin nhân viên không thể xoá",
				description: "Xảy ra lỗi khi xoá thông tin nhân viên. Làm ơn hãy thử lại.",
				status: "error",
				isClosable: true,
				position: "top",
				duration: 2000,
			});
		}
	};
	const handleGetEmployeeInformation = useCallback((id) => {
		router.push({
			pathname: "/admin/management/employee/[id]",
			query: { id: id },
		});
	});
	const ListUserHTML = props.list.map((user, index) => {
		let mainPhone = user.phone.replace("+84", "0");
		mainPhone =
			mainPhone.substring(0, 4) + " " + mainPhone.substring(4, 7) + " " + mainPhone.substring(7);
		let role =
			user.role_id == 1 ? "Manager" : user.role_id == 2 ? "Customer Service Staff" : "Driver";
		return (
			<tr onClick={() => handleGetEmployeeInformation(user.id)}>
				<td>{index + 1}</td>
				<td>{user.user_name}</td>
				<td
					style={
						user.role_id == 1
							? { color: "red" }
							: user.role_id == 2
							? { color: "green" }
							: { color: "blue" }
					}
				>
					<p style={{ width: "95%" }}>{role}</p>
				</td>
				<td>
					<Flex
						alignItems={"center"}
						justifyContent={"center"}
					>
						<p style={{ width: "95%" }}>{user.email}</p>
					</Flex>
				</td>
				<td>
					<Flex
						alignItems={"center"}
						justifyContent={"center"}
					>
						<p>{mainPhone}</p>
					</Flex>
				</td>
				<td>
					<Flex
						alignItems={"center"}
						justifyContent={"center"}
					>
						<p style={{ width: "95%" }}>{user.office.office_name}</p>
					</Flex>
				</td>
				<td>
					<Stack
						spacing={2}
						direction="row"
						align="center"
						justifyContent={"center"}
					>
						<IconButton
							icon={<SlPencil />}
							onClick={(e) => handleActiveModal(user?.id, user, e)}
						/>
						<IconButton
							icon={<IoTrashBinOutline />}
							onClick={(e) => handleDeleteUser(user?.id, e)}
						/>
					</Stack>
				</td>
			</tr>
		);
	});
	return (
		<table
			style={{ width: "100%", textAlign: "center" }}
			className="bom-table-bus"
		>
			<thead>
				<tr>
					<td>STT</td>
					<td>Tên nhân viên</td>
					<td>Chức vụ</td>
					<td>Email</td>
					<td>Số điện thoại</td>
					<td>Văn phòng</td>
					<td>Thao tác</td>
				</tr>
			</thead>
			<tbody>{ListUserHTML}</tbody>
		</table>
	);
}
