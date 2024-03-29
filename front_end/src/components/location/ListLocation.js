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

export default function ListLocation(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [status, setStatus] = useState(false);
  const [id, setId] = useState(0);

  const handleActiveModal = (locationId, location) => {
    props.setLocation(location);
    props.setLocationId(locationId);
    props.onOpen();
  };

  const handleOpenModal = useCallback(
    (statusModal, id) => {
      setId(statusModal == true ? id : 0);
      setStatus(statusModal);
    },
    [id]
  );

  const handleDeleteLocation = useCallback(async () => {
    try {
      const deleteLocation = await props.axiosJWT.delete(
        `http://localhost:${props.port}/location/delete-location`,
        { data: { id: id }, headers: { token: props.token } }
      );
      if (deleteLocation.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Điểm đón trả đã được xoá.',
          description: 'Chúng tôi đã xoá điểm đón trả cho bạn',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        props.handleGetListLocation();
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
          description: 'Xảy ra lỗi khi xoá điểm đón trả. Làm ơn hãy thử lại.',
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
            Thao tác xóa có thể ảnh hưởng đến dữ liệu của những lịch trình có liên quan đến địa điểm
            này. Bạn có chắc chắn xóa?
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
          <Button variant="ghost" onClick={handleDeleteLocation}>
            Xoá
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const ListLocationHTML = props.list.map((location, index) => {
    return (
      <tr>
        <td>{index + 1}</td>
        <td style={{ textAlign: 'initial', paddingLeft: '10px' }}>{location.location_name}</td>
        <td>{location.city_name}</td>
        <td style={{ textAlign: 'initial', paddingLeft: '10px' }}>{location.address}</td>
        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton
              icon={<SlPencil />}
              onClick={() => handleActiveModal(location?.id, location)}
              backgroundColor={'#f5daae'}
            />
            <IconButton
              icon={<IoTrashBinOutline />}
              onClick={() => handleOpenModal(true, location?.id)}
              backgroundColor={'#f79292'}
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
            <th>STT</th>
            <th>Tên văn phòng</th>
            <th>Tên thành phố</th>
            <th>Địa chỉ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>{ListLocationHTML}</tbody>
      </table>
    </>
  );
}
