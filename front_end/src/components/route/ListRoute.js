import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline } from 'react-icons/io5';
import {
  Stack,
  IconButton,
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
import { useCallback, useRef, useState } from 'react';

export default function ListRoute(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [status, setStatus] = useState(false);
  const [id, setId] = useState(0);

  const handleActiveModal = (routeId, route) => {
    props.setRoute(route);
    props.setRouteId(routeId);
    props.onOpen();
  };

  const handleOpenModal = useCallback(
    (statusModal, id) => {
      setId(statusModal == true ? id : 0);
      setStatus(statusModal);
    },
    [id]
  );

  const handleDeleteRoute = useCallback(async () => {
    try {
      const deleteRoute = await props.axiosJWT.delete(
        `http://localhost:${props.port}/route/delete-route`,
        { data: { id: id }, headers: { token: props.token } }
      );
      if (deleteRoute.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Thông tin tuyến đường đã được xoá.',
          description: 'Chúng tôi đã xoá thông tin tuyến đường cho bạn',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        props.handleGetListRoute();
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
          description: 'Xảy ra lỗi khi xoá thông tin tuyến đường. Làm ơn hãy thử lại.',
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

  const ModalHTML = (
    <Modal isOpen={status}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bạn có chắc chắn muốn xoá ?</ModalHeader>
        <ModalBody>
          <Text>
            Thao tác xóa có thể ảnh hưởng đến dữ liệu của những lịch trình có liên quan đến tuyến
            đường này. Bạn có chắc chắn xóa?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => handleOpenModal(false, 0)}
            backgroundColor={'#f26a4c'}
            _hover={{ backgroundColor: '#f26a4c' }}
          >
            Đóng
          </Button>
          <Button variant="ghost" onClick={handleDeleteRoute}>
            Xoá
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const ListRouteHTML = props.list.map((route, index) => {
    return (
      <tr>
        <td>{index + 1}</td>
        <td>{route.city_from?.city_name}</td>
        <td>{route.city_to?.city_name}</td>
        <td>{route.totalBS}</td>

        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton icon={<SlPencil />} onClick={() => handleActiveModal(route?.id, route)} />
            <IconButton
              icon={<IoTrashBinOutline />}
              onClick={() => handleOpenModal(true, route?.id)}
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
            <td>Thành phố đi </td>
            <td>Thành phố đến</td>
            <td>Số lượng lịch trình</td>
            <td>Thao tác</td>
          </tr>
        </thead>
        <tbody>{ListRouteHTML}</tbody>
      </table>
    </>
  );
}
