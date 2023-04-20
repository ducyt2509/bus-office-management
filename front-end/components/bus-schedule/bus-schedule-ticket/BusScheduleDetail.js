import axios from 'axios';
import {
  Flex,
  Stack,
  Text,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Switch,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { GoLocation } from 'react-icons/go';

export default function BusScheduleDetail(props) {
  let locationPickup = props.data.location_bus_schedule
    ? props.data.location_bus_schedule.filter((e) => {
        return e.bus_location_type == 0;
      })[0]?.bus_detail
    : [];
  let addressPickup = props.data.location_bus_schedule
    ? props.data.location_bus_schedule.filter((e) => {
        return e.bus_location_type == 0;
      })[0]?.bus_location_address
    : [];
  let locationDropOff = props.data.location_bus_schedule
    ? props.data.location_bus_schedule.filter((e) => {
        return e.bus_location_type == 1;
      })[0]?.bus_detail
    : [];
  let addressDropOff = props.data.location_bus_schedule
    ? props.data.location_bus_schedule.filter((e) => {
        return e.bus_location_type == 1;
      })[0]?.bus_location_address
    : [];
  locationPickup =
    locationPickup && locationPickup.length ? JSON.parse(locationPickup) : locationPickup;
  locationDropOff =
    locationDropOff && locationDropOff.length ? JSON.parse(locationDropOff) : locationDropOff;

  addressPickup = addressPickup && addressPickup.length ? JSON.parse(addressPickup) : addressPickup;
  addressDropOff =
    addressDropOff && addressDropOff.length ? JSON.parse(addressDropOff) : addressDropOff;

  const locationPickupHTML = locationPickup ? (
    locationPickup.map((location, index) => {
      const information = location.split(': ');
      const time = information[1];
      const position = information[0];
      return (
        <Stack>
          <Flex marginBottom={'2%!important'}>
            <Text fontWeight={'500'} fontSize={'16px'}>
              {time}
            </Text>
            <Text fontWeight={'500'} fontSize={'16px'}>
              &emsp;&bull;&ensp;{position}
            </Text>
          </Flex>
          <Flex
            alignItems={'center'}
            marginLeft="8px!important"
            marginTop={'0!important'}
            marginBottom="8px!important"
          >
            <GoLocation />
            <Text marginLeft="3%">{addressPickup[index]}</Text>
          </Flex>
        </Stack>
      );
    })
  ) : (
    <Text>Không có điểm đón</Text>
  );
  const locationDropOffHTML = locationDropOff
    ? locationDropOff.map((location, index) => {
        const information = location.split(': ');
        const time = information[1];
        const position = information[0];
        return (
          <Stack>
            <Flex marginBottom={'2%!important'}>
              <Text fontWeight={'500'} fontSize={'16px'}>
                {time}
              </Text>
              <Text fontWeight={'500'} fontSize={'16px'}>
                &emsp;&bull;&ensp;{position}
              </Text>
            </Flex>
            <Flex
              alignItems={'center'}
              marginLeft="8px!important"
              marginTop={'0!important'}
              marginBottom="8px!important"
            >
              <GoLocation />
              <Text marginLeft="3%">{addressDropOff[index]}</Text>
            </Flex>
          </Stack>
        );
      })
    : null;

  return (
    <Box className="details">
      <Tabs isFitted>
        <TabList mb="1em">
          <Tab fontSize={'18px'}>Điểm Đón, Trả</Tab>
          <Tab fontSize={'18px'}>Chính Sách</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Text className="bom-content-details" marginBottom={'1%'}>
              Lưu ý
            </Text>
            <Text fontSize={'12px'} color="#686868" whiteSpace={'nowrap'} fontWeight={'500'}>
              Các mốc thời gian đón, trả bên dưới là thời gian dự kiến. Lịch này có thể thay đổi tùy
              tình hình thưc tế.
            </Text>
            <Flex margin={'0 auto'} width="96%" marginTop={'3%'}>
              <Stack width={'50%'}>
                <Text fontSize={'20px'} fontWeight={'500'}>
                  Điểm Đón
                </Text>
                <Stack>{locationPickupHTML}</Stack>
              </Stack>
              <Stack width={'50%'}>
                <Text fontSize={'20px'} fontWeight={'500'}>
                  Điểm Trả
                </Text>
                <Stack>{locationDropOffHTML}</Stack>
              </Stack>
            </Flex>
          </TabPanel>
          <TabPanel>
            <Text fontSize={'22px'} fontWeight="500">
              Chính Sách Huỷ Vé
            </Text>
            <Stack marginTop={'1%'} marginLeft="1%">
              <Text>&bull;&ensp;Ngoài 2 tiếng trước giờ xe chạy: Miễn phí hủy vé</Text>
              <Text>&bull;&ensp;Từ 1 - 2 tiếng trước giờ xe chạy: Phí hủy 50%</Text>
              <Text>&bull;&ensp;Từ 1 - 5 vé: Hủy trước 2 tiếng</Text>
              <Text>&bull;&ensp;Từ 6 - 10 vé: Hủy trước 12 tiếng</Text>
              <Text>&bull;&ensp;Từ 11 - 20 vé: Hủy trước 24 tiếng</Text>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
