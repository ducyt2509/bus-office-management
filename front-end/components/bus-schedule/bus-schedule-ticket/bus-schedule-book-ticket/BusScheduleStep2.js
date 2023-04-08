import {
  Box,
  Flex,
  Text,
  Stack,
  Radio,
  RadioGroup,
  Switch,
  Textarea,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { GoLocation } from 'react-icons/go';

export default function BusScheduleStep2(props) {
  const router = useRouter();

  const [radioLocationPickup, setRadioLocationPickup] = useState();
  const [radioLocationDropOff, setRadioLocationDropOff] = useState();

  const handleChangeLocationPickup = useCallback((value) => {
    if (value != '#') {
      props.setLocationPickup(value);
    }
    setRadioLocationPickup(value);
  });
  const handleChangeLocationDropOff = useCallback((value) => {
    if (value != '#') {
      props.setLocationDropOff(value);
    }
    setRadioLocationDropOff(value);
  });

  const handleChangeTranshipPickup = useCallback(
    (e) => {
      let oldError = { ...props.error };
      const value = e.target.value;
      if (!value) {
        oldError.transhipPickUp = true;
      } else {
        oldError.transhipPickUp = false;
      }
      props.setError(oldError);
      props.setLocationPickup(value);
    },
    [props.error]
  );

  const handleChangeTranshipDropOff = useCallback(
    (e) => {
      let oldError = { ...props.error };
      const value = e.target.value;
      if (!value) {
        oldError.transhipDropOff = true;
      } else {
        oldError.transhipDropOff = false;
      }
      props.setError(oldError);
      props.setLocationDropOff(value);
    },
    [props.error]
  );

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
      const date = new Date(router.query?.refresh_date);
      const value = time + ' - ' + date.toLocaleDateString() + ' - ' + position;
      return (
        <Stack>
          <Radio value={value}>
            <Flex marginBottom={'2%!important'}>
              <Text fontWeight={'500'} fontSize={'16px'}>
                {time}
              </Text>
              <Text fontWeight={'500'} fontSize={'16px'}>
                &emsp;&bull;&ensp;{position}
              </Text>
            </Flex>
          </Radio>
          <Flex
            alignItems={'center'}
            marginLeft="33px!important"
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
  const locationDropOffHTML = locationDropOff ? (
    locationDropOff.map((location, index) => {
      const information = location.split(': ');
      const time = information[1];
      const position = information[0];
      const date = new Date(router.query?.refresh_date);
      const value = time + ' - ' + date.toLocaleDateString() + ' - ' + position;
      return (
        <Stack>
          <Radio value={value}>
            <Flex marginBottom={'2%!important'}>
              <Text fontWeight={'500'} fontSize={'16px'}>
                {time}
              </Text>
              <Text fontWeight={'500'} fontSize={'16px'}>
                &emsp;&bull;&ensp;{position}
              </Text>
            </Flex>
          </Radio>
          <Flex
            alignItems={'center'}
            marginLeft="33px!important"
            marginTop={'0!important'}
            marginBottom="8px!important"
          >
            <GoLocation />
            <Text marginLeft="3%">{addressDropOff[index]}</Text>
          </Flex>
        </Stack>
      );
    })
  ) : (
    <Text>Không có điểm trả</Text>
  );
  console.log(props);
  return (
    <>
      <Box borderTop="1px solid #E2E8F0" borderBottom="1px solid #E2E8F0" margin="3% 0 1%">
        <Flex margin="5% 0" alignItems={'center'} justifyContent="space-around">
          <Stack width={'50%'} borderRight="1px solid">
            <Text
              fontSize={'20px'}
              fontWeight={'500'}
              backgroundColor="#F5F5F5"
              padding="3%"
              marginRight="3%"
            >
              Điểm Đón
            </Text>
            <Stack marginRight="3%!important" maxHeight={'235px'} overflowY={'auto'}>
              <RadioGroup value={radioLocationPickup} onChange={handleChangeLocationPickup}>
                {locationPickupHTML}
                <Stack>
                  <Radio value={'#'}>
                    <Flex marginBottom={'2%!important'}>
                      <Text fontWeight={'500'} fontSize={'16px'}>
                        Khác
                      </Text>
                    </Flex>
                  </Radio>
                  {radioLocationPickup == '#' && (
                    <Flex
                      alignItems={'center'}
                      marginLeft="33px!important"
                      marginTop={'2%!important'}
                      marginBottom="8px!important"
                      maxWidth={'320px'}
                    >
                      <Textarea
                        onChange={(e) => props.setLocationPickup(e.target.value + ' (dọc đường)')}
                        placeholder="Nhập vị trí hoặc ghi chú"
                      ></Textarea>
                    </Flex>
                  )}
                </Stack>
              </RadioGroup>
            </Stack>
          </Stack>
          <Stack width={'50%'}>
            <Text
              fontSize={'20px'}
              fontWeight={'500'}
              backgroundColor="#F5F5F5"
              padding="3%"
              marginLeft="3%"
            >
              Điểm Trả
            </Text>
            <Stack marginLeft="3%!important" maxHeight={'235px'} overflowY={'auto'}>
              <RadioGroup value={radioLocationDropOff} onChange={handleChangeLocationDropOff}>
                {locationDropOffHTML}
                <Stack>
                  <Radio value={'#'}>
                    <Flex marginBottom={'2%!important'}>
                      <Text fontWeight={'500'} fontSize={'16px'}>
                        Khác
                      </Text>
                    </Flex>
                  </Radio>
                  {radioLocationDropOff == '#' && (
                    <Flex
                      alignItems={'center'}
                      marginLeft="33px!important"
                      marginTop={'2%!important'}
                      marginBottom="8px!important"
                      maxWidth={'320px'}
                    >
                      <Textarea
                        onChange={(e) => props.setLocationDropOff(e.target.value + ' (dọc đường)')}
                        placeholder="Nhập vị trí hoặc ghi chú"
                      ></Textarea>
                    </Flex>
                  )}
                </Stack>
              </RadioGroup>
            </Stack>
          </Stack>
        </Flex>
      </Box>
      <Box borderBottom="1px solid #E2E8F0" marginBottom={'3%'}>
        <Flex
          justifyContent={'space-between'}
          width={'96%'}
          margin={'0 auto'}
          marginBottom={'5%'}
          marginTop="2%"
        >
          <Stack w={'46%'}>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Text fontWeight={'500'}>Trung chuyển lúc đón</Text>
              <Switch
                size={'md'}
                marginTop="2%"
                isChecked={props.switchPickupStatus}
                onChange={props.handleChangeSwitchPickUp}
              />
            </Flex>

            {props.switchPickupStatus && (
              <FormControl isInvalid={props.error.transhipPickUp}>
                <Textarea
                  value={props.locationPickup}
                  onChange={(e) => handleChangeTranshipPickup(e)}
                  placeholder="Nhập vị trí hoặc ghi chú"
                  minHeight={'150px'}
                ></Textarea>
                <FormErrorMessage>Trường này là bắt buộc</FormErrorMessage>
              </FormControl>
            )}
          </Stack>
          <Stack w={'46%'}>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Text fontWeight={'500'}>Trung chuyển lúc trả</Text>
              <Switch
                size={'md'}
                marginTop="2%"
                isChecked={props.switchDropOffStatus}
                onChange={props.handleChangeSwitchDropOff}
              />
            </Flex>
            {props.switchDropOffStatus && (
              <FormControl isInvalid={props.error.transhipDropOff}>
                <Textarea
                  value={props.locationDropOff}
                  onChange={(e) => handleChangeTranshipDropOff(e)}
                  placeholder="Nhập vị trí hoặc ghi chú"
                  minHeight={'150px'}
                ></Textarea>
                <FormErrorMessage>Trường này là bắt buộc</FormErrorMessage>
              </FormControl>
            )}
          </Stack>
        </Flex>
      </Box>
    </>
  );
}
