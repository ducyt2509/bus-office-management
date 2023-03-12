import { SlPencil } from "react-icons/sl";
import { IoTrashBinOutline, IoPersonOutline, IoCallOutline } from "react-icons/io5";
import { Stack, IconButton, Flex } from "@chakra-ui/react";
import axios from "axios";
export default function ListEmployee(props) {
	const handleActiveModal = (userId, user) => {
		props.setUser(user);
		props.setUserId(userId);
		props.onOpen();
	};
	const handleDeleteUser = async (userId) => {
		const deleteUser = await axios.delete(
			`http://localhost:${props.port}/user/delete-user`,
			{ data: { id: userId } },
			{
				headers: { token: props.token },
			},
		);
		if (deleteUser.data.statusCode == 200) {
			props.handleGetListUser();
		}
	};
	const ListUserHTML = props.list.map((user, index) => {
		let mainPhone = user.phone.replace("+84", "0");
		mainPhone =
			mainPhone.substring(0, 4) + " " + mainPhone.substring(4, 7) + " " + mainPhone.substring(7);
		let role =
			user.role_id == 1 ? "Manager" : user.role_id == 2 ? "Customer Service Staff" : "Driver";
		return (
			<tr>
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
					{role}
				</td>
				<td>
					<Flex
						alignItems={"center"}
						justifyContent={"center"}
					>
						<IoPersonOutline style={{ width: "10%" }} />
						<p style={{ width: "80%" }}>{user.email}</p>
					</Flex>
				</td>
				<td>
					<Flex
						alignItems={"center"}
						justifyContent={"center"}
					>
						<IoCallOutline style={{ width: "15%" }} />
						<p>{mainPhone}</p>
					</Flex>
				</td>
				<td>{user.office.office_name}</td>
				<td>
					<Stack
						spacing={2}
						direction="row"
						align="center"
						justifyContent={"center"}
					>
						<IconButton
							icon={<SlPencil />}
							onClick={() => handleActiveModal(user?.id, user)}
						/>
						<IconButton
							icon={<IoTrashBinOutline />}
							onClick={() => handleDeleteUser(user?.id)}
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
