import {
  Card,
  Flex,
  Text,
  Image,
  Heading,
  Select,
  CardBody,
  CardFooter,
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '@/src/store';
import axios from 'axios';
import ListRouteOnBusSchedule from '@/components/bus-schedule/ListRouteOnBusSchedule';
import ListBusOnBusSchedule from '@/components/bus-schedule/ListBusOnBusSchedule';
import ListLocationOnBusSchedule from '@/components/bus-schedule/ListLocationOnBusSchedule';
import ListLocationBusSchedule from '@/components/bus-schedule/ListLocationBusSchedule';
import { convertInt, convertTime, calcDate, validate } from '@/helper';

export default function BusScheduleDetail(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const router = useRouter();
  const [state, dispath] = useStore();
  const [data, setData] = useState();
  const [error, setError] = useState({
    route: false,
    price: false,
    timeFrom: false,
    departureLocationId: false,
    arriveLocationId: false,
    travelTime: false,
    effectiveDate: false,
    scheduleStatus: false,
    scheduleExpire: false,
    scheduleFrequency: false,
    refreshDate: false,
  });

  const [BusSchedule, setBusSchedule] = useState([]);

  const [route, setRoute] = useState();
  const [price, setPrice] = useState();
  const [timeFrom, setTimeFrom] = useState();
  const [departureLocationId, setDepartureLocationId] = useState();
  const [arriveLocationId, setArriveLocationId] = useState();
  const [travelTime, setTravelTime] = useState();
  const [effectiveDate, setEffectiveDate] = useState();
  const [scheduleStatus, setScheduleStatus] = useState('1');
  const [scheduleExpire, setScheduleExpire] = useState();
  const [scheduleFrequency, setScheduleFrequency] = useState();
  const [refreshDate, setRefreshDate] = useState();

  const [locationPickup, setLocationPickup] = useState([]);
  const [addressPickup, setAddressPickup] = useState([]);

  const [locationDropOff, setLocationDropOff] = useState([]);
  const [addressDropOff, setAddressDropOff] = useState([]);

  const handleChangeTimeForm = (e) => {
    let value = e.target.value;
    let oldError = { ...error };
    if (!value) {
      oldError.timeFrom = true;
    } else {
      oldError.timeFrom = false;
    }
    setError(oldError);
    setTimeFrom(value);
  };

  const handleChangeTravelTime = (e) => {
    let value = e.target.value;
    let oldError = { ...error };
    if (!value || !value.match(validate.float)) {
      oldError.travelTime = true;
    } else {
      oldError.travelTime = false;
    }
    setError(oldError);
    setTravelTime(value);
  };

  const handleChangePrice = (e) => {
    let value = e.target.value;
    let oldError = { ...error };
    if (!value || !value.match(validate.float)) {
      oldError.price = true;
    } else {
      oldError.price = false;
    }
    setError(oldError);
    setPrice(value);
  };

  const handleChangeScheduleStatus = (e) => {
    let value = e.target.value;
    let oldError = { ...error };
    if (!value) {
      oldError.scheduleStatus = true;
    } else {
      oldError.scheduleStatus = false;
    }
    setError(oldError);
    setScheduleStatus(value);
  };

  const handleChangeScheduleFrequency = (e) => {
    let value = e.target.value;
    let oldError = { ...error };
    if (!value || !value.match(validate.number)) {
      oldError.scheduleFrequency = true;
    } else {
      oldError.scheduleFrequency = false;
    }
    setError(oldError);
    setScheduleFrequency(value);
  };

  const handleChangeScheduleExpire = (e) => {
    let value = e.target.value;
    let oldError = { ...error };
    if (!value || !value.match(validate.number)) {
      oldError.scheduleExpire = true;
    } else {
      oldError.scheduleExpire = false;
    }
    setError(oldError);
    setScheduleExpire(value);
  };
  const handleChangeEffectiveDate = (e) => {
    let value = e.target.value;
    let oldError = { ...error };
    if (!value) {
      oldError.effectiveDate = true;
    } else {
      oldError.effectiveDate = false;
    }
    setError(oldError);
    setEffectiveDate(value);
  };

  const handleSubmitData = useCallback(async () => {
    let oldError = { ...error };
    if (!route) {
      oldError.route = true;
    }
    if (!price) {
      oldError.price = true;
    }
    if (!timeFrom) {
      oldError.timeFrom = true;
    }
    if (!departureLocationId) {
      oldError.departureLocationId = true;
    }
    if (!arriveLocationId) {
      oldError.arriveLocationId = true;
    }
    if (!travelTime) {
      oldError.travelTime = true;
    }
    if (!effectiveDate) {
      oldError.effectiveDate = true;
    }
    if (!scheduleStatus) {
      oldError.scheduleStatus = true;
    }
    if (!scheduleExpire) {
      oldError.scheduleExpire = true;
    }
    if (!scheduleFrequency) {
      oldError.scheduleFrequency = true;
    }
    if (
      oldError.route ||
      oldError.price ||
      oldError.timeFrom ||
      oldError.departureLocationId ||
      oldError.arriveLocationId ||
      oldError.travelTime ||
      oldError.effectiveDate ||
      oldError.scheduleStatus ||
      oldError.scheduleExpire ||
      oldError.scheduleFrequency
    ) {
      setError(oldError);
      return;
    }
    const submitData = {
      bus_schedule: {
        route_id: route,
        price: price,
        travel_time: travelTime,
        time_from: convertInt(timeFrom),
        departure_location_id: departureLocationId,
        arrive_location_id: arriveLocationId,
        bus_schedule_status: scheduleStatus,
        schedule_frequency: scheduleFrequency,
        bus_schedule_expire: scheduleExpire,
        effective_date: effectiveDate,
      },

      location_bus_schedule: [
        {
          bus_detail: JSON.stringify(locationPickup),
          bus_location_type: 1,
          bus_location_address: JSON.stringify(addressPickup),
        },
        {
          bus_detail: JSON.stringify(locationDropOff),
          bus_location_type: 0,
          bus_location_address: JSON.stringify(addressDropOff),
        },
      ],
    };
    if (BusSchedule && BusSchedule.length && BusSchedule[0].id) {
      submitData.bus_schedule.id = BusSchedule[0].id;
      submitData.bus_schedule.refresh_date = calcDate(refreshDate, scheduleFrequency);
      const updateBusSchedule = await axios.put(
        `http://localhost:${props.BACK_END_PORT}/bus-schedule/update-bus-schedule`,
        submitData,
        { headers: state.accessToken }
      );
      if (updateBusSchedule.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Bus schedule updated.',
          description: "We've updated bus schedule for you.",
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        setTimeout(() => {
          router.push('/admin/management/bus-schedule');
        }, 2000);
      } else {
        toastIdRef.current = toast({
          title: 'Bus schedule cant updated.',
          description: 'Having some error when update bus schedule. PLease try again',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    } else {
      submitData.bus_schedule.refresh_date = calcDate(new Date(), scheduleFrequency);
      const createBusSchedule = await axios.post(
        `http://localhost:${props.BACK_END_PORT}/bus-schedule/create-bus-schedule`,
        submitData,
        { headers: state.accessToken }
      );
      if (createBusSchedule.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Bus schedule created.',
          description: "We've created bus schedule for you.",
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        setTimeout(() => {
          router.push('/admin/management/bus-schedule');
        }, 2000);
      } else {
        toastIdRef.current = toast({
          title: 'Bus schedule cant created.',
          description: 'Having some error when create bus schedule. PLease try again',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    }
  }, [
    BusSchedule,
    route,
    price,
    error,
    timeFrom,
    departureLocationId,
    arriveLocationId,
    travelTime,
    effectiveDate,
    scheduleStatus,
    scheduleExpire,
    scheduleFrequency,
    locationPickup,
    locationDropOff,
    addressDropOff,
    addressPickup,
  ]);

  const getBusScheduleById = useCallback(
    async (id) => {
      const getBusScheduleById = await axios.post(
        `http://localhost:${props.BACK_END_PORT}/bus-schedule/bus-schedule-by-id`,
        {
          id: id,
        },
        {
          headers: {
            token: state.dataUser.accessToken,
          },
        }
      );
      if (getBusScheduleById) {
        const dataBusSchedule = getBusScheduleById.data.data.bus_schedule[0];
        const time_from = convertTime(dataBusSchedule.time_from, 0);
        let date_start = new Date(dataBusSchedule.effective_date).toISOString().split('T')[0];
        setBusSchedule(getBusScheduleById.data.data.bus_schedule);
        setRoute(dataBusSchedule.route_id);
        setPrice(dataBusSchedule.price);
        setTimeFrom(time_from);
        setTravelTime(dataBusSchedule.travel_time);
        setDepartureLocationId(dataBusSchedule.departure_location_id);
        setArriveLocationId(dataBusSchedule.arrive_location_id);
        setEffectiveDate(date_start);
        setScheduleStatus(dataBusSchedule.bus_schedule_status);
        setScheduleExpire(dataBusSchedule.bus_schedule_expire);
        setScheduleFrequency(dataBusSchedule.schedule_frequency);
        setRefreshDate(dataBusSchedule.refresh_date);
      }
    },
    [state]
  );
  useEffect(() => {
    const id = router.query.id;
    const data = {};
    if (id != 'add') {
      getBusScheduleById(id);
    }
  }, []);
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
        <Text marginRight="1%">{state.dataUser.user_name}</Text>
        <Image
          borderRadius="full"
          boxSize="50px"
          src={state.dataUser.avatar ? state.dataUser.avatar : 'https://bit.ly/dan-abramov'}
          alt="Dan Abramov"
        />
      </Flex>
      <div style={{ width: '90%', margin: '0 auto' }}>
        <Heading size="lg" marginBottom={'3%'} textAlign={'center'}>
          {router.query.id == 'add' ? 'Thêm lịch trình' : 'Chỉnh sửa thông tin lịch trình'}
        </Heading>
        {}
        <Card
          margin={'0 auto'}
          border={'1px solid'}
          borderRadius={'50px'}
          className={'bom-bus-schedule-detail'}
          marginBottom={'10%'}
          width={'80%'}
        >
          <CardBody>
            <Box marginTop={'8%'}>
              <FormControl isInvalid={error.route} isRequired>
                <Box display={'flex'}>
                  <FormLabel>Tuyến đường:</FormLabel>
                  <ListRouteOnBusSchedule
                    state={state}
                    BACK_END_PORT={props.BACK_END_PORT}
                    route={route}
                    setRoute={setRoute}
                    error={error}
                    setError={setError}
                    setLocationPickup={setLocationPickup}
                    setAddressPickup={setAddressPickup}
                    setLocationDropOff={setLocationDropOff}
                    setAddressDropOff={setAddressDropOff}
                    setDepartureLocationId={setDepartureLocationId}
                    setArriveLocationId={setArriveLocationId}
                  />
                </Box>
                <FormErrorMessage justifyContent={'flex-end'}>
                  Tuyến đường là bắt buộc
                </FormErrorMessage>
              </FormControl>
            </Box>

            <Box>
              <FormControl isInvalid={error.timeFrom} isRequired>
                <Box display={'flex'}>
                  <FormLabel>Giờ khởi hành:</FormLabel>
                  <Input type={'time'} value={timeFrom} onChange={handleChangeTimeForm} />
                </Box>
                <FormErrorMessage justifyContent={'flex-end'}>
                  Giờ khởi hành là bắt buộc
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box>
              <FormControl isInvalid={error.travelTime} isRequired>
                <Box display={'flex'}>
                  <FormLabel>Thời gian di chuyển:</FormLabel>
                  <InputGroup>
                    <Input value={travelTime} onChange={handleChangeTravelTime} />
                    <InputRightAddon children="giờ" />
                  </InputGroup>
                </Box>
                <FormErrorMessage justifyContent={'flex-end'}>
                  {travelTime
                    ? 'Thời gian di chuyển sai định dạng'
                    : 'Thời gian di chuyển là bắt buộc'}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box>
              <FormControl isInvalid={error.departureLocationId} isRequired>
                <Box display={'flex'}>
                  <FormLabel>Điểm xuất phát:</FormLabel>
                  <ListLocationOnBusSchedule
                    state={state}
                    BACK_END_PORT={props.BACK_END_PORT}
                    location={departureLocationId}
                    data={BusSchedule}
                    error={error}
                    route={route}
                    setError={setError}
                    setLocation={setDepartureLocationId}
                    id={3}
                  />
                </Box>
                <FormErrorMessage justifyContent={'flex-end'}>
                  Điểm xuất phát là bắt buộc
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box>
              <FormControl isInvalid={error.arriveLocationId} isRequired>
                <Box display={'flex'}>
                  <FormLabel>Điểm kết thúc:</FormLabel>
                  <ListLocationOnBusSchedule
                    state={state}
                    route={route}
                    data={BusSchedule}
                    BACK_END_PORT={props.BACK_END_PORT}
                    error={error}
                    setError={setError}
                    location={arriveLocationId}
                    setLocation={setArriveLocationId}
                    id={4}
                  />
                </Box>
                <FormErrorMessage justifyContent={'flex-end'}>
                  Điểm kết thúc là bắt buộc
                </FormErrorMessage>
              </FormControl>
            </Box>

            <Flex>
              <FormLabel>Điểm đón:</FormLabel>
              <ListLocationBusSchedule
                list={BusSchedule[0]?.location_bus_schedule}
                listLocation={locationPickup}
                listAddress={addressPickup}
                setListAddress={setAddressPickup}
                setListLocation={setLocationPickup}
                id={5}
                state={state}
                BACK_END_PORT={props.BACK_END_PORT}
              />
            </Flex>
            <Flex>
              <FormLabel>Điểm trả:</FormLabel>
              <ListLocationBusSchedule
                list={BusSchedule[0]?.location_bus_schedule}
                id={6}
                listLocation={locationDropOff}
                listAddress={addressDropOff}
                setListAddress={setAddressDropOff}
                setListLocation={setLocationDropOff}
                state={state}
                BACK_END_PORT={props.BACK_END_PORT}
              />
            </Flex>

            <Box>
              <FormControl isInvalid={error.price} isRequired>
                <Box display={'flex'}>
                  <FormLabel>Giá vé:</FormLabel>
                  <Input value={price} onChange={handleChangePrice} />
                </Box>
                <FormErrorMessage justifyContent={'flex-end'}>
                  {price ? 'Giá vé sai định dạng' : 'Giá vé là bắt buộc'}
                </FormErrorMessage>
              </FormControl>
            </Box>

            <Box>
              <FormControl isRequired>
                <Box display={'flex'}>
                  <FormLabel>Trạng thái lịch trình hoạt động:</FormLabel>
                  <Select value={scheduleStatus} onChange={handleChangeScheduleStatus}>
                    <option value={'0'}>Không hoạt động</option>
                    <option value={'1'}>Hoạt động</option>
                  </Select>
                </Box>
              </FormControl>
            </Box>

            <Box>
              <FormControl isInvalid={error.scheduleFrequency} isRequired>
                <Box display={'flex'}>
                  <FormLabel marginBottom="0">Tần suất xe hoạt động:</FormLabel>
                  <InputGroup>
                    <Input value={scheduleFrequency} onChange={handleChangeScheduleFrequency} />
                    <InputRightAddon children="ngày mỗi một chuyến" />
                  </InputGroup>
                </Box>
                <FormErrorMessage justifyContent={'flex-end'}>
                  {scheduleFrequency
                    ? 'Tần suất xe hoạt động sai định dạng'
                    : 'Tần suất xe hoạt động là bắt buộc'}
                </FormErrorMessage>
              </FormControl>
            </Box>

            <Box>
              <FormControl isInvalid={error.scheduleExpire} isRequired>
                <Box display={'flex'}>
                  <FormLabel marginBottom="0">Kỳ hạn cho phép khách đặt trước:</FormLabel>
                  <InputGroup>
                    <Input value={scheduleExpire} onChange={handleChangeScheduleExpire} />
                    <InputRightAddon children="ngày" />
                  </InputGroup>
                </Box>
                <FormErrorMessage justifyContent={'flex-end'}>
                  {scheduleExpire
                    ? 'Kỳ hạn cho phép khách đặt trước sai định dạng'
                    : 'Kỳ hạn cho phép khách đặt trước là bắt buộc'}
                </FormErrorMessage>
              </FormControl>
            </Box>

            <Box>
              <FormControl isInvalid={error.effectiveDate} isRequired>
                <Box display={'flex'}>
                  <FormLabel marginBottom="0">Ngày lịch trình có hiệu lực:</FormLabel>
                  <Input
                    type={'date'}
                    value={effectiveDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={handleChangeEffectiveDate}
                  />
                </Box>
                <FormErrorMessage justifyContent={'flex-end'}>
                  Ngày lịch trình có hiệu lực là bắt buộc
                </FormErrorMessage>
              </FormControl>
            </Box>
          </CardBody>
          <CardFooter justifyContent={'center'}>
            <Button onClick={handleSubmitData} colorScheme="linkedin">
              Gửi
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  const id = context.query.id;

  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
    },
  };
}
