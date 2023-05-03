import { formatMoney, validate } from '@/helper';
import {
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Button,
  Flex,
  Box,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState, useRef } from 'react';
import Pagination from '@/src/components/common/Pagination';
import { useRouter } from 'next/router';

export default function searchTicket(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [otpCode, setOtpCode] = useState(new Array(6).fill(null));
  const [otp1, setOtp1] = useState('');
  const [otp2, setOtp2] = useState('');
  const [otp3, setOtp3] = useState('');
  const [otp4, setOtp4] = useState('');
  const [otp5, setOtp5] = useState('');
  const [otp6, setOtp6] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [showCountdownTime, setShowCountdownTime] = useState(false);

  const [phone, setPhone] = useState('');
  const [hash, setHash] = useState('');
  const router = useRouter();
  const [error, setError] = useState(false);
  const [listTicket, setListTicket] = useState([]);
  const [numberTicket, setNumberTicket] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [step, setStep] = useState(1);

  const handleResendOTP = useCallback(async () => {
    let userPhone = phone;
    if (phone && phone[0] == 0) {
      userPhone = '+84' + phone.substring(1);
    }
    var submitData = {
      user: userPhone,
    };
    try {
      const sendOTP = await axios.post(`http://localhost:${props.port}/send-otp`, submitData);
      if (sendOTP.data.statusCode === 200) {
        setShowCountdownTime(true);
        setHash(sendOTP.data.data?.hash);
        setStep(2);
      }
    } catch (error) {
      console.log(error);
      toastIdRef.current = toast({
        title: 'Lỗi.',
        description: 'Xảy ra lỗi trong quá trình thao tác. Làm ơn hãy thử lại.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
    }
  }, [phone]);


  const handleVerifyOTP = useCallback(async () => {
    let userPhone = phone;
    if (phone && phone[0] == 0) {
      userPhone = '+84' + phone.substring(1);
    }
    var submitData = {
      otpCode: otpCode.join(''),
      hash: hash,
      phone: userPhone,
    };
    try {
      const verifyOTP = await axios.post(`http://localhost:${props.port}/verify-otp`, submitData);
      if (verifyOTP.data.statusCode === 200) {
        handleSearchTicket();
        setStep(1);
      }
    } catch (error) {
      toastIdRef.current = toast({
        title: 'Mã OTP không đúng.',
        description: 'Mã OTP không đúng. Làm ơn hãy thử lại.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
    }
  }, [phone, hash, otpCode]);

  const handleChangeValueOtp1 = useCallback(
    (e) => {
      let code = e.target.value;
      let arrOtpCode = [...otpCode];
      arrOtpCode[0] = code;
      setOtp1(code);
      setOtpCode(arrOtpCode);
    },
    [otpCode]
  );
  const handleChangeValueOtp2 = useCallback(
    (e) => {
      let code = e.target.value;
      let arrOtpCode = [...otpCode];
      arrOtpCode[1] = code;
      setOtp2(code);
      setOtpCode(arrOtpCode);
    },
    [otpCode]
  );
  const handleChangeValueOtp3 = useCallback(
    (e) => {
      let code = e.target.value;
      let arrOtpCode = [...otpCode];
      arrOtpCode[2] = code;
      setOtp3(code);
      setOtpCode(arrOtpCode);
    },
    [otpCode]
  );
  const handleChangeValueOtp4 = useCallback(
    (e) => {
      let code = e.target.value;
      let arrOtpCode = [...otpCode];
      arrOtpCode[3] = code;
      setOtp4(code);
      setOtpCode(arrOtpCode);
    },
    [otpCode]
  );
  const handleChangeValueOtp5 = useCallback(
    (e) => {
      let code = e.target.value;
      let arrOtpCode = [...otpCode];
      arrOtpCode[4] = code;
      setOtp5(code);
      setOtpCode(arrOtpCode);
    },
    [otpCode]
  );
  const handleChangeValueOtp6 = useCallback(
    (e) => {
      let code = e.target.value;
      let arrOtpCode = [...otpCode];
      arrOtpCode[5] = code;
      setOtp6(code);
      setOtpCode(arrOtpCode);
    },
    [otpCode]
  );

  useEffect(() => {
    if (showCountdownTime) {
      let inputOTP = setTimeout(() => {
        const inputs = document.querySelectorAll('.bom-otp-ticket .chakra-stack input'),
          button = document.querySelector('.bom-otp-ticket button.bom-button-verify');

        inputs.forEach((input, index1) => {
          input.addEventListener('keyup', (e) => {
            const currentInput = input,
              nextInput = input.nextElementSibling,
              prevInput = input.previousElementSibling;

            if (currentInput.value.length > 1) {
              currentInput.value = '';
              return;
            }
            if (nextInput && nextInput.hasAttribute('disabled') && currentInput.value !== '') {
              nextInput.removeAttribute('disabled');
              nextInput.style.backgroundColor = '#fff';
              nextInput.focus();
            }
            if (e.key === 'Backspace') {
              inputs.forEach((input, index2) => {
                if (index1 <= index2 && prevInput) {
                  input.setAttribute('disabled', true);
                  currentInput.style.backgroundColor = '#ededed';
                  input.value = '';
                  prevInput.focus();
                }
              });
            }
            if (!inputs[5].disabled && inputs[5].value !== '') {
              button.classList.add('active');
              return;
            }
            button.classList.remove('active');
          });
        });
      }, 1000);
      if (!countdown) {
        setShowCountdownTime(false);
        setCountdown(60);
        return;
      }
      let countdownTime = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => {
        clearInterval(countdownTime);
        clearTimeout(inputOTP);
      };
    }
  }, [countdown, showCountdownTime]);

  const handleChangePhone = useCallback(
    (e) => {
      let value = e.target.value;
      if (!value || !value.match(validate.phone)) {
        setError(true);
      } else {
        setError(false);
      }
      setPhone(value);
    },
    [error]
  );
  const getTicketDetails = (data) => {
    let submitData = { ...data, route_name: data.city_from + ' - ' + data.city_to };
    submitData.router_name = data.city_from + ' - ' + data.city_to;
    router.push({
      pathname: '/ticket/ticket-detail',
      query: submitData,
    });
  };
  const handleSearchTicket = useCallback(
    async (type, page, limit) => {
      if (!phone) {
        setError(true);
        return;
      }
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page : 1;
      setShowCountdownTime(true);
      const offset = limit * (page - 1);
      if (typeof page == 'number') {
        setCurrentPage(page);
      }
      let userPhone = phone;
      if (phone && phone[0] == 0) {
        userPhone = '+84' + phone.substring(1);
      }
      const searchTicket = await axios.post(
        `http://localhost:${props.port}/transaction/list-transaction`,
        { phone: userPhone, offset: offset, limit: limit }
      );
      if (searchTicket.data.statusCode == 200) {
        if (type == 'search') {
          setCurrentPage(1);
        }
        setListTicket(searchTicket.data.data.list_transaction);
        setNumberTicket(searchTicket.data.data.number_transaction);
      }
    },
    [phone]
  );
  const listTicketHTML = listTicket.map((ticket) => {
    return (
      <Card
        border={'1px solid'}
        width={'70%'}
        margin={'0 auto'}
        marginTop="2%"
        cursor={'pointer'}
        onClick={() => getTicketDetails(ticket)}
      >
        <CardBody>
          <Flex justifyContent={'space-between'} flexWrap="wrap">
            <Box mb={'1rem'} mt={'1rem'}>
              <Stack>
                <Flex>
                  <Text fontWeight="600">Ngày đi:&ensp;</Text>
                  <Text fontWeight="600">{ticket?.date_detail.split('  ')[0]}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="600">Tuyến đường:&ensp;</Text>
                  <Text fontWeight="600">{ticket.city_from + ' - ' + ticket.city_to}</Text>
                </Flex>
              </Stack>
            </Box>

            <Box mb={'1rem'} mt={'1rem'}>
              <Stack>
                <Flex>
                  <Text fontWeight="600">Thời gian:&ensp;</Text>
                  <Text fontWeight="600">{ticket?.date_detail.split('  ')[1]}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="600">Biển số xe:&ensp;</Text>
                  <Text fontWeight="600">{ticket?.vehicle_plate}</Text>
                </Flex>
              </Stack>
            </Box>

            <Box mb={'1rem'} mt={'1rem'}>
              <Stack>
                <Flex>
                  <Text fontWeight="600">Số ghế:&ensp;</Text>
                  <Text fontWeight="600">{ticket?.seat}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="600">Giá vé:&ensp;</Text>
                  <Text fontWeight="600">{formatMoney(ticket.ticket_price)}</Text>
                </Flex>
              </Stack>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    );
  });

  const OtpHTML = (
    <Card
      boxShadow={'6px 8px 20px 0px #a7bad3'}
      width={'40%'}
      margin="3% auto"
      className="bom-otp-ticket"
    >
      <CardBody>
        <Text marginBottom={'3%'} fontSize={'14px'} textAlign={'center'} fontWeight={'500'}>
          Để tiếp tục vui lòng xác thực OTP được gửi đến số điện thoại{' '}
          {phone.replace('+84', '0').substring(0, 5) + '******'}
        </Text>
        <Stack direction={['column', 'row']} spacing="5%">
          <Input
            minH={'70px'}
            value={otp1}
            onChange={handleChangeValueOtp1}
            border={'1px solid'}
            fontSize={'31px'}
          />
          <Input
            minH={'70px'}
            fontSize={'31px'}
            disabled
            value={otp2}
            onChange={handleChangeValueOtp2}
            border={'1px solid'}
          />
          <Input
            minH={'70px'}
            disabled
            value={otp3}
            onChange={handleChangeValueOtp3}
            fontSize={'31px'}
            border={'1px solid'}
          />
          <Input
            minH={'70px'}
            disabled
            value={otp4}
            onChange={handleChangeValueOtp4}
            fontSize={'31px'}
            border={'1px solid'}
          />
          <Input
            minH={'70px'}
            disabled
            value={otp5}
            onChange={handleChangeValueOtp5}
            fontSize={'31px'}
            border={'1px solid'}
          />
          <Input
            minH={'70px'}
            disabled
            value={otp6}
            onChange={handleChangeValueOtp6}
            fontSize={'31px'}
            border={'1px solid'}
          />
        </Stack>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text
            style={showCountdownTime ? { opacity: 1 } : { opacity: 0 }}
            marginTop="2%"
            fontSize={'13px'}
            color="red"
          >
            Yêu cầu cấp lại mã sau {countdown} giây
          </Text>
          {!showCountdownTime && (
            <Text
              onClick={handleResendOTP}
              color={'#f26a4c'}
              cursor={'pointer'}
              marginTop="2%"
              fontSize={'13px'}
              _hover={{ color: 'red' }}
            >
              Gửi lại OTP
            </Text>
          )}
        </div>
        <Button
          onClick={handleVerifyOTP}
          className="bom-button-verify"
          backgroundColor={'#f26a4c'}
          color="#fff"
          display={'flex'}
          margin={'0 auto'}
          marginTop="2%"
        >
          Xác thực
        </Button>
      </CardBody>
    </Card>
  );

  return (
    <>
      <Text
        fontSize={'25px'}
        textAlign={'center'}
        marginTop={'2%'}
        margin={'3%'}
        fontWeight={'600'}
      >
        Tra cứu vé
      </Text>
      {step == 1 && (
        <FormControl isRequired isInvalid={error}>
          <Flex alignItems={'center'} width={'60%'} margin={'0 auto'}>
            <FormLabel w="30%">Số điện thoại:</FormLabel>
            <Input value={phone} onChange={handleChangePhone} marginRight={'3%'} />

            <Button
              backgroundColor={'#F26A4C'}
              color={'#fff'}
              onClick={handleResendOTP}
              padding="0 30px"
            >
              Tra cứu
            </Button>
          </Flex>
          <FormErrorMessage justifyContent={'space-around'}>
            {!phone ? 'Số điện thoại là bắt buộc' : 'Số điện thoại sai định dạng'}
          </FormErrorMessage>
        </FormControl>
      )}
      {step == 2 && OtpHTML}
      {listTicketHTML}
      {listTicket && listTicket.length ? (
        <Pagination
          list_number={numberTicket}
          handleGetList={handleSearchTicket}
          setList={setListTicket}
          list={listTicket}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      ) : null}
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
