import { actions, useStore } from '@/src/store';
import { Text, Flex, Stack, Box, Input, StackDivider, useToast } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { IoPersonOutline } from 'react-icons/io5';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { convertTime } from '@/helper';
import Cookies from 'js-cookie';
import { MdOutlineBusAlert } from 'react-icons/md';

export default function DriverPage(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState();
  const [state, dispatch, axiosJWT] = useStore();
  const router = useRouter();
  const [listSchedule, setListSchedule] = useState([]);
  const [numberSchedule, setNumberSchedule] = useState(0);
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);

  const getBusScheduleList = useCallback(
    async (date) => {
      try {
        const listBusSchedule = await axios.post(
          `http://localhost:${props.port}/bus-schedule/list-bus-schedule-driver`,
          {
            user_id: userId,
            departure_date: date,
          },
          {
            headers: {
              token: token,
            },
          }
        );
        if (listBusSchedule.data.statusCode === 200) {
          setListSchedule(listBusSchedule.data.data.list_bus_schedule);
          setNumberSchedule(listBusSchedule.data.data.number_bus_schedule);
        }
      } catch (err) {
        toastIdRef.current = toast({
          title: 'Phiên của bạn đã hết hạn',
          description: 'Phiên đã hết hạn vui lòng đăng nhập lại',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    },
    [token, userId]
  );

  const handleChangeDepartureDate = useCallback(
    (value) => {
      setDepartureDate(value);
      getBusScheduleList(value);
    },
    [departureDate, token]
  );

  const handleGetBusScheduleInformation = useCallback(
    (id) => {
      let location = listSchedule[0].city_from + ' - ' + listSchedule[0].city_to;
      location = location
        .split(' - ')
        .map((e) => {
          return e
            .split(' ')
            .map((c) => c[0])
            .join('');
        })
        .join(' - ');
      router.push({
        pathname: '/driver/[id]',
        query: {
          id: id,
          transport_id: id,
          date_detail: departureDate,
          location: location,
        },
      });
    },
    [departureDate, listSchedule]
  );

  const listBusScheduleHTML = listSchedule.length ? (
    listSchedule.map((schedule, index) => {
      return (
        <>
          <Box
            w="90%"
            margin="0 auto"
            onClick={() => handleGetBusScheduleInformation(schedule.transport_id)}
          >
            <Flex>
              <Text color={'#F26A4C'} fontSize={'35px'} fontWeight={'500'} width={'35%'}>
                {convertTime(schedule.time_from, 0)}
              </Text>
              <Stack fontSize={'19px'} fontWeight={'500'} color={'#363636'} width={'65%'}>
                <Text>{schedule.city_from + ' - ' + schedule.city_to}</Text>
                <Flex alignItems={'center'}>
                  <IoPersonOutline />
                  <Text marginLeft={'4%'}>
                    Số Ghế : {schedule.number_seat_sold}/{schedule.number_seat}
                  </Text>
                </Flex>
              </Stack>
            </Flex>
          </Box>
          {index == listSchedule.length - 1 && (
            <hr style={{ borderBottom: '1px solid #000', marginTop: '4%' }} />
          )}
        </>
      );
    })
  ) : (
    <Stack fontSize={'200px'} alignItems={'center'} marginTop="7%">
      <MdOutlineBusAlert />
      <Text
        display={'flex'}
        fontWeight={'700'}
        fontSize={'19px'}
        alignItems={'center'}
        color={'#F26A4C'}
      >
        Không có chuyến xe hoạt động
      </Text>
      <Text fontSize={'18px'} fontWeight="500">
        Vui lòng thử đổi ngày xuất phát
      </Text>
    </Stack>
  );

  useEffect(() => {
    let userData = Cookies.get('dataUser') ? Cookies.get('dataUser') : '';
    let accessToken = '';
    try {
      userData = JSON.parse(userData);
      accessToken = `Bearer ${userData?.token}`;
    } catch (error) {
      userData = {};
      accessToken = `Bearer `;
    }
    dispatch(actions.setDataUser(userData));
    setToken(accessToken);
    setUserId(userData?.id);
    if (token && userId) {
      getBusScheduleList(new Date().toISOString().split('T')[0]);
    }
  }, [token, userId]);

  return (
    <>
      <Stack
        divider={<StackDivider />}
        spacing="5"
        width={'90%'}
        margin={'0 auto'}
        className="bom-driver-screen"
      >
        <Box marginTop="20%">
          <Text fontSize={'30px'} fontWeight={'500'} color={'#363636'} marginBottom="5%">
            Danh Sách Chuyến
          </Text>
          <Input
            value={departureDate}
            type="date"
            border={'1px solid #000!important'}
            marginBottom="5%"
            height={'40px'}
            fontSize={'18px'}
            onChange={(e) => handleChangeDepartureDate(e.target.value)}
          />
          <Text fontSize={'18px'}>
            {numberSchedule} chuyến <InfoIcon />
          </Text>
        </Box>
        {listBusScheduleHTML}
      </Stack>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      port: process.env.BACK_END_PORT,
    }, // will be passed to the page component as props
  };
}
