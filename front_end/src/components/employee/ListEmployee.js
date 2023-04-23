import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline, IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import {
  Stack,
  IconButton,
  Flex,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function ListEmployee(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [status, setStatus] = useState(false);
  const [id, setId] = useState(0);
  const router = useRouter();

  const handleActiveModal = (userId, user, e) => {
    e.stopPropagation();
    props.setUser(user);
    props.setUserId(userId);
    props.onOpen();
  };

  const handleOpenModal = useCallback(
    (statusModal, id, e) => {
      e.stopPropagation();
      setId(statusModal == true ? id : 0);
      setStatus(statusModal);
    },
    [id]
  );

  const handleDeleteUser = useCallback(async () => {
    try {
      const deleteUser = await props.axiosJWT.delete(
        `http://localhost:${props.port}/user/delete-user`,
        { data: { id: id }, headers: { token: props.token } }
      );
      if (deleteUser.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Thông tin nhân viên đã được xoá.',
          description: 'Chúng tôi đã xoá thông tin nhân viên cho bạn',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        props.handleGetListUser();
      }
    } catch (err) {
      if (err.response.data.statusCode == 401) {
        toastIdRef.current = toast({
          title: 'Phiên của bạn đã hết hạn.',
          description: 'Phiên đã hết hạn vui lòng đăng nhập lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      } else {
        toastIdRef.current = toast({
          title: err.response.data.data.message,
          description: 'Xảy ra lỗi khi xoá thông tin nhân viên. Làm ơn hãy thử lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    }
    setStatus(false);
    setId(0);
  }, [id, props.token]);

  const handleGetEmployeeInformation = useCallback((id) => {
    router.push({
      pathname: '/admin/management/employee/[id]',
      query: { id: id },
    });
  });

  const ModalHTML = (
    <Modal isOpen={status}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bạn có chắc chắn muốn xoá ?</ModalHeader>
        <ModalBody>
          <Text>
            Thao tác xóa có thể ảnh hưởng đến dữ liệu của những chuyến xe có liên quan đến người
            dùng này. Bạn có chắc chắn xóa?
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={(e) => handleOpenModal(false, 0, e)}
            backgroundColor={'#f26a4c'}
            _hover={{ backgroundColor: '#f26a4c' }}
          >
            Đóng
          </Button>
          <Button variant="ghost" onClick={handleDeleteUser}>
            Xoá
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const ListUserHTML = props.list.map((user, index) => {
    let mainPhone = user.phone.replace('+84', '0');
    mainPhone =
      mainPhone.substring(0, 4) + ' ' + mainPhone.substring(4, 7) + ' ' + mainPhone.substring(7);
    let role =
      user.role_id == 1 ? 'Manager' : user.role_id == 2 ? 'Customer Service Staff' : 'Driver';
    return (
      <tr onClick={() => handleGetEmployeeInformation(user.id)}>
        <td>{index + 1}</td>
        <td>{user.user_name}</td>
        <td
          style={
            user.role_id == 1
              ? { color: 'red' }
              : user.role_id == 2
              ? { color: 'green' }
              : { color: 'blue' }
          }
        >
          <p style={{ width: '95%' }}>{role}</p>
        </td>
        <td>
          <Flex alignItems={'center'} justifyContent={'center'}>
            <p style={{ width: '95%' }}>{user.email}</p>
          </Flex>
        </td>
        <td>
          <Flex alignItems={'center'} justifyContent={'center'}>
            <p>{mainPhone}</p>
          </Flex>
        </td>
        <td>
          <Flex alignItems={'center'} justifyContent={'center'}>
            <p style={{ width: '95%' }}>
              {user.office?.office_name ? user.office.office_name : 'Không thuộc văn phòng nào'}
            </p>
          </Flex>
        </td>
        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton icon={<SlPencil />} onClick={(e) => handleActiveModal(user?.id, user, e)} />
            <IconButton
              icon={<IoTrashBinOutline />}
              onClick={(e) => handleOpenModal(true, user?.id, e)}
            />
          </Stack>
        </td>
      </tr>
    );
  });
  return (
    <>
      {ModalHTML}
      <table style={{ width: '100%', textAlign: 'center' }} className="bom-table-bus">
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
    </>
  );
}
