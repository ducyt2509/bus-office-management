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
  Text,
  StackDivider,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function Payment(props) {
  const [paymentType, setPaymentType] = useState();

  const handleBookingTicket = useCallback(async () => {
    if (paymentType == 0) {
      props.data.cashier = 8;
      props.data.bankCode = '';
      props.data.created_by = null;
    } else {
      props.data.cashier = 8;
      props.data.bankCode = '';
      props.data.created_by = null;
    }
    const bookTicket = await axios.post(
      `http://localhost:${props.port}/transaction/create-payment`,
      props.data
    );
    console.log(bookTicket);
    if (bookTicket.data.statusCode == 200) {
      window.location.href = bookTicket.data.data.link_payment;
    }
  }, [paymentType]);

  return (
    <>
      <Flex w="80%" margin={'3% auto 2%'} justifyContent="space-between">
        <Box w="66%">
          <Text fontSize={'20px'} fontWeight="500" marginBottom={'2%'}>
            Phương thức thanh toán
          </Text>
          <Card border={'1px solid'}>
            <CardBody>
              <RadioGroup value={paymentType} onChange={setPaymentType}>
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
        </Box>
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
                    {props.data?.pickup_location}
                  </Text>
                  <Text fontSize={'14px'} color="#686868" marginBottom={'4%'}>
                    Điểm trả
                  </Text>
                  <Text marginBottom={'6%'} fontWeight={'500'}>
                    {props.data?.drop_off_location}
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
          THANH TOÁN BẢO MẬT
        </Button>
        <Text color={'#686868'}>
          Bằng việc nhấn nút Thanh toán bảo mật, bạn đồng ý với Chính sách bảo mật thanh toán
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
