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
import { convertTime } from '@/helper';

export default function ListTransport(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [status, setStatus] = useState(false);
  const [id, setId] = useState(0);

  const handleActiveModal = (transportId, transport) => {
    props.setTransport(transport);
    props.setTransportId(transportId);
    props.onOpen();
  };

  const handleOpenModal = useCallback(
    (statusModal, id) => {
      setId(statusModal == true ? id : 0);
      setStatus(statusModal);
    },
    [id]
  );

  const ModalHTML = (
    <Modal isOpen={status}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bạn có chắc chắn muốn xoá ?</ModalHeader>
        <ModalBody>
          <Text>
            Thao tác xóa có thể ảnh hưởng đến dữ liệu của những hành trình có liên quan đến lịc
            trình này. Bạn có chắc chắn xóa?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => handleOpenModal(false, 0, e)}
            backgroundColor={'#f26a4c'}
            _hover={{ backgroundColor: '#f26a4c' }}
          >
            Đóng
          </Button>
          <Button variant="ghost" onClick={handleDeleteTransport}>
            Xoá
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const handleDeleteTransport = useCallback(async () => {
    try {
      const deleteTransport = await props.axiosJWT.delete(
        `http://localhost:${props.port}/transport/delete-transport`,
        { data: { id: id }, headers: { token: props.token } }
      );
      if (deleteTransport.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Hành trình xe đã được xoá.',
          description: 'Chúng tôi đã xoá hành trình xe cho bạn',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        props.handleGetListTransport();
      }
    } catch (err) {
      toastIdRef.current = toast({
        title: 'Hành trình xe không thể xoá',
        description: 'Xảy ra lỗi khi xoá hành trình xe. Làm ơn hãy thử lại.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
    }
    setStatus(false)
    setId(0)
  }, [props.token, id]);

  const ListTransportHTML = props.list.map((transport, index) => {
    const time_from = convertTime(transport.time_from, 0);
    const time_to = convertTime(transport.time_from, transport.travel_time);
    const time_from_to = time_from + ' - ' + time_to;
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          {transport.departure_city}-{transport.arrive_city}
        </td>
        <td>{time_from_to}</td>
        <td>{transport.vehicle_plate}</td>
        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton
              icon={<SlPencil />}
              onClick={() => handleActiveModal(transport?.id, transport)}
            />
            <IconButton
              icon={<IoTrashBinOutline />}
              onClick={() => handleOpenModal(true, transport?.id)}
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
            <td>Tuyến đường</td>
            <td>Thời gian khởi hành</td>
            <td>Biển số xe</td>
            {/* <td>Ngày khởi hành tiếp theo</td> */}
            <td>Thao tác</td>
          </tr>
        </thead>
        <tbody>{ListTransportHTML}</tbody>
      </table>
    </>
  );
}
