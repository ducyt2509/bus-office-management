import axios from 'axios';
import {
  InputGroup,
  Flex,
  Button,
  Text,
  Stack,
} from '@chakra-ui/react';
import { GoLocation } from 'react-icons/go';
import { MdOutlineSwapHorizontalCircle } from 'react-icons/md';
import { useState, useCallback } from 'react';
import ListBusSchedule from '@/src/components/bus-schedule/bus-schedule-ticket';
import { MdOutlineBusAlert } from 'react-icons/md';

export default function BusScheduleAll(props) {
  const [startLocation, setStartLocation] = useState(props.data.departure_location_id);
  const [listBusSchedule, setListBusSchedule] = useState(props.list_bus_schedule);
  const [endLocation, setEndLocation] = useState(props.data.arrive_location_id);
  const [departureDay, setDepartureDay] = useState(props.data.refresh_date);
  const [action, setAction] = useState('');
  const [error, setError] = useState({
    from: false,
    to: false,
    date: false,
  });
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
    };
    try {
      const listBusSchedule = await axios.post(
        `http://localhost:${props.port}/bus-schedule/list-bus-schedule-all`,
        submitData
      );
      if (listBusSchedule.data.statusCode == 200) {
        setListBusSchedule(listBusSchedule.data.data.list_bus_schedule);
        setAction('search');
        setTimeout(() => {
          setAction('');
        }, 500);
      }
    } catch (err) {
      if (err.response.data.statusCode == 401) {
        toastIdRef.current = toast({
          title: 'Phiên của bạn đã hết hạn',
          description: 'Phiên đã hết hạn vui lòng đăng nhập lại',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      } else {
        toastIdRef.current = toast({
          title: err.response.data.data.message,
          description: 'Xảy ra lỗi khi lấy danh sách hành trình. Vui lòng thử lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    }
  }, [startLocation, endLocation, departureDay, error]);

  const cityOption =
    props.list_city &&
    props.list_city.map((city) => <option value={city.id}>{city.city_name}</option>);

  const listBusScheduleHTML = listBusSchedule.length ? (
    listBusSchedule.map((busSchedule) => {
      return <ListBusSchedule data={busSchedule} departureDay={departureDay} action={action} />;
    })
  ) : (
        <Stack fontSize={'200px'} alignItems={"center"} marginTop="7%">
          <MdOutlineBusAlert />
          <Text display={'flex'} fontWeight={'700'} fontSize={'20px'} alignItems={'center'}  color={'#F26A4C'}>
            Hiện không có chuyến xe nào hoạt động
          </Text>
          <Text fontSize={'18px'} fontWeight="500">Vui lòng thử đổi chuyến xe hoặc đổi ngày xuất phát</Text>
        </Stack>
  );

  return (
    <>
      <Flex className={'bom-schedule-book-ticket'}>
        <Flex className="bom-element">
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
          className="bom-element"
          onClick={handleSwapLocation}
          cursor={'pointer'}
        />
        <Flex className="bom-element">
          <GoLocation />
          <select value={endLocation} onChange={handleChangeEndLocation}>
            {cityOption}
          </select>
        </Flex>
        <span className="bom-element">|</span>
        <InputGroup className="bom-element">
          <input
            type="date"
            placeholder="Phone number"
            onChange={handleChangeDepartureDay}
            value={departureDay}
            min={new Date().toISOString().split('T')[0]}
          />
        </InputGroup>
        <Button
          backgroundColor={'#F26A4C'}
          color={'#fff'}
          padding={'10px 0'}
          className="bom-element"
          onClick={searchBusSchedule}
        >
          Tìm kiếm
        </Button>
      </Flex>
      {listBusScheduleHTML}
    </>
  );
}
export async function getServerSideProps(context) {
  const data = context.query;
  data.offset = 0;
  data.limit = 5;
  const port = process.env.BACK_END_PORT;
  let list_bus_schedule = [];
  let list_city = [];
  const [listBusSchedule, getListCity] = await Promise.all([
    axios.post(`http://localhost:${port}/bus-schedule/list-bus-schedule-all`, data),
    axios.post(`http://localhost:${process.env.BACK_END_PORT}/city/list-city`),
  ]);
  if (listBusSchedule.data.statusCode == 200) {
    list_bus_schedule = listBusSchedule.data.data.list_bus_schedule;
  }
  if (getListCity.data.statusCode == 200) {
    list_city = getListCity.data.data?.listCity;
  }

  return {
    props: {
      port,
      list_bus_schedule: list_bus_schedule,
      data,
      list_city: list_city,
    }, // will be passed to the page component as props
  };
}
