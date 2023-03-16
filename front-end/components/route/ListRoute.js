import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline, IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import { Stack, IconButton, Flex } from '@chakra-ui/react';
import axios from 'axios';
export default function ListRoute(props) {
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
      props.handleGetListRoute();
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
