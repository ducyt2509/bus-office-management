import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline } from 'react-icons/io5';
import { Stack, IconButton, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRef } from 'react';

export default function ListLocation(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const handleActiveModal = (locationId, location) => {
    props.setLocation(location);
    props.setLocationId(locationId);
    props.onOpen();
  };
  const handleDeleteLocation = async (locationId) => {
    const deleteLocation = await axios.post(
      `http://localhost:${props.port}/location/delete-location`,
      { id: locationId },
      {
        headers: { token: props.token },
      }
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
    } else {
      toastIdRef.current = toast({
        title: 'Điểm đón trả không thể xoá',
        description: 'Xảy ra lỗi khi xoá điểm đón trả. Làm ơn hãy thử lại.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
    }
  };
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
            />
            <IconButton
              icon={<IoTrashBinOutline />}
              onClick={() => handleDeleteLocation(location?.id)}
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
          <td>Tên văn phòng</td>
          <td>Tên thành phố</td>
          <td>Địa chỉ</td>
          <td>Thao tác</td>
        </tr>
      </thead>
      <tbody>{ListLocationHTML}</tbody>
    </table>
  );
}
