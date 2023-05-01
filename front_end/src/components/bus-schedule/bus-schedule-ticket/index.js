import axios from 'axios';
import {
  Flex,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Box,
  StackDivider,
} from '@chakra-ui/react';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import LocationImage from '@/images/home/location.png';
import Image from 'next/image';
import { convertTime, formatMoney } from '@/helper';
import BusScheduleDetail from './BusScheduleDetail';
import BusScheduleBookTicket from './bus-schedule-book-ticket';
import { useCallback, useEffect, useState } from 'react';

export default function BusSchedulesList(props) {
  const [status, setStatus] = useState(
    props.data && props.data.transport && props.data.transport.length
      ? props.data.transport.map((element) => {
          return { status: '' };
        })
      : []
  );

  const time_from = convertTime(props.data.time_from, 0);
  const travel_time = convertTime(props.data.travel_time, 0).replace(':', ' giờ ') + ' phút';
  const time_end = convertTime(props.data.time_from, props.data.travel_time);
  const format_money = formatMoney(props.data.price);

  const handleActiveBusScheduleDetails = useCallback(
    (index) => {
      let cloneStatus = [...status];
      if (status[index]?.status == 'detail') {
        cloneStatus[index].status = '';
      } else {
        cloneStatus[index].status = 'detail';
      }
      setStatus(cloneStatus);
    },
    [status]
  );
  const handleActiveBusScheduleBookTicket = useCallback(
    (index) => {
      let cloneStatus = [...status];
      if (status[index]?.status == 'book') {
        cloneStatus[index].status = '';
      } else {
        cloneStatus[index].status = 'book';
      }
      setStatus(cloneStatus);
    },
    [status]
  );
  useEffect(() => {
    if (props.action == 'search') {
      setStatus(
        props.data && props.data.transport && props.data.transport.length
          ? props.data.transport.map((element) => {
              return { status: '' };
            })
          : []
      );
    }
  }, [props.action]);
  
  const html =
    props.data && props.data.transport && props.data.transport.length
      ? props.data.transport.map((vehicle, index) => {
          const number_seat_selected =
            vehicle.number_seat_selected && vehicle.number_seat_selected.length
              ? vehicle.number_seat_selected
                  .map((e) => e.seat)
                  .join()
                  .split(',').length
              : 0;
          const number_seat_unselected = vehicle.bus[0].number_seat - number_seat_selected;
          const remain_seat = number_seat_unselected
            ? number_seat_unselected + ' chỗ trống'
            : 'Hết chỗ';
          return (
            <Card className={'bom-schedule-detail'}>
              <CardHeader display="flex" justifyContent="space-between" paddingBottom={0}>
                <Text display={'flex'} fontWeight={'700'} fontSize={'20px'} alignItems={'center'}>
                  {props.data.city_from}&ensp;
                  <HiArrowNarrowRight />
                  &ensp;{props.data.city_to}
                </Text>
                <Text fontWeight={'700'} fontSize={'25px'} color={'#F26A4C'}>
                  {format_money}
                </Text>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="5">
                  <Box>
                    <Flex justifyContent={'space-between'}>
                      <Flex>
                        <Image src={LocationImage} />
                        <Flex
                          flexDirection={'column'}
                          justifyContent={'space-between'}
                          marginLeft={'10%'}
                        >
                          <Text fontSize={'22px'} fontWeight={'500'}>
                            {time_from}
                          </Text>
                          <Text
                            fontSize={'12px'}
                            color="#686868"
                            whiteSpace={'nowrap'}
                            fontWeight={'500'}
                          >
                            {travel_time}
                          </Text>
                          <Text fontSize={'22px'} fontWeight={'500'}>
                            {time_end}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex flexDirection={'column'} justifyContent={'space-between'}>
                        <Text fontSize={'18px'} fontWeight={'500'} textAlign="end">
                          {remain_seat}
                        </Text>
                        <Text
                          fontSize={'12px'}
                          color="#686868"
                          whiteSpace={'nowrap'}
                          fontWeight={'500'}
                          textAlign="end"
                          marginBottom={'3%'}
                        >
                          {vehicle?.bus[0]?.vehicle_type_name +
                            ' - ' +
                            vehicle?.bus[0]?.vehicle_plate}
                        </Text>
                        <Flex alignItems={'flex-end'}>
                          <Text
                            className="bom-content-details"
                            onClick={() => handleActiveBusScheduleDetails(index)}
                          >
                            Thông tin chi tiết &ensp; <AiFillCaretDown />
                          </Text>
                          <Button
                            color={'#fff'}
                            backgroundColor={
                              status[index]?.status != 'book' ? '#F26A4C' : '#7D7D7D'
                            }
                            padding="0 40px"
                            onClick={() => handleActiveBusScheduleBookTicket(index)}
                          >
                            {status[index]?.status != 'book' ? 'Chọn chỗ' : 'Đóng'}
                          </Button>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Box>
                  {status[index]?.status == 'detail' && <BusScheduleDetail data={props.data} />}
                  {status[index]?.status == 'book' && (
                    <BusScheduleBookTicket
                      data={vehicle}
                      busScheduleInformation={props.data}
                      route_name={props.data.city_from + ' - ' + props.data.city_to}
                      vehicle_plate={vehicle?.bus[0]?.vehicle_plate}
                      departureDay={props.departureDay}
                    />
                  )}
                </Stack>
              </CardBody>
            </Card>
          );
        })
      : null;
  return <>{html}</>;
}
