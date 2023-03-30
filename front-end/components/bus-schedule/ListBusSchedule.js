import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline, IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import { Stack, IconButton, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRef } from 'react';
import { convertTime } from '@/helper';
export default function ListBusSchedule(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const handleDeleteBusSchedule = async (busScheduleId, e) => {
    e.stopPropagation();
    const deleteBusSchedule = await axios.delete(
      `http://localhost:${props.port}/bus-schedule/delete-bus-schedule`,
      { data: { id: busScheduleId } },
      {
        headers: { token: props.token },
      }
    );
    if (deleteBusSchedule.data.statusCode == 200) {
      toastIdRef.current = toast({
        title: 'Lịch trình đã bị xoá.',
        description: 'Chúng tôi đã xoá lịch trình cho bạn.',
        status: 'success',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
      props.handleGetListBusSchedule("search");
    } else {
      toastIdRef.current = toast({
        title: 'Lịch trình không thể xoá.',
        description: 'Xảy ra lỗi khi xoá lịch trình. Làm ơn hãy thử lại.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
    }
  };

  const ListBusScheduleHTML = props.list.map((busSchedule, index) => {
    const city_from_to = busSchedule.route[0]?.city_from + ' - ' + busSchedule.route[0]?.city_to;
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
