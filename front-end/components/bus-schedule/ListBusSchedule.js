import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline, IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import { MdAutorenew, MdCalendarMonth } from 'react-icons/md';
import { Icon } from '@chakra-ui/react';
import { BsDashLg } from 'react-icons/bs';
import { Stack, IconButton, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useRef } from 'react';
import { convertTime, formatDate } from '@/helper';

export default function ListBusSchedule(props) {
  const toast = useToast();
  const toastIdRef = useRef();

  const handleDeleteBusSchedule = async (busScheduleId, e) => {
    e.stopPropagation();
    try {
      const deleteBusSchedule = await props.axiosJWT.delete(
        `http://localhost:${props.port}/bus-schedule/delete-bus-schedule`,
        { data: { id: busScheduleId }, headers: { token: props.token } }
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
        props.handleGetListBusSchedule('search');
      }
    } catch (err) {
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

  const handleRenewalBusSchedule = async (busScheduleId, e) => {
    e.stopPropagation();
    try {
      const getBusSchedule = await props.axiosJWT.post(
        `http://localhost:${props.port}/bus-schedule/bus-schedule-by-id`,
        { id: busScheduleId },
        {
          headers: { token: props.token },
        }
      );
      let busSchedule = getBusSchedule.data.data.bus_schedule[0];
      const checkRenewal = (date, timeExpire) => {
        const expireDate = new Date(date);
        return expireDate.getTime() + timeExpire * 24 * 60 * 60 * 1000;
      };

      let newRefreshDate = checkRenewal(busSchedule.refresh_date, busSchedule.bus_schedule_expire);
      newRefreshDate = formatDate(newRefreshDate);
      busSchedule = { ...busSchedule, refresh_date: newRefreshDate };

      const updateBusSchedule = await props.axiosJWT.put(
        `http://localhost:${props.port}/bus-schedule/update-bus-schedule`,
        {
          id: busScheduleId,
          bus_schedule: busSchedule,
        },

        {
          headers: { token: props.token },
        }
      );

      if (updateBusSchedule.data.statusCode === 200) {
        toastIdRef.current = toast({
          title: 'Gia hạn lịch trình thành công.',
          description: 'Chúng tôi đã gia hạn lịch trình của bạn.',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        props.handleGetListBusSchedule('search');
      }
    } catch (err) {
      toastIdRef.current = toast({
        title: 'Gia hạn lịch trình thất bại',
        description: 'Có lỗi xảy ra trong quá trinhg thao tác vui lòng thử lại.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
    }
  };

  const handleRefreshBusSchedule = useCallback(async (busScheduleId, e) => {
    e.stopPropagation();
    try {
      const getBusSchedule = await props.axiosJWT.post(
        `http://localhost:${props.port}/bus-schedule/bus-schedule-by-id`,
        { id: busScheduleId },
        {
          headers: { token: props.token },
        }
      );
      let busSchedule = getBusSchedule.data.data.bus_schedule[0];
      const checkRenewal = (date, timeExpire) => {
        const expireDate = new Date(date);
        return expireDate.getTime() + timeExpire * 24 * 60 * 60 * 1000;
      };

      let newRefreshDate = checkRenewal(busSchedule.refresh_date, busSchedule.bus_schedule_expire);
      newRefreshDate = formatDate(newRefreshDate);
      busSchedule = { ...busSchedule, refresh_date: newRefreshDate };

      const updateBusSchedule = await props.axiosJWT.put(
        `http://localhost:${props.port}/bus-schedule/update-bus-schedule`,
        {
          id: busScheduleId,
          bus_schedule: busSchedule,
        },

        {
          headers: { token: props.token },
        }
      );

      if (updateBusSchedule.data.statusCode === 200) {
        toastIdRef.current = toast({
          title: 'Gia hạn lịch trình thành công.',
          description: 'Chúng tôi đã gia hạn lịch trình của bạn.',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        props.handleGetListBusSchedule('search');
      }
    } catch (err) {
      toastIdRef.current = toast({
        title: 'Gia hạn lịch trình thất bại',
        description: 'Có lỗi xảy ra trong quá trinhg thao tác vui lòng thử lại.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
    }
  });

  let styles = { color: 'black' };
  const ListBusScheduleHTML = props.list.map((busSchedule, index) => {
    const city_from_to = busSchedule.route[0]?.city_from + ' - ' + busSchedule.route[0]?.city_to;
    const time_from = convertTime(busSchedule.time_from, 0);
    const time_to = convertTime(busSchedule.time_from, busSchedule.travel_time);
    const time_from_to = time_from + ' - ' + time_to;
    const effective_date = formatDate(busSchedule.effective_date);
    const refresh_date = formatDate(busSchedule.refresh_date);
    // check nếu ngày hôm nay lớn hơn hoặc bằng thời gian cần gia hạn thì sẽ set style thành màu đỏ
    const checkTime =
      new Date().getTime() >=
      new Date(busSchedule.refresh_date).getTime() -
        (busSchedule.bus_schedule_expire / 2) * 24 * 60 * 60 * 1000
        ? true
        : false;
    styles = { color: 'black' };

    if (checkTime) {
      const getList = props.list.filter(
        (e) =>
          e.route_id == busSchedule.route_id &&
          e.departure_location_id == busSchedule.departure_location_id &&
          e.arrive_location_id == busSchedule.arrive_location_id &&
          e.time_from == busSchedule.time_from &&
          e.schedule_frequency == busSchedule.schedule_frequency &&
          e.bus_schedule_expire == busSchedule.bus_schedule_expire
      );
      styles = getList.length == 1 ? { color: 'red' } : { color: 'black' };
    }
    return (
      <tr style={styles} onClick={() => props.handleGetBusScheduleInformation(busSchedule.id)}>
        <td>{index + 1}</td>
        <td>{city_from_to}</td>
        <td>{time_from_to}</td>
        <td>{busSchedule.price}</td>
        <td>
          {effective_date} / {refresh_date}
        </td>
        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton
              icon={<SlPencil title="Xem lịch trinh" />}
              onClick={() => props.handleGetBusScheduleInformation(busSchedule.id)}
            />
            <IconButton
              icon={<IoTrashBinOutline title="Xóa lịch trình" />}
              onClick={(e) => handleDeleteBusSchedule(busSchedule?.id, e)}
            />

            <IconButton
              icon={<MdAutorenew title="Gia hạn lịch trình" />}
              onClick={(e) => handleRenewalBusSchedule(busSchedule?.id, e)}
            />
            <IconButton
              icon={<MdCalendarMonth title="Làm mới lịch trình" />}
              onClick={(e) => handleRefreshBusSchedule(busSchedule?.id, e)}
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
          <td>Thời hạn</td>
          <td>Thao tác</td>
        </tr>
      </thead>
      <tbody>{ListBusScheduleHTML}</tbody>
    </table>
  );
}
