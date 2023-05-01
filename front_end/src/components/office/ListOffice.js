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
import { useRouter } from 'next/router';
import { useCallback, useRef, useState } from 'react';

export default function ListOffice(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const router = useRouter();
  const [status, setStatus] = useState(false);
  const [id, setId] = useState(0);

  const handleActiveModal = (officeId, office, e) => {
    e.stopPropagation();
    props.setOffice(office);
    props.setOfficeId(officeId);
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

  const handleDeleteOffice = useCallback(async () => {
    try {
      const deleteOffice = await props.axiosJWT.delete(
        `http://localhost:${props.port}/office/delete-office`,
        { data: { id: id }, headers: { token: props.token } }
      );
      if (deleteOffice.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Thông tin văn phòng đã được xoá.',
          description: 'Chúng tôi đã xoá thông tin văn phòng cho bạn',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        props.handleGetListOffice();
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
          description: 'Xảy ra lỗi khi xoá thông tin văn phòng. Làm ơn hãy thử lại.',
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

  const handleGetOfficeInformation = (id) => {
    router.push({
      pathname: '/admin/management/office/[id]',
      query: { id: id },
    });
  };

  const ModalHTML = (
    <Modal isOpen={status}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bạn có chắc chắn muốn xoá ?</ModalHeader>
        <ModalBody>
          <Text>
            Thao tác xóa có thể ảnh hưởng đến dữ liệu của những lịch trình và nhân viên có liên quan
            đến văn phòng này. Bạn có chắc chắn xóa?
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
          <Button variant="ghost" onClick={handleDeleteOffice}>
            Xoá
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const ListOfficeHTML = props.list.map((office, index) => {
    return (
      <tr onClick={() => handleGetOfficeInformation(office.id)} style={{ cursor: 'pointer' }}>
        <td>{index + 1}</td>
        <td style={{ textAlign: 'start' }}>{office.office_name}</td>
        <td>{office.city.city_name}</td>
        <td style={{ textAlign: 'justify' }}>{office.office_address}</td>
        <td>{office.number_employee ? office.number_employee : 0}</td>
        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton
              icon={<SlPencil />}
              onClick={(e) => handleActiveModal(office?.id, office, e)}
              backgroundColor={'#f5daae'}
            />
            <IconButton
              icon={<IoTrashBinOutline />}
              onClick={(e) => handleOpenModal(true, office?.id, e)}
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
            <th>Tên</th>
            <th>Tỉnh/Thành phố</th>
            <th>Địa chỉ</th>
            <th>Số nhân viên</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>{ListOfficeHTML}</tbody>
      </table>
    </>
  );
}
