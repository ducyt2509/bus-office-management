import axios from 'axios';
import { ChevronLeftIcon, SearchIcon, InfoIcon, CheckIcon } from '@chakra-ui/icons';
import { Text, Flex, Stack, Box, Input, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

export default function BusScheduleDriver(props) {
  const [data, setData] = useState(props.data);
  const router = useRouter();
  const handleBackMainScreen = () => {
    router.push('/driver');
  };

  const handleCheckCustomerInTheCar = useCallback(
    async (id) => {
      let updateTransactionById = await axios.put(
        `http://localhost:${props.port}/transaction/update-transaction`,
        {
          id: id,
          payment_status: 2,
        }
      );
      if (updateTransactionById.data.statusCode == 200) {
        let cloneData = [...data];
        cloneData = cloneData.map((e) => {
          e.id == id ? (e.payment_status = 2) : null;
          return e;
        });
        setData(cloneData);
      }
    },
    [data]
  );

  const CustomerNotInTheCarHTML = data
    .filter((e) => e.payment_status != 2)
    .map((customer) => {
      const pickup_location = customer.pickup_location.includes(' - ')
        ? customer.pickup_location.split(' - ')[1]
        : customer.pickup_location;
      const drop_off_location = customer.drop_off_location.includes(' - ')
        ? customer.drop_off_location.split(' - ')[1]
        : customer.drop_off_location;
      return (
        <Box fontSize={'19px'} fontWeight={'500'} color={'#363636'} marginBottom={'3%'}>
          <Flex
            backgroundColor={customer.payment_status == 0 ? '#F2CAC2' : '#86f0bd'}
            justifyContent={'space-between'}
            fontSize={'22px'}
            fontWeight={'700'}
            padding=" 2% 4%"
          >
            <Text>{customer.passenger_phone}</Text>
            <Text>{customer.seat}</Text>
          </Flex>
          <Flex padding="2% 4%" alignItems={'center'}>
            <Stack>
              <Text>Hành khách:</Text>
              <Text>Mã vé:</Text>
              <Text>Điểm đón:</Text>
              <Text>Điểm trả:</Text>
            </Stack>
            <Stack margin="0 4%">
              <Text>{customer.passenger_name}</Text>
              <Text>{customer.id}</Text>
              <Text>{pickup_location}</Text>
              <Text>{drop_off_location}</Text>
            </Stack>
            {customer.payment_status != 2 && (
              <IconButton
                fontSize="30px"
                backgroundColor="#00B65F"
                color="#fff"
                icon={<CheckIcon />}
                w="70px"
                h="70px"
                onClick={() => handleCheckCustomerInTheCar(customer.id)}
              />
            )}
          </Flex>
        </Box>
      );
    });

  const CustomerInTheCarHTML = data
    .filter((e) => e.payment_status == 2)
    .map((customer) => {
      const pickup_location = customer.pickup_location.includes(' - ')
        ? customer.pickup_location.split(' - ')[1]
        : customer.pickup_location;
      const drop_off_location = customer.drop_off_location.includes(' - ')
        ? customer.drop_off_location.split(' - ')[1]
        : customer.drop_off_location;
      return (
        <Box fontSize={'19px'} fontWeight={'500'} color={'#363636'} marginBottom={'3%'}>
          <Flex
            backgroundColor={customer.payment_status == 0 ? '#F2CAC2' : '#86f0bd'}
            justifyContent={'space-between'}
            fontSize={'22px'}
            fontWeight={'700'}
            padding=" 2% 4%"
          >
            <Text>{customer.passenger_phone}</Text>
            <Text>{customer.seat}</Text>
          </Flex>
          <Flex padding="2% 4%" alignItems={'center'}>
            <Stack>
              <Text>Hành khách:</Text>
              <Text>Mã vé:</Text>
              <Text>Điểm đón:</Text>
              <Text>Điểm trả:</Text>
            </Stack>
            <Stack margin="0 4%">
              <Text>{customer.passenger_name}</Text>
              <Text>{customer.id}</Text>
              <Text>{pickup_location}</Text>
              <Text>{drop_off_location}</Text>
            </Stack>
          </Flex>
        </Box>
      );
    });

  return (
    <>
      <Stack width={'96%'} margin={'0 auto'} spacing="5" className="bom-driver-screen">
        <Box marginTop="20%">
          <Flex fontSize={'30px'} alignItems={'center'} marginBottom="5%">
            <ChevronLeftIcon fontSize={'40px'} onClick={handleBackMainScreen} />
            <Text fontWeight={'500'} color={'#363636'} marginLeft={'1%'}>
              {props.location}
            </Text>
          </Flex>
          <Flex justifyContent={'space-between'}>
            <Input
              w="75%"
              marginLeft="4%"
              border={'1px solid #000!important'}
              marginBottom="5%"
              height={'40px'}
              placeHolder="Tìm kiếm"
              fontSize={'18px'}
            />
            <IconButton
              marginRight="4%"
              aria-label="Search database"
              icon={<SearchIcon />}
              backgroundColor={'#fff'}
              border={'1px solid #000'}
            />
          </Flex>
        </Box>
      </Stack>
      <Box>
        <Flex fontSize={'18px'} alignItems={'flex-end'} marginBottom={'3%'} marginLeft={'4%'}>
          <Text color={'red'} fontSize={'20px'} fontWeight={'500'} marginRight={'2%'}>
            {data.filter((e) => e.payment_status != 2).length}
          </Text>
          <Text>
            chưa lên xe <InfoIcon />
          </Text>
        </Flex>
        {CustomerNotInTheCarHTML}

        <Flex
          fontSize={'18px'}
          alignItems={'flex-end'}
          marginBottom={'3%'}
          marginLeft={'4%'}
          marginTop={'2%'}
        >
          <Text color={'red'} fontSize={'20px'} fontWeight={'500'} marginRight={'2%'}>
            {data.filter((e) => e.payment_status == 2).length}
          </Text>
          <Text>
            đã lên xe <InfoIcon />
          </Text>
        </Flex>
        {CustomerInTheCarHTML}
      </Box>
    </>
  );
}
export async function getServerSideProps(context) {
  let port = process.env.BACK_END_PORT;
  let data = [];
  let location = context.query.location;
  let getTransportById = await axios.post(`http://localhost:${port}/transaction/list-transaction`, {
    transport_id: context.query.transport_id,
    date_detail: context.query.date_detail,
    role_id: 3,
  });
  if (getTransportById.data.statusCode == 200) {
    data = getTransportById.data.data.list_transaction;
  }

  return {
    props: {
      port,
      data,
      location,
    }, // will be passed to the page component as props
  };
}
