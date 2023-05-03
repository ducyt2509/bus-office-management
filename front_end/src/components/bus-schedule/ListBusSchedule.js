import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline } from 'react-icons/io5';
import { MdAutorenew, MdCalendarMonth } from 'react-icons/md';
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
  Text,
  Button,
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useRef, useState } from 'react';
import { convertTime, formatDate, formatMoney } from '@/helper';

export default function ListBusSchedule(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [status, setStatus] = useState(false);
  const [id, setId] = useState(0);

  const handleOpenModal = useCallback(
    (statusModal, id) => {
      setId(statusModal == true ? id : 0);
      setStatus(statusModal);
    },
    [id]
  );

  const handleDeleteBusSchedule = useCallback(async () => {
    try {
      const deleteBusSchedule = await props.axiosJWT.delete(
        `http://localhost:${props.port}/bus-schedule/delete-bus-schedule`,
        { data: { id: id }, headers: { token: props.token } }
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
          description: 'Xảy ra lỗi khi xoá lịch trình. Làm ơn hãy thử lại.',
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

  const ModalHTML = (
    <Modal isOpen={status}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bạn có chắc chắn muốn xoá ?</ModalHeader>
        <ModalBody>
          <Text>
            Thao tác xóa có thể ảnh hưởng đến dữ liệu của những lịch trình có liên quan đến lịch
            trình này. Bạn có chắc chắn xóa?
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => handleOpenModal(false, 0)}
            backgroundColor={'#f26a4c'}
            _hover={{ backgroundColor: '#f26a4c' }}
          >
            Đóng
          </Button>
          <Button variant="ghost" onClick={handleDeleteBusSchedule}>
            Xoá
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  let isRenewal = false;
  const ListBusScheduleHTML = props.list.map((busSchedule, index) => {
    const city_from_to = busSchedule.route[0]?.city_from + ' - ' + busSchedule.route[0]?.city_to;
    const time_from = convertTime(busSchedule.time_from, 0);
    const time_to = convertTime(busSchedule.time_from, busSchedule.travel_time);
    const time_from_to = time_from + ' - ' + time_to;
    const effective_date = formatDate(busSchedule.effective_date);
    const refresh_date = formatDate(busSchedule.refresh_date);

    // check nếu ngày hôm nay > effective date thì không cho sửa
    const conditionEdit = new Date(busSchedule.effective_date) < new Date();
    // check nếu ngày hôm nay lớn hơn hoặc bằng thời gian cần gia hạn thì sẽ set style thành màu đỏ
    const checkTime =
      new Date().getTime() >=
        new Date(busSchedule.refresh_date).getTime() -
        (busSchedule.bus_schedule_expire / 2) * 24 * 60 * 60 * 1000
        ? true
        : false;
    isRenewal = false;

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
      isRenewal = getList.length == 1 ? true : false;
    }
    return (
      <tr
      onClick={() => props.handleGetBusScheduleInformation(busSchedule.id)}
      >
        <td>{index + 1}</td>
        <td>{city_from_to}</td>
        <td>{time_from_to}</td>
        <td>{formatMoney(busSchedule.price)}</td>
        <td>
          {effective_date}
        </td>
        <td> {refresh_date}</td>
        {isRenewal ? <td  > <div className="bom-bus-status  no-active">Sắp hết hạn</div> </td>
          : <td> <div className="bom-bus-status active">Đang hoạt động</div> </td>
        }
        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton
              backgroundColor={'#f5daae'}
              icon={<SlPencil title="Xem lịch trinh" />}
              onClick={() => props.handleGetBusScheduleInformation(busSchedule.id, conditionEdit)}
              cursor={conditionEdit ? 'not-allowed' : 'pointer'}
            />
            <IconButton
              backgroundColor={'#f79292'}
              icon={<IoTrashBinOutline title="Xóa lịch trình" />}
              onClick={() => handleOpenModal(true, busSchedule?.id)}
            />

            <IconButton
              backgroundColor={'#cdf7ba'}
              icon={<MdAutorenew title="Gia hạn lịch trình" />}
              onClick={(e) => handleRenewalBusSchedule(busSchedule?.id, e)}
            />
            <IconButton
              backgroundColor={'#baedf7'}
              icon={<MdCalendarMonth title="Làm mới lịch trình" />}
              onClick={(e) => props.handleRefreshScheduleInformation(busSchedule?.id)}
            />
          </Stack>
        </td>
      </tr >
    );
  });
  return (
    <>
      {ModalHTML}
      <table style={{ width: '100%', textAlign: 'center' }} className="bom-table-bus">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tuyến đường</th>
            <th>Giờ đi - giờ đến</th>
            <th>Giá vé</th>
            <th>Ngày có hiệu lực</th>
            <th>Ngày hết hạn</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>{ListBusScheduleHTML}</tbody>
      </table>
    </>
  );
}