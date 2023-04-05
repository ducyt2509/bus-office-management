import { useCallback, useState } from 'react';
import { AddIcon, SmallCloseIcon, SmallAddIcon } from '@chakra-ui/icons';
import {
  Text,
  Card,
  CardBody,
  Flex,
  Box,
  Modal,
  StackDivider,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Stack,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Button,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { formatMoney } from '@/helper';

export default function Seat12User(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [seatSelected, setSeatSelected] = useState([]);
  const [seat, setSeat] = useState([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [note, setNote] = useState('');
  const [price, setPrice] = useState('');
  const [paymentStatus, setPaymentStatus] = useState();

  const seatCustomerSelected = props.data.number_seat_selected
    .map((e) => e.seat)
    .join()
    .split(',')
    .map((e) => e.trim());

  const handleSeatSelected = useCallback(
    (id) => {
      let cloneSeatSelected = [...seatSelected];
      if (!cloneSeatSelected.includes(id)) {
        cloneSeatSelected.push(id);
      } else {
        cloneSeatSelected.splice(cloneSeatSelected.indexOf(id), 1);
      }
      setSeatSelected(cloneSeatSelected);
    },
    [seatSelected]
  );
  const handleOpenSeatInformation = async (data) => {
    onOpen();
    if (!data) {
      setSeat([]);
      setUserName('');
      setUserPhone('');
      setUserEmail('');
      setNote('');
      setPrice(props.scheduleData.price);
      setPaymentStatus(0);
      return;
    }
    const getTransaction = await axios.post(
      `http://localhost:${props.port}/transaction/get-transaction-by-id`,
      { id: data.id },
      {
        headers: { token: props.token },
      }
    );
    if (getTransaction.data.statusCode == 200) {
      let userInformation = getTransaction.data.data.transaction;
      setSeat(userInformation.seat.split(', '));
      setUserName(userInformation.passenger_name);
      setUserPhone(userInformation.passenger_phone);
      setUserEmail(userInformation.passenger_email);
      setNote(userInformation.tranship_address);
      setPrice(userInformation.ticket_price);
      setPaymentStatus(userInformation.payment_status);
    }
  };
  const ModalHTML = (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize={'3xl'} textAlign="center">
            Thông tin khách hàng
          </Text>
        </ModalHeader>
        <ModalBody>
          <Stack divider={<StackDivider />} spacing="7">
            <Box>
              <FormControl isRequired isInvalid={false}>
                <Flex alignItems={'center'}>
                  <FormLabel fontWeight={'500'} mt={'2'}>
                    Ghế đã chọn:
                  </FormLabel>
                  <Flex maxW={'80%'} overflowX="auto">
                    {seat.map((seat) => {
                      return (
                        <Flex
                          backgroundColor={'#d6d6d6'}
                          minWidth="55px"
                          minHeight="25px"
                          paddingLeft="7px"
                          borderRadius={'5px'}
                          alignItems="center"
                          justifyContent={'space-between'}
                          marginRight="10px"
                        >
                          <Text fontWeight={'500'}>{seat}</Text>{' '}
                          <SmallCloseIcon cursor={'pointer'} />
                        </Flex>
                      );
                    })}
                    <Flex
                      backgroundColor={'#d6d6d6'}
                      width="25px"
                      height="25px"
                      borderRadius={'5px'}
                      alignItems="center"
                      justifyContent={'center'}
                    >
                      <SmallAddIcon cursor={'pointer'} />
                    </Flex>
                  </Flex>
                </Flex>
                <FormErrorMessage justifyContent={'flex-end'}>
                  Ghế đã chọn là bắt buộc
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box>
              <FormControl marginBottom="5%" isRequired isInvalid={false}>
                <Flex>
                  <FormLabel width={'51.5%'} fontWeight={'500'} mt={'2'}>
                    Hành khách:
                  </FormLabel>
                  <Input value={userName} />
                </Flex>
                <FormErrorMessage justifyContent={'flex-end'}>
                  Hành khách là bắt buộc
                </FormErrorMessage>
              </FormControl>
              <FormControl marginBottom="5%" isInvalid={false}>
                <Flex>
                  <Text width={'51.5%'} fontWeight={'500'} mt="2">
                    Email
                  </Text>
                  <Input value={userEmail} />
                </Flex>
                <FormErrorMessage justifyContent={'flex-end'}>Email sai định dạng</FormErrorMessage>
              </FormControl>

              <FormControl marginBottom="5%" isRequired isInvalid={false}>
                <Flex>
                  <FormLabel width={'51.5%'} fontWeight={'500'} mt={'2'}>
                    Số điện thoại
                  </FormLabel>
                  <Input value={userPhone} />
                </Flex>
                <FormErrorMessage justifyContent={'flex-end'}>
                  {userPhone == '' ? 'Số điện thoại là bắt buộc' : 'Số điện thoại sai định dạng'}
                </FormErrorMessage>
              </FormControl>
              <FormControl marginBottom="5%">
                <Flex>
                  <Text width={'51.5%'} fontWeight={'500'} mt="2">
                    Ghi chú
                  </Text>
                  <Textarea value={note} />
                </Flex>
              </FormControl>
            </Box>
            <Box>
              <FormControl marginBottom="5%">
                <Flex>
                  <FormLabel width={'51.5%'} fontWeight={'500'}>
                    Điểm đón
                  </FormLabel>
                  <Select placeholder="Chọn điểm đón"></Select>
                </Flex>
              </FormControl>
              <FormControl>
                <Flex>
                  <FormLabel width={'51.5%'} fontWeight={'500'}>
                    Điểm trả
                  </FormLabel>
                  <Select placeholder="Chọn điểm trả"></Select>
                </Flex>
              </FormControl>
            </Box>
            <Box>
              <FormControl marginBottom="5%" isRequired isInvalid={false}>
                <Flex>
                  <FormLabel width={'51.5%'} fontWeight={'500'} mt={'2'}>
                    Giá vé:
                  </FormLabel>
                  <Input value={formatMoney(props.scheduleData.price)} />
                </Flex>
              </FormControl>
              <FormControl marginBottom="5%">
                <Flex>
                  <FormLabel width={'51.5%'} fontWeight={'500'}>
                    Hình thức thanh toán
                  </FormLabel>
                  <Select placeholder="Chọn hình thức thanh toán" value={paymentStatus}>
                    <option value="2">Thanh toán khi lên xe</option>
                    <option value="1">Thanh toán VNPAY - QR</option>
                  </Select>
                </Flex>
              </FormControl>
              <FormControl marginBottom="5%">
                <Flex>
                  <FormLabel width={'51.5%'} fontWeight={'500'}>
                    Tình trạng thanh toán
                  </FormLabel>
                  <Select placeholder="Chọn tình trạng thanh toán" value={paymentStatus}>
                    <option value="2">Chưa thanh toán</option>
                    <option value="1">Đã thanh toán</option>
                  </Select>
                </Flex>
              </FormControl>
            </Box>
            <Box>
              <Flex
                marginBottom="5%"
                justifyContent={'space-between'}
                fontWeight="600"
                color="#363636"
                fontSize={'18px'}
              >
                <Text>Tổng tiền:</Text>
                <Text>{formatMoney(price)}</Text>
              </Flex>
              <Flex>
                <Flex justifyContent={"space-between"}>
                  <Button backgroundColor={'#fff'} border="1px solid" marginRight={'10px'}>
                    Huỷ vé
                  </Button>
                  <Button backgroundColor={'#fff'} border="1px solid">
                    Hoàn tác
                  </Button>
                </Flex>
                <Flex>
                  <Button backgroundColor="#F26A4C" color="#fff" marginRight={'10px'}>
                    Cập nhật
                  </Button>
                  <Button backgroundColor={'#fff'} border="1px solid" onClick={onClose}>
                    Đóng
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );

  const seatHTML = (id) => {
    let position;
    props.data.number_seat_selected
      .map((e) => e.seat)
      .forEach((element, index) => {
        if (element.includes(id)) {
          position = index;
        }
      });

    return (
      <Box
        border={'1px solid'}
        padding="5px 10px"
        fontWeight={600}
        minW="155px"
        maxW="155px"
        minH={'96px'}
        maxH={'96px'}
        marginRight={'10px'}
        cursor={'pointer'}
        backgroundColor={seatSelected.includes(id) ? '#F2CAC2' : '#fff'}
        _hover={{ backgroundColor: '#F2CAC2' }}
        onClick={() => handleSeatSelected(id)}
        onDoubleClick={() => handleOpenSeatInformation(props.data.number_seat_selected[position])}
      >
        {seatCustomerSelected.includes(id) ? (
          <>
            <Text marginBottom={'1%'}>{id}</Text>
            <Text fontSize="13px" marginBottom={'2%'}>
              {props.data.number_seat_selected[position].passenger_name}
            </Text>
            <Text color={'#363636'} fontSize="11px" marginBottom={'2%'}>
              {props.data.number_seat_selected[position].passenger_phone}
            </Text>
            <Flex color={'#363636'} fontSize="10px" justifyContent={'space-between'}>
              <Text>Tại bến</Text>
              <Text>Dọc đường</Text>
            </Flex>
          </>
        ) : (
          <AddIcon position={'relative'} left="60px" top="30px" />
        )}
      </Box>
    );
  };

  return (
    <Card backgroundColor={'#F5F5F5'} margin="3% 0">
      <CardBody margin={'0 auto'} w="100%">
        <Box>
          <Flex marginBottom={'20px'} justifyContent="space-around">
            <Flex>
              {seatHTML('A1')}
              {seatHTML('A2')}
            </Flex>
            <Flex>
              {seatHTML('A3')}
              {seatHTML('A4')}
            </Flex>
          </Flex>
          <Flex marginBottom={'20px'} justifyContent="space-around">
            <Flex>
              {seatHTML('B1')}
              {seatHTML('B2')}
            </Flex>
            <Flex>
              {seatHTML('B3')}
              {seatHTML('B4')}
            </Flex>
          </Flex>
          <Flex justifyContent="space-around">
            <Flex>
              {seatHTML('C1')}
              {seatHTML('C2')}
            </Flex>
            <Flex>
              {seatHTML('C3')}
              {seatHTML('C4')}
            </Flex>
          </Flex>
        </Box>
        {ModalHTML}
      </CardBody>
    </Card>
  );
}
