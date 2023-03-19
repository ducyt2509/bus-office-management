import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline, IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import { Stack, IconButton, Flex } from '@chakra-ui/react';
import axios from 'axios';
export default function ListBusSchedule(props) {
  const handleDeleteBusSchedule = async (busScheduleId, e) => {
    e.stopPropagation();
    const deleteBusSchedule = await axios.deleteSchedule(
      `http://localhost:${props.port}/bus-schedule/delete-bus-schedule`,
      { data: { id: busScheduleId } },
      {
        headers: { token: props.token },
      }
    );
    if (deleteBusSchedule.data.statusCode == 200) {
      props.handleGetListBusSchedule();
    }
  };

  const ListBusScheduleHTML = props.list.map((busSchedule, index) => {
    const city_from_to = busSchedule.route[0]?.city_from + ' - ' + busSchedule.route[0]?.city_to;
    const convertTime = (time, plus) => {
      const result = (time + plus) % 24;
      const string = result.toString().split('.');
      const hour = string[0];
      const minute = parseFloat('0.' + string[1]).toFixed(2) * 60;
      return hour + ':' + minute;
    };
    const time_from = convertTime(busSchedule.time_from, 0);
    const time_to = convertTime(busSchedule.time_from, busSchedule.travel_time);
    const time_from_to = time_from + ' - ' + time_to;
    return (
      <tr onClick={() => props.handleGetBusScheduleInformation(busSchedule.id)}>
        <td>{index + 1}</td>
        <td>{city_from_to}</td>
        <td>{time_from_to}</td>
        <td>{busSchedule.price}</td>
        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton
              icon={<SlPencil />}
              onClick={() => props.handleGetBusScheduleInformation(busSchedule.id)}
            />
            <IconButton
              icon={<IoTrashBinOutline />}
              onClick={(e) => handleDeleteBusSchedule(busSchedule?.id, e)}
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
          <td>Tuyến đường</td>
          <td>Giờ đi - giờ đến</td>
          <td>Giá vé</td>
          <td>Thao tác</td>
        </tr>
      </thead>
      <tbody>{ListBusScheduleHTML}</tbody>
    </table>
  );
}
