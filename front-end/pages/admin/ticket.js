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
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useState, useCallback, useRef, useEffect } from 'react';
import { GoLocation } from 'react-icons/go';
import { MdOutlineSwapHorizontalCircle } from 'react-icons/md';
import { Seat12User } from '@/components/vehicle';
import LocationPickAndDrop from '@/components/ticket/location-pick-and-drop';

export default function Ticket(props) {
  const toastRef = useRef();
  const toast = useToast();
  const [userNameData, setUserNameData] = useState('');

  const [seatInformation, setSeatInformation] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [startLocation, setStartLocation] = useState(47);
  const [listBusSchedule, setListBusSchedule] = useState([]);
  const [endLocation, setEndLocation] = useState(14);
  const [departureDay, setDepartureDay] = useState();
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
    const updateDepartureDate = await axios.put(
      `http://localhost:${props.port}/transport/update-transport`,
      submitData,
      {
        headers: { token: props.token },
      }
    );
    if (updateDepartureDate.data.statusCode == 200) {
      setModalStatus(false);
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
      const updateTransactionById = await axios.put(
        `http://localhost:${props.port}/transaction/update-transaction`,
        submitData,
        {
          headers: { token: props.token },
        }
      );
    }
    setSeatCustomerSelected(cloneSeatCustomerSelected);
    setTransportData(cloneData);
  }, [seatCustomerSelected, transportData, seatSelected, scheduleData]);

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
          // addStatus = true;
        } else {
          addStatus = false;
        }
      });
      setEditButtonStatus(editStatus);
      setDeleteButtonStatus(deleteStatus);
      setAddButtonStatus(addStatus);
    },
    [seatSelected, seatCustomerSelected]
  );

  const searchBusSchedule = useCallback(async () => {
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
    const listBusSchedule = await axios.post(
      `http://localhost:${props.port}/bus-schedule/list-bus-schedule-all`,
      submitData
    );
    if (listBusSchedule.data.statusCode == 200) {
      setListBusSchedule(listBusSchedule.data.data.list_bus_schedule);
    }
  }, [startLocation, endLocation, departureDay, error]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserNameData(window.localStorage.getItem('user_name'));
    }
    if (props.totalRenewal && props.totalRenewal > 0) {
      let toastRenew = setTimeout(() => {
        toastRef.current = toast({
          title: 'Lịch trình xe cần được cập nhật.',
          description: `Có ${props.totalRenewal} lịch trình sắp hết hạn`,
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
  }, []);

  const cityOption =
    props.list_city &&
    props.list_city.map((city) => <option value={city.id}>{city.city_name}</option>);

  const ListBusScheduleHTML = listBusSchedule.map((schedule, position) => {
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
                <Stack>
                  <Text>{convertTime(schedule.time_from, 0)}</Text>
                  <Flex marginTop="0 !important">
                    <Text marginRight={'5px'}>-----</Text>
                    <Text>{number_seat_selected + '/' + vehicle.bus[0].number_seat}</Text>
                  </Flex>
                </Stack>
              </Box>
            );
          })
          : null}
      </>
    );
  });

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
            {new Date(formatDate(transportData?.departure_date)).toLocaleDateString()} ; Tuyến:{' '}
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
          <Button
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
          </Button>
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
      />
    ) : null;

  const LocationHTML = (
    <LocationPickAndDrop transportData={transportData} scheduleData={scheduleData} />
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
        <Text marginRight="1%">{userNameData}</Text>
        <Image
          borderRadius="full"
          boxSize="50px"
          src="https://bit.ly/dan-abramov"
          alt="Nguyễn Văn A"
        />
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
        <Flex maxW={'100%'} overflowX={'auto'}>
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
  const getTotalRenewal = await axios.get(
    `http://localhost:${process.env.BACK_END_PORT}/bus-schedule/check-renewal-bus-schedule`
  );
  return {
    props: {
      port: process.env.BACK_END_PORT,
      list_city: getListCity.data.data?.listCity,
      totalRenewal: getTotalRenewal.data.data.totalBSNeedRenewal,
    },
  };
}
