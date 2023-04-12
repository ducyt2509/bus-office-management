import { formatMoney } from '@/helper';
import {
  Box,
  Flex,
  Card,
  CardBody,
  RadioGroup,
  Radio,
  Stack,
  Button,
  Heading,
  Text,
  StackDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Payment(props) {
  const router = useRouter();
  const [paymentType, setPaymentType] = useState();
  const [paymentStatusType, setPaymentStatusType] = useState();
  const [error, setError] = useState(false);

  const handleBookingTicket = useCallback(async () => {
    if (!paymentType) {
      setError(true);
      return;
    }
    if (paymentType == 0) {
      props.data.cashier = 8;
      props.data.bankCode = '';
      props.data.created_by = null;
      props.data.paymentStatusType = 1;
      props.data.payment_status = 2;
    } else {
      props.data.cashier = 8;
      props.data.bankCode = '';
      props.data.created_by = null;
      props.data.payment_status = 0;
    }
    const bookTicket = await axios.post(
      `http://localhost:${props.port}/transaction/create-payment`,
      props.data
    );
    if (bookTicket.data.statusCode == 200) {
      if (bookTicket.data.data.link_payment) {
        window.location.href = bookTicket.data.data.link_payment;
      } else {
        props.data.id = bookTicket.data.data.id;
        setPaymentStatusType(1);
      }
    }
  }, [paymentType]);

  const handleTicketDetail = () => {
    const id = 1;
    router.push({
      pathname: '/ticket/ticket-detail',
      query: props.data,
    });
  };

  const handleChangePaymentType = (e) => {
    if (e) {
      setError(false);
    } else {
      setError(true);
    }
    setPaymentType(e);
  };

  const ModalNotification = (
    <Modal isOpen={props.data.paymentStatus || paymentStatusType ? true : false}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody textAlign={'center'} paddingTop="30px">
          <CheckCircleIcon w={'6rem'} h={'6rem'} color="#F26A4C" />
          <Heading size={'md'} margin="3% 0">
            Thanh toán thành công!
          </Heading>
          <Text fontSize={'12px'}>
            Chúng tôi đã nhận được thông tin của bạn và sẽ sớm liên hệ với bạn
          </Text>
        </ModalBody>

        <ModalFooter justifyContent={'space-evenly'}>
          <Button
            mr={3}
            color={'#F26A4C'}
            border={'1px solid #F26A4C'}
            _hover={{ backgroundColor: '#F26A4C', color: '#FFF' }}
            backgroundColor={'#FFF'}
            onClick={() => router.push('/')}
          >
            Về trang chủ
          </Button>
          <Button
            variant="ghost"
            backgroundColor={'#F26A4C'}
            _hover={{ backgroundColor: '#F26A4C', color: '#FFF' }}
            color="#fff"
            mr={3}
            onClick={handleTicketDetail}
          >
            Chi tiết vé
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  const pickup_location = props.data?.pickup_location ? props.data?.pickup_location : '';
  const drop_off_location = props.data?.drop_off_location ? props.data?.drop_off_location : '';
  return (
    <>
      {ModalNotification}
      <Flex w="80%" margin={'3% auto 2%'} justifyContent="space-between">
        <FormControl isInvalid={error} w="66%" isRequired>
          <FormLabel fontSize={'20px'} fontWeight="500">
            Phương thức thanh toán
          </FormLabel>
          <FormErrorMessage>Vui lòng chọn phương thức thanh toán</FormErrorMessage>
          <Card border={'1px solid'} marginTop={'2%'}>
            <CardBody>
              <RadioGroup value={paymentType} onChange={(e) => handleChangePaymentType(e)}>
                <Stack divider={<StackDivider />} spacing="6">
                  <Box>
                    <Radio value="0">
                      <Text fontSize={'16px'} fontWeight="400">
                        Thanh toán khi lên xe
                      </Text>
                    </Radio>
                    <Text fontSize={'12px'} color="#686868" marginLeft={'25px'}>
                      Bạn có thể thanh toán cho tài xế khi lên xe
                    </Text>
                  </Box>
                  <Box>
                    <Radio value="1">
                      <Text fontSize={'16px'} fontWeight="400">
                        Thanh toán VNPAY - QR
                      </Text>
                    </Radio>
                    <Text fontSize={'12px'} color="#686868" marginLeft={'25px'}>
                      Thiết bị cần cài đặt Ứng dụng ngân hàng (Mobile Banking) hoặc Ví VNPAY
                    </Text>
                  </Box>
                </Stack>
              </RadioGroup>
            </CardBody>
          </Card>
        </FormControl>
        <Box w={'30%'}>
          <Text fontSize={'20px'} fontWeight="500" marginBottom={'4%'}>
            Thông tin chuyến đi
          </Text>
          <Card border={'1px solid'} marginBottom={'2%'}>
            <CardBody>
              <Stack divider={<StackDivider />} spacing="5">
                <Box>
                  <Text fontSize={'14px'} color="#686868" marginBottom={'4%'}>
                    Hành khách
                  </Text>
                  <Text fontWeight={'500'} marginBottom={'6%'}>
                    {props.data?.passenger_name}
                  </Text>
                  <Text fontSize={'14px'} color="#686868" marginBottom={'4%'}>
                    Số điện thoại
                  </Text>
                  <Text marginBottom={'6%'} fontWeight={'500'}>
                    +84{props.data?.passenger_phone}
                  </Text>
                  <Text fontSize={'14px'} color="#686868" marginBottom={'4%'}>
                    Email
                  </Text>
                  <Text marginBottom={'6%'} fontWeight={'500'}>
                    {props.data?.email}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize={'14px'} color="#686868" marginBottom={'4%'}>
                    Điểm đón
                  </Text>
                  <Text marginBottom={'6%'} fontWeight={'500'}>
                    {pickup_location}
                  </Text>
                  <Text fontSize={'14px'} color="#686868" marginBottom={'4%'}>
                    Điểm trả
                  </Text>
                  <Text marginBottom={'6%'} fontWeight={'500'}>
                    {drop_off_location}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <Flex alignItems={'center'} justifyContent={'space-between'}>
            <Text fontSize={'20px'} fontWeight="500">
              Tổng tiền:
            </Text>
            <Text fontWeight={'700'} fontSize={'20px'} color={'#F26A4C'}>
              {formatMoney(props.data?.ticket_price)}
            </Text>
          </Flex>
        </Box>
      </Flex>
      <Flex
        borderTop="2px solid rgb(217, 217, 217)"
        alignItems={'center'}
        justifyContent="space-evenly"
      >
        <Button
          backgroundColor={'#F26A4C'}
          color="#fff"
          padding="2% 10%"
          margin="2% 0"
          onClick={handleBookingTicket}
        >
          HOÀN THÀNH THANH TOÁN
        </Button>
        <Text color={'#686868'}>
          Bằng việc nhấn nút "HOÀN THÀNH THANH TOÁN", bạn đồng ý với Chính sách bảo mật thanh toán
        </Text>
      </Flex>
    </>
  );
}
export async function getServerSideProps(context) {
  const data = context.query;
  return {
    props: {
      port: process.env.BACK_END_PORT,
      data,
    },
  };
}
