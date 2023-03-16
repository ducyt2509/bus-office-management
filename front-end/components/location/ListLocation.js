import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline, IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import { Stack, IconButton, Flex } from '@chakra-ui/react';
import axios from 'axios';
export default function ListLocation(props) {
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
      props.handleGetListLocation();
    }
  };
  const ListLocationHTML = props.list.map((location, index) => {
    return (
      <tr >
        <td>{index + 1}</td>
        <td>{location.location_name}</td>
        <td>{location.city_name}</td>
        <td>{location.address}</td>
        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton icon={<SlPencil />} onClick={() => handleActiveModal(location?.id, location)} />
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
          <td>Tên</td>
          <td>Thành Phố</td>
          <td>Địa chỉ</td>
          <td>Thao tác</td>
        </tr>
      </thead>
      <tbody>{ListLocationHTML}</tbody>
    </table>
  );
}
