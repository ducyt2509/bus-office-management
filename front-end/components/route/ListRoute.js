import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline } from 'react-icons/io5';
import { Stack, IconButton, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRef } from 'react';

export default function ListRoute(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const handleActiveModal = (routeId, route) => {
    props.setRoute(route);
    props.setRouteId(routeId);
    props.onOpen();
  };
  const handleDeleteRoute = async (routeId) => {
    const deleteRoute = await axios.delete(
      `http://localhost:${props.port}/route/delete-route`,
      { data: { id: routeId } },
      {
        headers: { token: props.token },
      }
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
    } else {
      toastIdRef.current = toast({
        title: 'Thông tin tuyến đường không thể xoá',
        description: 'Xảy ra lỗi khi xoá thông tin tuyến đường. Làm ơn hãy thử lại.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
    }
  };
  const ListRouteHTML = props.list.map((route, index) => {
    return (
      <tr>
        <td>{index + 1}</td>
        <td>{route.city_from?.city_name}</td>
        <td>{route.city_to?.city_name}</td>

        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton icon={<SlPencil />} onClick={() => handleActiveModal(route?.id, route)} />
            <IconButton icon={<IoTrashBinOutline />} onClick={() => handleDeleteRoute(route?.id)} />
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
          <td>Thành phố đi </td>
          <td>Thành phố đến</td>
          <td>Thao tác</td>
        </tr>
      </thead>
      <tbody>{ListRouteHTML}</tbody>
    </table>
  );
}
