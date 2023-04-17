import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline } from 'react-icons/io5';
import { Stack, IconButton, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useRef } from 'react';

export default function ListOffice(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const router = useRouter();
  const handleActiveModal = (officeId, office, e) => {
    e.stopPropagation();
    props.setOffice(office);
    props.setOfficeId(officeId);
    props.onOpen();
  };
  const handleDeleteOffice = async (officeId, e) => {
    e.stopPropagation();
    try {
      const deleteOffice = await props.axiosJWT.delete(
        `http://localhost:${props.port}/office/delete-office`,
        { data: { id: officeId } },
        {
          headers: { token: props.token },
        }
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
    } catch (error) {
      toastIdRef.current = toast({
        title: 'Thông tin văn phòng không thể xoá',
        description: 'Xảy ra lỗi khi xoá thông tin văn phòng. Làm ơn hãy thử lại.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
    }
  };
  const handleGetOfficeInformation = (id) => {
    router.push({
      pathname: '/admin/management/office/[id]',
      query: { id: id },
    });
  };
  const ListOfficeHTML = props.list.map((office, index) => {
    return (
      <tr onClick={() => handleGetOfficeInformation(office.id)}>
        <td>{index + 1}</td>
        <td>{office.office_name}</td>
        <td>{office.city.city_name}</td>
        <td>{office.office_address}</td>
        <td>{office.number_employee ? office.number_employee : 0}</td>
        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton
              icon={<SlPencil />}
              onClick={(e) => handleActiveModal(office?.id, office, e)}
            />
            <IconButton
              icon={<IoTrashBinOutline />}
              onClick={(e) => handleDeleteOffice(office?.id, e)}
            />
          </Stack>
        </td>
      </tr>
    );
  });
  return (
    <table style={{ width: '100%', textAlign: 'center' }} className="bom-table-bus">
      <thead>
        <tr>
          <td>STT</td>
          <td>Tên</td>
          <td>Tỉnh/Thành phố</td>
          <td>Địa chỉ</td>
          <td>Số nhân viên</td>
          <td>Thao tác</td>
        </tr>
      </thead>
      <tbody>{ListOfficeHTML}</tbody>
    </table>
  );
}
