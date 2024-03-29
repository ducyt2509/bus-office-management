import { formatDate } from '@/helper';
import { convertTime, validate } from '@/helper';
import {
  Text,
  Heading,
  InputGroup,
  Card,
  CardBody,
  Flex,
  Stack,
  Box,
  Image,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  CircularProgress,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useState, useCallback, useRef, useEffect } from 'react';
import { GoLocation } from 'react-icons/go';
import { MdOutlineSwapHorizontalCircle } from 'react-icons/md';
import {
  Seat12User,
  Seat22User,
  Seat38User,
  Seat40User,
  Seat44User,
} from '@/src/components/vehicle';
import LocationPickAndDrop from '@/src/components/ticket/location-pick-and-drop';
import { actions, useStore } from '@/src/store';
import Cookies from 'js-cookie';
import { MdOutlineBusAlert } from 'react-icons/md';

export default function Ticket(props) {
  const toastIdRef = useRef();
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [token, setToken] = useState('');
  const [state, dispatch, axiosJWT] = useStore();

  const [seatInformation, setSeatInformation] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [listBusSchedule, setListBusSchedule] = useState([]);
  const [startLocation, setStartLocation] = useState(0);
  const [endLocation, setEndLocation] = useState(0);
  const [departureDay, setDepartureDay] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleSelected, setScheduleSelected] = useState();
  const [scheduleData, setScheduleData] = useState();
  const [seatSelected, setSeatSelected] = useState([]);
  const [transportData, setTransportData] = useState();
  const [editButtonStatus, setEditButtonStatus] = useState(false);
  const [addButtonStatus, setAddButtonStatus] = useState(false);
  const [deleteButtonStatus, setDeleteButtonStatus] = useState(false);
  const [seatCustomerSelected, setSeatCustomerSelected] = useState([]);
  const [tabSelected, setTabSelected] = useState(1);
  const [modalStatus, setModalStatus] = useState(false);
  const [error, setError] = useState({
    from: false,
    to: false,
    date: false,
  });
  const handleOpenSeatInformation = useCallback(
    (data, id, status) => {
      let position;
      transportData.number_seat_selected
        .map((e) => e.seat)
        .forEach((element, index) => {
          if (element.includes(seatSelected[0])) {
            position = index;
          }
        });
      if (status == 'edit') {
        data = transportData.number_seat_selected[position];
      }
      if (!data || seatSelected.payment_status == 3) {
        if (!id) {
          setSeatInformation({ seat_selected: seatSelected });
        } else {
          setSeatInformation({ seat_selected: id });
        }
      } else {
        if (!id) {
          setSeatInformation({ ...data, seat_selected: seatSelected });
        } else {
          setSeatInformation({ ...data, seat_selected: id });
        }
      }
      onOpen();
    },
    [seatSelected, transportData]
  );

  const handleTotalRenewal = useCallback(async () => {
    try {
      const getTotalRenewal = await axiosJWT.get(
        `http://localhost:${props.port}/bus-schedule/check-renewal-bus-schedule`,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      if (getTotalRenewal.data.statusCode == 200) {
        let totalRenewal = getTotalRenewal.data.data.totalBSNeedRenewal;
        if (totalRenewal && totalRenewal > 0) {
          let toastRenew = setTimeout(() => {
            toastIdRef.current = toast({
              title: 'Lịch trình xe cần được cập nhật.',
              description: `Có ${totalRenewal} lịch trình sắp hết hạn`,
              status: 'warning',
              isClosable: true,
              position: 'top',
              duration: 10000,
            });
          }, 3000);
          return () => {
            clearTimeout(toastRenew);
          };
        }
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
          description: 'Xảy ra lỗi khi thao tác. Làm ơn hãy thử lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    }
  }, [token]);

  const handleDisembark = useCallback(async () => {
    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    let submitData = {
      id: transportData.id,
      bus_id: transportData.bus_id,
      bus_schedule_id: transportData.bus_schedule_id,
      departure_date: new Date(transportData.departure_date)
        .addDays(scheduleData.schedule_frequency)
        .toISOString(),
    };
    try {
      const updateDepartureDate = await axiosJWT.put(
        `http://localhost:${props.port}/transport/update-transport`,
        submitData,
        {
          headers: { token: `Bearer ${state.dataUser.token}` },
        }
      );
      if (updateDepartureDate.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Xe đã xuất bến',
          description: 'Chúng tôi đã cập nhật hành trình xe cho bạn.',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
      setModalStatus(false);
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
          description: 'Có lỗi xảy ra trong quá trình thao tác làm ơn hãy thử lại',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    }
  }, [scheduleData, transportData, scheduleSelected]);

  const cancelTicket = useCallback(async () => {
    let cloneSeatCustomerSelected = [...seatCustomerSelected];
    let cloneData = { ...transportData };
    let seat = cloneData.number_seat_selected.map((s) => s.seat);
    for (let i = 0; i < seat.length; i++) {
      for (let j = 0; j < seatSelected.length; j++) {
        if (seat[i].includes(seatSelected[j])) {
          let s = seat[i].split(', ');
          s.splice(s.indexOf(seatSelected[j]), 1);
          seat[i] = s.join(', ');
        }
      }
    }
    cloneData.number_seat_selected.forEach((s, i) => {
      s.seat = seat[i];
    });
    cloneSeatCustomerSelected = cloneSeatCustomerSelected.filter((s) => !seatSelected.includes(s));
    for (let i = 0; i < cloneData.number_seat_selected.length; i++) {
      let submitData = { id: cloneData.number_seat_selected[i].id };
      if (!cloneData.number_seat_selected[i].seat) {
        submitData.payment_status = 3;
      } else {
        submitData.seat = cloneData.number_seat_selected[i].seat;
        submitData.ticket_price =
          cloneData.number_seat_selected[i].seat.split(', ').length *
          (scheduleData && scheduleData.price ? scheduleData.price : 0);
      }
      try {
        const updateTransactionById = await axiosJWT.put(
          `http://localhost:${props.port}/transaction/update-transaction`,
          submitData,
          {
            headers: { token: `Bearer ${state.dataUser.token}` },
          }
        );
        if (updateTransactionById.data.statusCode == 200) {
          toastIdRef.current = toast({
            title: 'Cập nhật thôn tin khách hàng thành công.',
            description: 'Chúng tôi đã cập nhật thông tin khách hàng cho bạn.',
            status: 'success',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
          setSeatCustomerSelected(cloneSeatCustomerSelected);
          setTransportData(cloneData);
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
            description: 'Thông tin khách hàng cập nhật thất bại. Vui lòng thử lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        }
      }
    }
  }, [seatCustomerSelected, transportData, seatSelected, scheduleData]);

  const getListBusSchedule = useCallback(async () => {
    if (!state.dataUser.id) {
      toastIdRef.current = toast({
        title: 'Phiên của bạn đã hết hạn',
        description: 'Phiên đã hết hạn vui lòng đăng nhập lại',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
      return;
    }
    const submitData = {
      refresh_date: new Date(),
      role_id: 1,
      type: 'get',
    };
    try {
      const listBusSchedule = await axios.post(
        `http://localhost:${props.port}/bus-schedule/list-bus-schedule-all`,
        submitData
      );
      if (listBusSchedule.data.statusCode == 200) {
        setListBusSchedule(listBusSchedule.data.data.list_bus_schedule);
        setScheduleSelected(0);
        setScheduleData();
        setTransportData();
        setSeatCustomerSelected([]);
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
          description: 'Không thể lấy danh sách hành trình',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    }
    setLoading(false);
  });
  const searchBusSchedule = useCallback(async () => {
    if (!state.dataUser.id) {
      toastIdRef.current = toast({
        title: 'Phiên của bạn đã hết hạn',
        description: 'Phiên đã hết hạn vui lòng đăng nhập lại',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
      return;
    }
    let oldError = { ...error };
    if (!startLocation) {
      oldError.from = true;
    }
    if (!endLocation) {
      oldError.to = true;
    }
    if (!departureDay) {
      oldError.date = true;
    }
    if (oldError.from || oldError.to || oldError.date) {
      setError(oldError);
      return;
    }
    const submitData = {
      departure_location_id: startLocation,
      arrive_location_id: endLocation,
      refresh_date: departureDay,
      role_id: 1,
    };
    setLoading(true);
    try {
      const listBusSchedule = await axios.post(
        `http://localhost:${props.port}/bus-schedule/list-bus-schedule-all`,
        submitData
      );
      if (listBusSchedule.data.statusCode == 200) {
        setListBusSchedule(listBusSchedule.data.data.list_bus_schedule);
        setScheduleSelected(0);
        setScheduleData();
        setTransportData();
        setSeatCustomerSelected([]);
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
          description: 'Không thể lấy danh sách hành trình',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 700);
  }, [startLocation, endLocation, departureDay, error, state]);

  const handleChangeStartLocation = (e) => {
    let value = e.target.value;
    let oldError = { ...error };
    if (!value) {
      oldError.from = true;
    } else {
      oldError.from = false;
    }
    setError(oldError);
    setStartLocation(value);
  };

  const handleChangeEndLocation = (e) => {
    let value = e.target.value;
    let oldError = { ...error };
    if (!value) {
      oldError.to = true;
    } else {
      oldError.to = false;
    }
    setError(oldError);
    setEndLocation(value);
  };

  const handleChangeDepartureDay = (e) => {
    let value = e.target.value;
    let oldError = { ...error };
    if (!value) {
      oldError.date = true;
    } else {
      oldError.date = false;
    }
    setError(oldError);
    setDepartureDay(value);
  };

  const handleSwapLocation = useCallback(() => {
    setEndLocation(startLocation);
    setStartLocation(endLocation);
  }, [startLocation, endLocation]);

  const handleSCheduleSelected = useCallback((id, schedule, transport) => {
    setScheduleSelected(id);
    setScheduleData(schedule);
    setTransportData(transport);
    setSeatCustomerSelected(
      transport.number_seat_selected
        .filter((e) => e.payment_status != 3)
        .map((e) => e.seat)
        .join()
        .split(',')
        .map((e) => e.trim())
    );
  });

  const handleSeatSelected = useCallback(
    (id) => {
      let cloneSeatSelected = [...seatSelected];
      if (!cloneSeatSelected.includes(id)) {
        cloneSeatSelected.push(id);
      } else {
        cloneSeatSelected.splice(cloneSeatSelected.indexOf(id), 1);
      }
      setSeatSelected(cloneSeatSelected);
      let editStatus = true;
      let deleteStatus = true;
      let addStatus = true;
      if (!cloneSeatSelected.length) {
        editStatus = false;
        deleteStatus = false;
        addStatus = false;
      }
      if (cloneSeatSelected.length > 1) {
        editStatus = false;
      }
      cloneSeatSelected.forEach((seat) => {
        if (!seatCustomerSelected.includes(seat)) {
          editStatus = false;
          deleteStatus = false;
        } else {
          addStatus = false;
        }
      });
      if (new Date() >= new Date(departureDay)) {
        editStatus = false;
        addStatus = false;
      }
      setEditButtonStatus(editStatus);
      setDeleteButtonStatus(deleteStatus);
      setAddButtonStatus(addStatus);
    },
    [seatSelected, seatCustomerSelected, departureDay]
  );

  useEffect(() => {
    let userData = Cookies.get('dataUser') ? Cookies.get('dataUser') : '';
    let accessToken = '';
    try {
      userData = JSON.parse(userData);
      accessToken = userData?.token;
    } catch (error) {
      userData = {};
    }
    dispatch(actions.setDataUser(userData));
    setToken(accessToken);
    if (token) {
      getListBusSchedule();
      if (userData?.role_id == 1) {
        handleTotalRenewal();
      }
    }
  }, [token]);

  const cityOption =
    props.list_city &&
    props.list_city.map((city) => (
      <option
        value={city.id}
        disabled={startLocation == city.id || endLocation == city.id ? true : false}
      >
        {city.city_name}
      </option>
    ));

  console.log(listBusSchedule);

  const ListBusScheduleHTML = loading ? (
    <CircularProgress isIndeterminate color="#ffbea8" marginTop="15%" />
  ) : listBusSchedule.length ? (
    listBusSchedule.map((schedule, position) => {
      return (
        <>
          {schedule && schedule.transport && schedule.transport.length
            ? schedule.transport.map((vehicle, index) => {
                const number_seat_selected =
                  vehicle.number_seat_selected &&
                  vehicle.number_seat_selected.length &&
                  vehicle.number_seat_selected.filter((e) => e.payment_status != 3).length
                    ? vehicle.number_seat_selected
                        .filter((e) => e.payment_status != 3)
                        .map((e) => e.seat)
                        .join()
                        .split(',').length
                    : 0;

                return (
                  <Box
                    border={'1px solid'}
                    borderRadius={'5px'}
                    padding={'0 1%'}
                    marginRight={'1%'}
                    minW={'80px'}
                    fontSize={'13px'}
                    fontWeight={'600'}
                    color={'#363636'}
                    cursor={'pointer'}
                    backgroundColor={position + '' + index == scheduleSelected ? '#F2CAC2' : '#fff'}
                    _hover={{ backgroundColor: '#F2CAC2' }}
                    maxH="60px"
                    onClick={() => handleSCheduleSelected(position + '' + index, schedule, vehicle)}
                  >
                    <Stack whiteSpace={'nowrap'}>
                      <Text>{convertTime(schedule.time_from, 0)}</Text>
                      <Flex marginTop="0 !important">
                        <Text marginRight={'5px'}>-----</Text>
                        <Text>{number_seat_selected + '/' + vehicle.bus[0]?.number_seat}</Text>
                      </Flex>
                    </Stack>
                  </Box>
                );
              })
            : null}
        </>
      );
    })
  ) : (
    <Stack fontSize={'200px'} alignItems={'center'} marginTop="7%">
      <MdOutlineBusAlert />
      <Text
        display={'flex'}
        fontWeight={'700'}
        fontSize={'20px'}
        alignItems={'center'}
        color={'#F26A4C'}
      >
        Hiện không có chuyến xe nào hoạt động
      </Text>
      <Text fontSize={'18px'} fontWeight="500">
        Vui lòng thử đổi chuyến xe hoặc đổi ngày xuất phát
      </Text>
    </Stack>
  );

  const ModalHTML = (
    <Modal isOpen={modalStatus}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody textAlign={'center'}>
          <Text fontSize={'20px'} fontWeight={'500'} margin="3% 0">
            Thông báo xuất bến
          </Text>
          <Text fontSize={'15.7px'} fontWeight={'400'} color={'#363636'}>
            Sau khi xe đã xuất bến, hành khách và nhân viên không thể đặt hay chỉnh sửa vé được nữa.
            Bạn có chắc chắn muốn xuất bến?
          </Text>
          <Flex justifyContent={'space-evenly'} margin="5% 0">
            <Button
              color={'#F26A4C'}
              backgroundColor={'#FFF'}
              border={'1px solid'}
              w="25%"
              onClick={() => setModalStatus(false)}
            >
              Huỷ
            </Button>
            <Button backgroundColor={'#F26A4C'} color={'#fff'} w="25%" onClick={handleDisembark}>
              Xác nhận
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  const ScheduleDataHTML =
    scheduleData && transportData ? (
      <Card border={'1px solid'} width={'100%'} margin={'0 auto'} marginTop={'2%'}>
        <CardBody>
          <Flex justifyContent={'space-between'} fontSize={'13px'}>
            <Stack>
              <Flex>
                <Text fontWeight="600" color={'#363636'}>
                  Biển số:&ensp;
                </Text>
                <Text fontWeight="600" color={'#363636'}>
                  {transportData?.bus[0].vehicle_plate}
                </Text>
              </Flex>
              <Flex>
                <Text fontWeight="600" color={'#363636'}>
                  Loại xe:&ensp;
                </Text>
                <Text fontWeight="600" color={'#363636'}>
                  {transportData?.bus[0].vehicle_type_name}
                </Text>
              </Flex>
            </Stack>
            <Stack>
              <Flex>
                <Text fontWeight="600" color={'#363636'}>
                  Tài xế:&ensp;
                </Text>
                <Text fontWeight="600" color={'#363636'}>
                  {transportData?.bus[0]?.main_driver}
                </Text>
              </Flex>
              <Flex>
                <Text fontWeight="600" color={'#363636'}>
                  Phụ xe:&ensp;
                </Text>
                <Text fontWeight="600" color={'#363636'}>
                  {transportData?.bus[0]?.support_driver}
                </Text>
              </Flex>
            </Stack>
            <Stack>
              <Flex>
                <Text fontWeight="600" color={'#363636'}>
                  Số vé đã đặt:&ensp;
                </Text>
                <Text fontWeight="600" color={'#363636'}>
                  {transportData.number_seat_selected &&
                  transportData.number_seat_selected.length &&
                  transportData.number_seat_selected.filter((e) => e.payment_status != 3).length
                    ? transportData.number_seat_selected
                        .filter((e) => e.payment_status != 3)
                        .map((e) => e.seat)
                        .join()
                        .split(',').length
                    : 0}
                </Text>
              </Flex>
              <Flex>
                <Text fontWeight="600" color={'#363636'}>
                  Số vé đã thanh toán:&ensp;
                </Text>
                <Text fontWeight="600" color={'#363636'}>
                  {transportData?.number_seat_sold}
                </Text>
              </Flex>
            </Stack>
          </Flex>
          <Text marginTop="1%" fontWeight={'600'}>
            Chi tiết: Chuyến {convertTime(scheduleData.time_from, 0) + ' '}; Ngày:{' '}
            {new Date(formatDate(departureDay)).toLocaleDateString()} ; Tuyến:{' '}
            {scheduleData?.city_from + ' - ' + scheduleData?.city_to}
          </Text>
        </CardBody>
      </Card>
    ) : null;

  const ButtonGroupHTML =
    scheduleData && transportData ? (
      <Flex marginTop="1%" justifyContent={'space-between'}>
        <Flex>
          {editButtonStatus && (
            <Button
              leftIcon={<EditIcon />}
              backgroundColor={'#fff'}
              border="1px solid"
              borderRadius={'5px'}
              marginRight={'15px'}
              onClick={() => handleOpenSeatInformation(null, null, 'edit')}
            >
              Sửa
            </Button>
          )}
          {deleteButtonStatus && (
            <Button
              leftIcon={<DeleteIcon />}
              backgroundColor={'#fff'}
              border="1px solid"
              marginRight={'15px'}
              borderRadius={'5px'}
              onClick={cancelTicket}
            >
              Huỷ vé
            </Button>
          )}
          {addButtonStatus && (
            <Button
              leftIcon={<AddIcon />}
              backgroundColor={'#fff'}
              border="1px solid"
              borderRadius={'5px'}
              onClick={handleOpenSeatInformation}
            >
              Thêm
            </Button>
          )}
        </Flex>
        <Flex>
          <Button
            backgroundColor={tabSelected == 1 ? '#F2CAC2' : '#fff'}
            border="1px solid"
            borderRadius={'5px'}
            marginRight={'15px'}
            onClick={() => setTabSelected(1)}
          >
            Đặt vé
          </Button>
          <Button
            backgroundColor={tabSelected == 2 ? '#F2CAC2' : '#fff'}
            border="1px solid"
            borderRadius={'5px'}
            marginRight={'15px'}
            onClick={() => setTabSelected(2)}
          >
            DS đón trả
          </Button>
          {/* <Button
            backgroundColor={tabSelected == 3 ? '#F2CAC2' : '#fff'}
            border="1px solid"
            borderRadius={'5px'}
            marginRight={'15px'}
            onClick={() => setTabSelected(3)}
          >
            Xuất phơi
          </Button>
          <Button
            backgroundColor={'#fff'}
            border="1px solid"
            borderRadius={'5px'}
            onClick={() => setModalStatus(true)}
          >
            Xuất bến
          </Button> */}
        </Flex>
      </Flex>
    ) : null;

  const VehicleHTML =
    scheduleData && transportData && transportData.bus[0]?.vehicle_type_id == 1 ? (
      <Seat12User
        data={transportData}
        setData={setTransportData}
        port={props.port}
        scheduleData={scheduleData}
        seatSelected={seatSelected}
        handleSeatSelected={handleSeatSelected}
        seatCustomerSelected={seatCustomerSelected}
        setSeatCustomerSelected={setSeatCustomerSelected}
        seatInformation={seatInformation}
        setSeatInformation={setSeatInformation}
        handleOpenSeatInformation={handleOpenSeatInformation}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        departureDay={departureDay}
        axiosJWT={axiosJWT}
        token={`Bearer ${state.dataUser.token}`}
        isEnableEdit={new Date() >= new Date(departureDay)}
      />
    ) : scheduleData && transportData && transportData.bus[0]?.vehicle_type_id == 2 ? (
      <Seat22User
        data={transportData}
        setData={setTransportData}
        port={props.port}
        scheduleData={scheduleData}
        seatSelected={seatSelected}
        handleSeatSelected={handleSeatSelected}
        seatCustomerSelected={seatCustomerSelected}
        setSeatCustomerSelected={setSeatCustomerSelected}
        seatInformation={seatInformation}
        setSeatInformation={setSeatInformation}
        handleOpenSeatInformation={handleOpenSeatInformation}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        departureDay={departureDay}
        axiosJWT={axiosJWT}
        token={`Bearer ${state.dataUser.token}`}
        isEnableEdit={new Date() >= new Date(departureDay)}
      />
    ) : scheduleData && transportData && transportData.bus[0]?.vehicle_type_id == 3 ? (
      <Seat38User
        data={transportData}
        setData={setTransportData}
        port={props.port}
        scheduleData={scheduleData}
        seatSelected={seatSelected}
        handleSeatSelected={handleSeatSelected}
        seatCustomerSelected={seatCustomerSelected}
        setSeatCustomerSelected={setSeatCustomerSelected}
        seatInformation={seatInformation}
        setSeatInformation={setSeatInformation}
        handleOpenSeatInformation={handleOpenSeatInformation}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        departureDay={departureDay}
        axiosJWT={axiosJWT}
        token={`Bearer ${state.dataUser.token}`}
        isEnableEdit={new Date() >= new Date(departureDay)}
      />
    ) : scheduleData && transportData && transportData.bus[0]?.vehicle_type_id == 4 ? (
      <Seat40User
        data={transportData}
        setData={setTransportData}
        port={props.port}
        scheduleData={scheduleData}
        seatSelected={seatSelected}
        handleSeatSelected={handleSeatSelected}
        seatCustomerSelected={seatCustomerSelected}
        setSeatCustomerSelected={setSeatCustomerSelected}
        seatInformation={seatInformation}
        setSeatInformation={setSeatInformation}
        handleOpenSeatInformation={handleOpenSeatInformation}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        departureDay={departureDay}
        axiosJWT={axiosJWT}
        token={`Bearer ${state.dataUser.token}`}
        isEnableEdit={new Date() >= new Date(departureDay)}
      />
    ) : scheduleData && transportData && transportData.bus[0]?.vehicle_type_id == 5 ? (
      <Seat44User
        data={transportData}
        setData={setTransportData}
        port={props.port}
        scheduleData={scheduleData}
        seatSelected={seatSelected}
        handleSeatSelected={handleSeatSelected}
        seatCustomerSelected={seatCustomerSelected}
        setSeatCustomerSelected={setSeatCustomerSelected}
        seatInformation={seatInformation}
        setSeatInformation={setSeatInformation}
        handleOpenSeatInformation={handleOpenSeatInformation}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        departureDay={departureDay}
        axiosJWT={axiosJWT}
        token={`Bearer ${state.dataUser.token}`}
        isEnableEdit={new Date() >= new Date(departureDay)}
      />
    ) : null;

  const LocationHTML = (
    <LocationPickAndDrop
      transportData={transportData}
      scheduleData={scheduleData}
      token={`Bearer ${state.dataUser.token}`}
      axiosJWT={axiosJWT}
    />
  );
  return (
    <div style={{ position: 'relative', left: '20%', width: '80%' }}>
      <Flex
        alignItems={'center'}
        justifyContent="flex-end"
        width={'84%'}
        margin="0 auto"
        marginBottom={'2%'}
        paddingTop="2%"
      >
        <Text marginRight="1%" fontWeight="500">
          {state.dataUser.user_name}
        </Text>
        <Image borderRadius="full" boxSize="50px" src="https://bit.ly/dan-abramov" />
      </Flex>
      <Box width="90%" margin="0 auto">
        <Heading>Đặt vé</Heading>
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          w="95%"
          marginTop={'2%'}
          marginBottom={'1%'}
        >
          <Flex className={'bom-schedule-book-ticket admin'}>
            <Flex className="bom-element admin">
              <GoLocation />
              <select
                value={startLocation}
                onChange={handleChangeStartLocation}
                placeholder="Chọn điểm xuất phát"
              >
                <option disabled value="0">
                  Chọn địa điểm
                </option>
                {cityOption}
              </select>
            </Flex>

            <MdOutlineSwapHorizontalCircle
              className="bom-element admin"
              onClick={handleSwapLocation}
              cursor={'pointer'}
            />
            <Flex className="bom-element admin">
              <GoLocation />
              <select value={endLocation} onChange={handleChangeEndLocation}>
                <option disabled value="0">
                  Chọn địa điểm
                </option>
                {cityOption}
              </select>
            </Flex>
            <span className="bom-element admin">|</span>
            <InputGroup className="bom-element admin">
              <input
                type="date"
                placeholder="Phone number"
                onChange={handleChangeDepartureDay}
                value={departureDay}
              />
            </InputGroup>
          </Flex>
          <Button
            backgroundColor={'#fff'}
            color={'#000'}
            border={'1px solid'}
            padding={'10px 20px'}
            className="bom-element admin"
            onClick={searchBusSchedule}
          >
            Tìm kiếm
          </Button>
        </Flex>
        <Flex
          maxW={'100%'}
          overflowX={'auto'}
          justifyContent={!listBusSchedule.length || loading ? 'center' : ''}
        >
          {ListBusScheduleHTML}
        </Flex>
        {ScheduleDataHTML}
        {ButtonGroupHTML}
        {tabSelected == 1 && VehicleHTML}
        {tabSelected == 2 && LocationHTML}
        {ModalHTML}
      </Box>
    </div>
  );
}
export async function getStaticProps() {
  const getListCity = await axios.post(
    `http://localhost:${process.env.BACK_END_PORT}/city/list-city`
  );

  return {
    props: {
      port: process.env.BACK_END_PORT,
      list_city: getListCity.data.data?.listCity,
    },
  };
}
