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
} from '@chakra-ui/react';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '@/src/store';
import axios from 'axios';
import ListRouteOnBusSchedule from '@/components/bus-schedule/ListRouteOnBusSchedule';
import ListBusOnBusSchedule from '@/components/bus-schedule/ListBusOnBusSchedule';
import ListLocationOnBusSchedule from '@/components/bus-schedule/ListLocationOnBusSchedule';
import ListLocationBusSchedule from '@/components/bus-schedule/ListLocationBusSchedule';
import { convertInt, convertTime } from '@/helper';

export default function BusScheduleDetail(props) {
  const router = useRouter();
  const [state, dispath] = useStore();
  const [data, setData] = useState();

  const [BusSchedule, setBusSchedule] = useState([]);

  const [route, setRoute] = useState();
  const [bus, setBus] = useState();
  const [price, setPrice] = useState();
  const [timeFrom, setTimeFrom] = useState();
  const [locationStartId, setLocationStartId] = useState();
  const [locationFinishId, setLocationFinishId] = useState();
  const [travelTime, setTravelTime] = useState();
  const [dateStart, setDateStart] = useState();
  const [scheduleStatus, setScheduleStatus] = useState();
  const [scheduleExpire, setScheduleExpire] = useState();
  const [scheduleFrequency, setScheduleFrequency] = useState();

  const [locationPickup, setLocationPickup] = useState([]);
  const [addressPickup, setAddressPickup] = useState([]);

  const [locationDropOff, setLocationDropOff] = useState([]);
  const [addressDropOff, setAddressDropOff] = useState([]);

  const handleSubmitData = useCallback(async () => {
    const submitData = {
      bus_schedule: {
        route_id: route,
        bus_id: bus,
        price: price,
        time_from: convertInt(timeFrom),
        location_start_id: locationStartId,
        location_finish_id: locationFinishId,
        travel_time: travelTime,
        date_start: dateStart,
        bus_schedule_status: scheduleStatus,
        schedule_frequency: scheduleFrequency,
        bus_schedule_expire: scheduleExpire,
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
    if (BusSchedule[0] && BusSchedule[0].id) {
      submitData.id = BusSchedule[0].id;
      const updateBusSchedule = await axios.put(
        `http://localhost:${props.BACK_END_PORT}/bus-schedule/update-bus-schedule`,
        submitData,
        { headers: state.accessToken }
      );
      if (updateBusSchedule.data.statusCode == 200) {
        console.log('update success');
      }
    } else {
      const createBusSchedule = await axios.post(
        `http://localhost:${props.BACK_END_PORT}/bus-schedule/create-bus-schedule`,
        submitData,
        { headers: state.accessToken }
      );
      if (createBusSchedule.data.statusCode == 200) {
        console.log('create success');
      }
    }
  }, [
    BusSchedule,
    route,
    bus,
    price,
    timeFrom,
    locationStartId,
    locationFinishId,
    travelTime,
    dateStart,
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
        const time_from = convertTime(getBusScheduleById.data.data.bus_schedule[0].time_from, 0);
        let date_start = new Date(getBusScheduleById.data.data.bus_schedule[0].date_start);
        date_start = date_start.toLocaleDateString().split('/').reverse();
        date_start = date_start.map((element) => {
          if (element.length == 1) {
            element = '0' + element;
          }
          return element;
        });
        date_start = date_start.join('-');
        setBusSchedule(getBusScheduleById.data.data.bus_schedule);
        setRoute(getBusScheduleById.data.data.bus_schedule[0].route_id);
        setBus(getBusScheduleById.data.data.bus_schedule[0].bus_id);
        setPrice(getBusScheduleById.data.data.bus_schedule[0].price);
        setTimeFrom(time_from);
        setTravelTime(getBusScheduleById.data.data.bus_schedule[0].travel_time);
        setLocationStartId(getBusScheduleById.data.data.bus_schedule[0].location_start_id);
        setLocationFinishId(getBusScheduleById.data.data.bus_schedule[0].location_finish_id);
        setDateStart(date_start);
        setScheduleStatus(getBusScheduleById.data.data.bus_schedule[0].bus_schedule_status);
        setScheduleExpire(getBusScheduleById.data.data.bus_schedule[0].bus_schedule_expire);
        setScheduleFrequency(getBusScheduleById.data.data.bus_schedule[0].schedule_frequency);
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
            <Flex marginTop={'8%'}>
              <span>Tuyến đường:</span>
              <ListRouteOnBusSchedule
                state={state}
                BACK_END_PORT={props.BACK_END_PORT}
                route={route}
                setRoute={setRoute}
              />
            </Flex>
            <Flex>
              <span>Biển số xe:</span>
              <ListBusOnBusSchedule
                state={state}
                BACK_END_PORT={props.BACK_END_PORT}
                bus={bus}
                setBus={setBus}
              />
            </Flex>
            <Flex>
              <span>Ngày khởi hành:</span>
              <Input
                type={'date'}
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
              />
            </Flex>
            <Flex>
              <span>Giờ khởi hành:</span>
              <Input type={'time'} value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} />
            </Flex>
            <Flex>
              <span>Thời gian di chuyển:</span>
              <InputGroup>
                <Input value={travelTime} onChange={(e) => setTravelTime(e.target.value)} />
                <InputRightAddon children="giờ" />
              </InputGroup>
            </Flex>
            <Flex>
              <span>Điểm xuất phát:</span>
              <ListLocationOnBusSchedule
                state={state}
                BACK_END_PORT={props.BACK_END_PORT}
                location={locationStartId}
                data={BusSchedule}
                setLocation={setLocationStartId}
                id={3}
              />
            </Flex>
            <Flex>
              <span>Điểm kết thúc:</span>
              <ListLocationOnBusSchedule
                state={state}
                data={BusSchedule}
                BACK_END_PORT={props.BACK_END_PORT}
                location={locationFinishId}
                setLocation={setLocationFinishId}
                id={4}
              />
            </Flex>
            <Flex>
              <span>Điểm đón:</span>
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
              <span>Điểm trả:</span>
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
            <Flex>
              <span>Giá vé:</span>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} />
            </Flex>
            <Flex>
              <span>Trạng thái lịch trình hoạt động:</span>
              <Select value={scheduleStatus} onChange={(e) => setScheduleStatus(e.target.value)}>
                <option value={'0'}>Không hoạt động</option>
                <option value={'1'}>Hoạt động</option>
              </Select>
            </Flex>
            <Flex>
              <span>Tần suất xe hoạt động:</span>
              <InputGroup>
                <Input
                  value={scheduleFrequency}
                  onChange={(e) => setScheduleFrequency(e.target.value)}
                />
                <InputRightAddon children="ngày mỗi một chuyến" />
              </InputGroup>
            </Flex>
            <Flex>
              <span>Kỳ hạn cho phép khách đặt trước:</span>
              <InputGroup>
                <Input value={scheduleExpire} onChange={(e) => setScheduleExpire(e.target.value)} />
                <InputRightAddon children="ngày" />
              </InputGroup>
            </Flex>
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
