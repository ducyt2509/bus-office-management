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
import LocationImage from '../../../images/home/location.png';
import Image from 'next/image';
import { convertTime, formatMoney } from '@/helper';
import BusScheduleDetail from './BusScheduleDetail';
import BusScheduleBookTicket from './bus-schedule-book-ticket';
import { useCallback, useState } from 'react';

export default function BusSchedulesList(props) {
  console.log(props.data);
  const [status, setStatus] = useState('');
  const time_from = convertTime(props.data.time_from, 0);
  const travel_time = convertTime(props.data.travel_time, 0).replace(':', ' giờ ') + ' phút';
  const time_end = convertTime(props.data.time_from, props.data.travel_time);
  const format_money = formatMoney(props.data.price);
  const number_seat_selected =
    props.data.number_seat_selected && props.data.number_seat_selected.length
      ? props.data.number_seat_selected
          .map((e) => e.seat)
          .join()
          .split(',').length
      : 0;
  const number_seat_unselected = props.data.vehicle_number_seat - number_seat_selected;
  const remain_seat = number_seat_unselected ? number_seat_unselected + ' chỗ online' : 'Hết chỗ';

  const handleActiveBusScheduleDetails = useCallback(() => {
    status == 'detail' ? setStatus('') : setStatus('detail');
  }, [status]);
  const handleActiveBusScheduleBookTicket = useCallback(() => {
    status == 'book' ? setStatus('') : setStatus('book');
  }, [status]);
  return (
    <Card className={'bom-schedule-detail'}>
      <CardHeader display="flex" justifyContent="space-between" paddingBottom={0}>
        <Text display={'flex'} fontWeight={'700'} fontSize={'20px'} alignItems={'center'}>
          {props.data.location_start}&ensp;
          <HiArrowNarrowRight />
          &ensp;{props.data.location_finish}
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
                <Flex flexDirection={'column'} justifyContent={'space-between'} marginLeft={'10%'}>
                  <Text fontSize={'22px'} fontWeight={'500'}>
                    {time_from}
                  </Text>
                  <Text fontSize={'12px'} color="#686868" whiteSpace={'nowrap'} fontWeight={'500'}>
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
                  {props.data.vehicle_name}
                </Text>
                <Flex alignItems={'flex-end'}>
                  <Text className="bom-content-details" onClick={handleActiveBusScheduleDetails}>
                    Thông tin chi tiết &ensp; <AiFillCaretDown />
                  </Text>
                  <Button
                    color={'#fff'}
                    backgroundColor={status != 'book' ? '#F26A4C' : '#7D7D7D'}
                    padding="0 40px"
                    onClick={handleActiveBusScheduleBookTicket}
                  >
                    {status != 'book' ? 'Chọn chỗ' : 'Đóng'}
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Box>
          {status == 'detail' && <BusScheduleDetail data={props.data} />}
          {status == 'book' && <BusScheduleBookTicket data={props.data} />}
        </Stack>
      </CardBody>
    </Card>
  );
}
