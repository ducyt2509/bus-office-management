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
import { useCallback, useRef, useState } from 'react';
import axios from 'axios';

export default function ListBus(props) {
  const [status, setStatus] = useState(false);
  const [id, setId] = useState(0);
  const toast = useToast();
  const toastIdRef = useRef();

  const handleActiveModal = (busId, bus) => {
    props.setVehicle(bus);
    props.setVehicleId(busId);
    props.onOpen();
  };
  const handleOpenModal = useCallback(
    (statusModal, id) => {
      setId(statusModal == true ? id : 0);
      setStatus(statusModal);
    },
    [id]
  );
  const handleDeleteBus = useCallback(async () => {
    try {
      const deleteVehicle = await props.axiosJWT.delete(
        `http://localhost:${props.port}/bus/delete-bus`,
        { data: { id: id }, headers: { token: props.token } }
      );
      if (deleteVehicle.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Thông tin xe đã được xoá.',
          description: 'Chúng tôi đã xoá thông tin xe cho bạn',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        props.handleGetListBus();
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
          description: 'Không thể lấy danh sách loại xe. Làm ơn hãy thử lại.',
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
            Thao tác xóa có thể ảnh hưởng đến dữ liệu của những hành trình có liên quan đến chuyến
            xe này. Bạn có chắc chắn xóa?
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
          <Button variant="ghost" onClick={handleDeleteBus}>
            Xoá
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  const ListBusHTML = props.list.map((bus, index) => {
    let mainPhone = bus.driverMain.phone.replace('+84', '0');
    mainPhone =
      mainPhone.substring(0, 4) + ' ' + mainPhone.substring(4, 7) + ' ' + mainPhone.substring(7);
    let supportPhone = bus.driverSupport ? bus.driverSupport.phone.replace('+84', '0') : '';
    supportPhone =
      supportPhone.substring(0, 4) +
      ' ' +
      supportPhone.substring(4, 7) +
      ' ' +
      supportPhone.substring(7);
    const busStatusHTML =
      bus.vehicle_status == 1 ? (
        <div className="bom-bus-status active">Đang hoạt động</div>
      ) : (
        <div className="bom-bus-status no-active">Ngừng hoạt động</div>
      );
    return (
      <tr>
        <td>{index + 1}</td>
        <td>{bus.vehicle_plate}</td>
        <td>{bus.vehicle?.vehicle_type_name}</td>
        <td>
          <Stack>
            <Flex alignItems={'center'} justifyContent={'center'}>
              <IoPersonOutline style={{ width: '15%' }} />
              <p style={{ width: '80%' }}>{bus.driverMain.user_name}</p>
            </Flex>
            <Flex alignItems={'center'} justifyContent={'center'}>
              <IoCallOutline style={{ width: '15%' }} />
              <p style={{ width: '80%' }}>{mainPhone}</p>
            </Flex>
          </Stack>
        </td>
        <td>
          <Stack>
            <Flex alignItems={'center'} justifyContent={'center'}>
              {bus.driverSupport?.user_name && (
                <>
                  <IoPersonOutline style={{ width: '15%' }} />
                  <p style={{ width: '80%' }}>{bus.driverSupport?.user_name}</p>
                </>
              )}
            </Flex>
            <Flex alignItems={'center'} justifyContent={'center'}>
              {bus.driverSupport?.phone && (
                <>
                  <IoCallOutline style={{ width: '15%' }} />
                  <p style={{ width: '80%' }}>{supportPhone}</p>
                </>
              )}
            </Flex>
          </Stack>
        </td>
        <td>{busStatusHTML}</td>
        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton icon={<SlPencil />} onClick={() => handleActiveModal(bus?.id, bus)} />
            <IconButton
              icon={<IoTrashBinOutline />}
              onClick={() => handleOpenModal(true, bus?.id)}
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
            <td>Biển số xe</td>
            <td>Loại xe</td>
            <td>Tài xế chính</td>
            <td>Tài xế phụ</td>
            <td>Tình trạng</td>
            <td>Thao tác</td>
          </tr>
        </thead>
        <tbody>{ListBusHTML}</tbody>
      </table>
    </>
  );
}
