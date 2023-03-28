import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import BusScheduleBookTicketStep from './BusScheduleBookTicketStep';
import BusScheduleStep1 from './BusScheduleStep1';
import { formatMoney, convertTime } from '@/helper';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import BusScheduleStep2 from './BusScheduleStep2';
import BusScheduleStep3 from './BusScheduleStep3';
import { useRouter } from 'next/router';

export default function BusScheduleBookTicket(props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [seatSelected, setSeatSelected] = useState([]);
  const [locationPickup, setLocationPickup] = useState('');
  const [locationDropOff, setLocationDropOff] = useState('');
  const [addressPickup, setAddressPickup] = useState('');
  const [addressDropOff, setAddressDropOff] = useState('');
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');

  const handleChangeUserName = useCallback((e) => {
    setUserName(e.target.value);
  });
  const handleChangePhone = useCallback((e) => {
    setPhone(e.target.value);
  });
  const handleChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  });
  const handleChangeNotice = useCallback((e) => {
    setNotice(e.target.value);
  });

  const handleChangeStep = useCallback(
    (status) => {
      const submitData = {
        passenger_name: userName,
        passenger_phone: phone,
        // cashier: null,
        pickup_location: locationPickup,
        drop_off_location: locationDropOff,
        tranship_address: notice,
        date_detail:
          new Date(props.data.date_start).toLocaleDateString() +
          ' | ' +
          convertTime(props.data.time_from, 0) +
          '-' +
          convertTime(props.data.time_from, props.data.travel_time),
        ticket_price: seatSelected.length * props.busScheduleInformation?.price,
        // created_by: null,
        email: email,
        seat: seatSelected.join(', '),
        transport: props.data?.id,
      };
      if (seatSelected.length) {
        if (step == 3) {
          router.push({
            pathname: '/payment',
            query: submitData,
          });
        }
        if (status == 1 && step < 4) {
          setStep((prev) => prev + 1);
        } else if (status == 0 && step < 5) {
          setStep((prev) => prev - 1);
        }
      }
    },
    [seatSelected, step, locationPickup, locationDropOff, userName, phone, email, notice]
  );
  console.log(props.data);
  return (
    <>
      <BusScheduleBookTicketStep step={step} />
      {step == 1 && (
        <BusScheduleStep1
          seatSelected={seatSelected}
          setSeatSelected={setSeatSelected}
          data={props.data}
        />
      )}
      {step == 2 && (
        <BusScheduleStep2
          data={props.busScheduleInformation}
          locationPickup={locationPickup}
          locationDropOff={locationDropOff}
          addressDropOff={addressDropOff}
          addressPickup={addressPickup}
          setLocationPickup={setLocationPickup}
          setLocationDropOff={setLocationDropOff}
          setAddressDropOff={setAddressDropOff}
          setAddressPickup={setAddressPickup}
        />
      )}
      {step == 3 && (
        <BusScheduleStep3
          data={props.data}
          userName={userName}
          handleChangeUserName={handleChangeUserName}
          email={email}
          handleChangeEmail={handleChangeEmail}
          phone={phone}
          handleChangePhone={handleChangePhone}
          notice={notice}
          handleChangeNotice={handleChangeNotice}
        />
      )}
      <Box>
        <Flex justifyContent={'space-between'}>
          <Flex>
            {step == 1 && (
              <>
                <Text>Ghế:&ensp;</Text>
                <Text fontWeight={'700'} color={'#F26A4C'}>
                  {seatSelected.join(', ')}
                </Text>
              </>
            )}
            {step != 1 && (
              <Button
                leftIcon={<ChevronLeftIcon />}
                colorScheme="teal"
                variant="solid"
                background="#fff!important"
                color="#7d7d7d"
                border="1px solid #7d7d7d"
                onClick={() => handleChangeStep(0)}
              >
                Quay lại
              </Button>
            )}
          </Flex>
          <Flex alignItems={'center'}>
            <Text>Tổng cộng:&ensp;</Text>
            <Text fontWeight={'700'} fontSize={'20px'} color={'#F26A4C'}>
              {formatMoney(seatSelected.length * props.busScheduleInformation?.price)}&emsp;
            </Text>
            <Button
              color={'#fff'}
              backgroundColor={'#F26A4C'}
              padding="0 40px"
              onClick={() => handleChangeStep(1)}
            >
              Tiếp tục
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
