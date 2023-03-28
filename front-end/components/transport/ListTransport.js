import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline, IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import { Stack, IconButton, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { convertTime } from '@/helper';
export default function ListTransport(props) {
  const handleActiveModal = (transportId, transport) => {
    props.setTransport(transport);
    props.setTransportId(transportId);
    props.onOpen();
  };
  const handleDeleteTransport = async (transportId) => {
    const deleteTransport = await axios.post(
      `http://localhost:${props.port}/transport/delete-transport`,
      { id: transportId },
      {
        headers: { token: props.token },
      }
    );
    if (deleteTransport.data.statusCode == 200) {
      props.handleGetListLocation();
    }
  };
  const ListTransportHTML = props.list.map((transport, index) => {
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{transport.departure_city}-{transport.arrive_city}</td>
        <td>{convertTime(transport.time_from, 0)}</td>
        <td>{transport.vehicle_plate}</td>
        <td>{new Date(transport.departure_date).toISOString().split("T")[0]}</td>
        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton icon={<SlPencil />} onClick={() => handleActiveModal(transport?.id, transport)} />
            <IconButton
              icon={<IoTrashBinOutline />}
              onClick={() => handleDeleteTransport(transport?.id)}
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
          <td>Tuyến</td>
          <td>Thời gian khởi hành</td>
          <td>Biển số xe</td>
          <td>Ngày khởi hành tiếp theo</td>
          <td>Thao tác</td>
        </tr>
      </thead>
      <tbody>{ListTransportHTML}</tbody>
    </table>
  );
}
