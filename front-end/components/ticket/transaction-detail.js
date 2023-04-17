import {
  Text,
  Flex,
  Box,
  Modal,
  StackDivider,
  Radio,
  RadioGroup,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Stack,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Button,
  Textarea,
} from '@chakra-ui/react';
import axios from 'axios';
import { convertTime, formatMoney, validate } from '@/helper';
import { useCallback, useEffect, useState } from 'react';
import { SmallCloseIcon, SmallAddIcon } from '@chakra-ui/icons';
import { GoLocation } from 'react-icons/go';

export default function TransactionDetails(props) {
  const [statusAddSeat, setStatusAddSeat] = useState(false);
  const [seat, setSeat] = useState([]);
  const [transactionId, setTransactionId] = useState();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  //radio value
  const [locationPick, setLocationPick] = useState('');
  const [locationDrop, setLocationDrop] = useState('');

  //db value
  const [locationPickup, setLocationPickup] = useState('');
  const [locationDropOff, setLocationDropOff] = useState('');

  const [note, setNote] = useState('');
  const [price, setPrice] = useState('');
  const [addSeat, setAddSeat] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(0);
  const [error, setError] = useState({
    userName: false,
    userEmail: false,
    userPhone: false,
    paymentStatus: false,
    pickupLocation: false,
    dropOffLocation: false,
  });

  const handleChangeUserName = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value) {
        oldError.userName = true;
      } else {
        oldError.userName = false;
      }
      setError(oldError);
      setUserName(value);
    },
    [error]
  );

  const handleChangePaymentStatus = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value) {
        oldError.paymentStatus = true;
      } else {
        oldError.paymentStatus = false;
      }
      setError(oldError);
      setPaymentStatus(value);
    },
    [error]
  );

  const handleChangeUserEmail = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (value) {
        if (!value.match(validate.email)) {
          oldError.userEmail = true;
        } else {
          oldError.userEmail = false;
        }
      } else {
        oldError.userEmail = false;
      }
      setError(oldError);
      setUserEmail(value);
    },
    [error]
  );
  const handleChangeUserPhone = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value || !value.match(validate.phone)) {
        oldError.userPhone = true;
      } else {
        oldError.userPhone = false;
      }
      setError(oldError);
      setUserPhone(value);
    },
    [error]
  );

  const handleChangeNote = useCallback((e) => {
    let value = e.target.value;
    setNote(value);
  });

  const deleteSeatSelected = useCallback(
    (id) => {
      let cloneSeat = [...seat];
      cloneSeat.splice(seat.indexOf(id), 1);
      setSeat(cloneSeat);
    },
    [seat]
  );

  const handleAddNewSeat = useCallback(
    (id) => {
      setStatusAddSeat(!statusAddSeat);
    },
    [seat, statusAddSeat]
  );
  const handleChangeLocationPick = useCallback(
    (value) => {
      let oldError = { ...error };
      if (!value) {
        oldError.pickupLocation = true;
      } else {
        oldError.pickupLocation = false;
      }
      if (value != '#') {
        setLocationPickup(value);
      }
      setLocationPick(value);
    },
    [error]
  );

  const handleChangeLocationDrop = useCallback(
    (value) => {
      let oldError = { ...error };
      if (!value) {
        oldError.dropOffLocation = true;
      } else {
        oldError.dropOffLocation = false;
      }
      if (value != '#') {
        setLocationDropOff(value);
      }
      setLocationDrop(value);
    },
    [error]
  );

  const addNewSeat = useCallback(() => {
    let checkSeatRemain = props.seatVehicle.filter(
      (s) => !props.seatCustomerSelected.includes(s) && !seat.includes(s)
    );
    let cloneSeat = [...seat];
    if (checkSeatRemain.length == 1) {
      cloneSeat.push(checkSeatRemain[0]);
    } else {
      if (!cloneSeat.includes(addSeat)) {
        cloneSeat.push(addSeat);
      }
    }
    setSeat(cloneSeat);
    setStatusAddSeat(false);
  }, [seat, addSeat, props.seatCustomerSelected]);

  const getTransactionById = useCallback(async () => {
    const getTransaction = await axios.post(
      `http://localhost:${props.port}/transaction/get-transaction-by-id`,
      { id: props.seatInformation.id },
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
      setPrice(userInformation.ticket_price);
      setPaymentStatus(userInformation.payment_status);
      setNote(userInformation.note);
      setTransactionId(userInformation.id);

      if (userInformation.pickup_location.includes('dọc đường')) {
        setLocationPick('#');
      } else {
        setLocationPick(userInformation.pickup_location);
      }
      setLocationPickup(userInformation.pickup_location);

      if (userInformation.drop_off_location.includes('dọc đường')) {
        setLocationDrop('#');
      } else {
        setLocationDrop(userInformation.drop_off_location);
      }
      setLocationDropOff(userInformation.drop_off_location);
    }
  }, [props.data, props.seatInformation]);

  const updateUserInformation = useCallback(
    async (status) => {
      let cloneError = { ...error };
      if (!userName) {
        cloneError.userName = true;
      }
      if (!userEmail) {
        cloneError.userEmail = true;
      }
      if (!userPhone) {
        cloneError.userPhone = true;
      }
      if (!locationPickup) {
        cloneError.pickupLocation = true;
      }
      if (!locationDropOff) {
        cloneError.dropOffLocation = true;
      }
      if (
        cloneError.userName ||
        cloneError.userEmail ||
        cloneError.userPhone ||
        cloneError.pickupLocation ||
        cloneError.dropOffLocation
      ) {
        setError(cloneError);
        return;
      }
      let submitData = {
        passenger_name: userName,
        email: userEmail,
        passenger_phone: userPhone,
        note: note,
        seat: seat.join(', '),
        payment_status: paymentStatus,
        pickup_location: locationPickup,
        drop_off_location: locationDropOff,
      };

      let cloneSeatCustomerSelected = [...props.seatCustomerSelected];
      let cloneData = { ...props.data };

      if (seat.length > 1 && status == 'hủy vé') {
        cloneSeatCustomerSelected.splice(
          cloneSeatCustomerSelected.indexOf(props.seatInformation.seat_selected[0]),
          1
        );
      }
      seat.forEach((s) => {
        if (status == 'hủy vé') {
          seat.length == 1
            ? cloneSeatCustomerSelected.splice(cloneSeatCustomerSelected.indexOf(s), 1)
            : null;
          return;
        }
        if (!cloneSeatCustomerSelected.includes(s)) {
          cloneSeatCustomerSelected.push(s);
        }
      });
      if (transactionId) {
        let cloneSeat = [...seat];
        if (seat.length > 1) {
          cloneSeat.splice(seat.indexOf(props.seatInformation.seat_selected[0]), 1);
        }
        cloneData.number_seat_selected.forEach((s) => {
          if (s.id == transactionId) {
            s.seat = seat.join(', ');
            s.passenger_name = userName;
            s.passenger_email = userEmail;
            s.passenger_phone = userPhone;
            s.payment_status = paymentStatus;
            s.note = note;
            s.pickup_location = locationPickup;
            s.drop_off_location = locationDropOff;
            if (status == 'hủy vé') {
              if (seat.length > 1) {
                s.seat = cloneSeat.join(', ');
                s.ticket_price = cloneSeat.length * props.scheduleData.price;
              } else {
                s.payment_status = 3;
              }
            }
          }
        });
        submitData.id = transactionId;
        if (status == 'hủy vé') {
          if (seat.length > 1) {
            submitData.seat = cloneSeat.join(', ');
            submitData.ticket_price = cloneSeat.length * props.scheduleData.price;
          } else {
            submitData = {
              id: transactionId,
              payment_status: 3,
            };
          }
        }
        cloneData.number_seat_selected = cloneData.number_seat_selected.filter(
          (e) => e.payment_status != 3
        );

        const updateTransactionById = await axios.put(
          `http://localhost:${props.port}/transaction/update-transaction`,
          submitData,
          {
            headers: { token: props.token },
          }
        );
        if (updateTransactionById.data.statusCode == 200) {
          props.setSeatCustomerSelected(cloneSeatCustomerSelected);
          props.setData(cloneData);
          props.onClose();
        } else {
        }
      } else {
        submitData.ticket_price = props.scheduleData.price * seat.length;
        submitData.transport = props.data.id;
        submitData.created_by = null;
        submitData.cashier = 8;
        submitData.bankCode = '';
        submitData.paymentStatusType = 1;
        submitData.date_detail =
          props.departureDay +
          '  ' +
          convertTime(props.scheduleData.time_from, 0) +
          '-' +
          convertTime(props.scheduleData.time_from, props.scheduleData.travel_time);
        const createTransactionById = await axios.post(
          `http://localhost:${props.port}/transaction/create-payment`,
          submitData
        );
        if (createTransactionById.data.statusCode == 200) {
          cloneData.number_seat_selected.push(createTransactionById.data.data);
          props.setData(cloneData);
          props.setSeatCustomerSelected(cloneSeatCustomerSelected);
          props.onClose();
        } else {
        }
      }
    },
    [
      userEmail,
      transactionId,
      userName,
      paymentStatus,
      userPhone,
      locationDrop,
      locationPick,
      locationPickup,
      locationDropOff,
      note,
      price,
      seat,
      error,
      props.data,
      props.seatCustomerSelected,
      props.seatInformation,
    ]
  );

  let location_pickup = props.scheduleData.location_bus_schedule
    ? props.scheduleData.location_bus_schedule.filter((e) => {
        return e.bus_location_type == 0;
      })[0]?.bus_detail
    : [];

  let addressPickup = props.scheduleData.location_bus_schedule
    ? props.scheduleData.location_bus_schedule.filter((e) => {
        return e.bus_location_type == 0;
      })[0]?.bus_location_address
    : [];

  let location_dropOff = props.scheduleData.location_bus_schedule
    ? props.scheduleData.location_bus_schedule.filter((e) => {
        return e.bus_location_type == 1;
      })[0]?.bus_detail
    : [];

  let addressDropOff = props.scheduleData.location_bus_schedule
    ? props.scheduleData.location_bus_schedule.filter((e) => {
        return e.bus_location_type == 1;
      })[0]?.bus_location_address
    : [];

  location_pickup =
    location_pickup && location_pickup.length ? JSON.parse(location_pickup) : location_pickup;

  location_dropOff =
    location_dropOff && location_dropOff.length ? JSON.parse(location_dropOff) : location_dropOff;

  addressPickup = addressPickup && addressPickup.length ? JSON.parse(addressPickup) : addressPickup;

  addressDropOff =
    addressDropOff && addressDropOff.length ? JSON.parse(addressDropOff) : addressDropOff;

  const locationPickupHTML = location_pickup ? (
    location_pickup.map((location, index) => {
      const information = location.split(': ');
      const time = information[1];
      const position = information[0];
      const date = new Date(props.data.departure_date);
      const value = time + ' - ' + position;
      return (
        <Stack marginBottom={index != location_pickup.length - 1 ? '10px' : ''} marginLeft={'5px'}>
          <Radio value={value}>
            <Flex
              marginBottom={'2%!important'}
              color={value == locationPickup ? '#F26A4C' : '#363636'}
            >
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
            marginTop={'5px!important'}
            marginBottom="8px!important"
          >
            <GoLocation />
            <Text marginLeft="3%" fontSize={'12px'}>
              {addressPickup[index]}
            </Text>
          </Flex>
        </Stack>
      );
    })
  ) : (
    <Text>Không có điểm đón</Text>
  );
  const locationDropOffHTML = location_dropOff ? (
    location_dropOff.map((location, index) => {
      const information = location.split(': ');
      const time = information[1];
      const position = information[0];
      const date = new Date(props.data.departure_date);
      const value = time + ' - ' + position;
      return (
        <Stack marginBottom={'10px'} marginLeft={'5px'}>
          <Radio value={value}>
            <Flex
              marginBottom={'2%!important'}
              color={value == locationDropOff ? '#F26A4C' : '#363636'}
            >
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
  useEffect(() => {
    if (props.isOpen) {
      if (props.seatInformation && !props.seatInformation.id) {
        setSeat(props.seatInformation.seat_selected);
        setUserName('');
        setUserPhone('');
        setUserEmail('');
        setNote('');
        setPrice(props.scheduleData.price);
        setPaymentStatus(0);
        setTransactionId(0);
        setLocationDrop(0);
        setLocationPick(0);
        setLocationDropOff('');
        setLocationPickup('');
      } else {
        getTransactionById();
      }
    }
  }, [props.isOpen, props.seatInformation]);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="md">
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
                  <FormLabel fontWeight={'500'} mt={'2'} w="35%">
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
                          <SmallCloseIcon
                            cursor={'pointer'}
                            onClick={() => deleteSeatSelected(seat)}
                          />
                        </Flex>
                      );
                    })}
                    {props.seatVehicle.filter(
                      (s) => !props.seatCustomerSelected.includes(s) && !seat.includes(s)
                    ).length > 0 && (
                      <Flex
                        backgroundColor={'#d6d6d6'}
                        minW="25px"
                        minH="25px"
                        borderRadius={'5px'}
                        alignItems="center"
                        justifyContent={'center'}
                      >
                        <SmallAddIcon cursor={'pointer'} onClick={handleAddNewSeat} />
                      </Flex>
                    )}
                  </Flex>
                </Flex>
                <FormErrorMessage justifyContent={'flex-end'}>
                  Ghế đã chọn là bắt buộc
                </FormErrorMessage>
              </FormControl>
              <Box
                marginTop={'3%'}
                boxShadow={'3px 2px 10px 0px #ccc'}
                padding={'10px'}
                w="90%"
                display={
                  statusAddSeat &&
                  props.seatVehicle.filter(
                    (s) => !props.seatCustomerSelected.includes(s) && !seat.includes(s)
                  ).length > 0
                    ? 'block'
                    : 'none'
                }
                position={'absolute'}
                zIndex={'999'}
                backgroundColor={'#fff'}
              >
                <FormControl isRequired alignItems={'center'}>
                  <Flex alignItems={'center'}>
                    <Flex width={'80%'} alignItems={'center'}>
                      <FormLabel width={'50%'}>Thêm ghế:</FormLabel>
                      <Select value={addSeat} onChange={(e) => setAddSeat(e.target.value)}>
                        {props.seatVehicle
                          .filter(
                            (s) => !props.seatCustomerSelected.includes(s) && !seat.includes(s)
                          )
                          .map((s) => {
                            return <option value={s}>{s}</option>;
                          })}
                      </Select>
                    </Flex>

                    <Button marginLeft={'5%'} colorScheme="blue" onClick={addNewSeat}>
                      Thêm
                    </Button>
                  </Flex>
                </FormControl>
              </Box>
            </Box>
            <Box>
              <FormControl marginBottom="5%" isRequired isInvalid={error.userName}>
                <Flex>
                  <FormLabel width={'51.5%'} fontWeight={'500'} mt={'2'}>
                    Hành khách:
                  </FormLabel>
                  <Input value={userName} onChange={handleChangeUserName} />
                </Flex>
                <FormErrorMessage justifyContent={'flex-end'}>
                  Hành khách là bắt buộc
                </FormErrorMessage>
              </FormControl>
              <FormControl marginBottom="5%" isInvalid={error.userEmail}>
                <Flex>
                  <Text width={'55%'} fontWeight={'500'} mt="2">
                    Email:
                  </Text>
                  <Input value={userEmail} onChange={handleChangeUserEmail} />
                </Flex>
                <FormErrorMessage justifyContent={'flex-end'}>Email sai định dạng</FormErrorMessage>
              </FormControl>

              <FormControl marginBottom="5%" isRequired isInvalid={error.userPhone}>
                <Flex>
                  <FormLabel width={'50%'} fontWeight={'500'} mt={'2'}>
                    Số điện thoại:
                  </FormLabel>
                  <Input value={userPhone} onChange={handleChangeUserPhone} />
                </Flex>
                <FormErrorMessage justifyContent={'flex-end'}>
                  {userPhone == '' ? 'Số điện thoại là bắt buộc' : 'Số điện thoại sai định dạng'}
                </FormErrorMessage>
              </FormControl>
              <FormControl marginBottom="5%">
                <Flex>
                  <Text width={'55%'} fontWeight={'500'} mt="2">
                    Ghi chú:
                  </Text>
                  <Textarea value={note} onChange={handleChangeNote} />
                </Flex>
              </FormControl>
            </Box>
            <Box>
              <FormControl marginBottom="5%" isInvalid={error.pickupLocation}>
                <Flex>
                  <FormLabel width={'51.5%'} fontWeight={'500'}>
                    Điểm đón:
                  </FormLabel>
                </Flex>
                <FormErrorMessage justifyContent={'flex-end'}>
                  Điểm đón là bắt buộc
                </FormErrorMessage>
                <>
                  <RadioGroup
                    value={locationPick}
                    onChange={(e) => handleChangeLocationPick(e)}
                    maxHeight={'250px'}
                    overflowY={'auto'}
                    margin={'10px 0'}
                  >
                    {locationPickupHTML}
                    <Stack marginBottom={'10px'} marginLeft={'5px'}>
                      <Radio value="#">
                        <Text fontWeight={'500'} fontSize={'16px'}>
                          Khác
                        </Text>
                      </Radio>
                      {locationPick == '#' && (
                        <Textarea
                          marginLeft="33px!important"
                          w="320px"
                          marginTop={'5px!important'}
                          value={locationPickup}
                          onChange={(e) => setLocationPickup(e.target.value)}
                        ></Textarea>
                      )}
                    </Stack>
                  </RadioGroup>
                </>
              </FormControl>
              <FormControl isInvalid={error.dropOffLocation}>
                <Flex>
                  <FormLabel width={'51.5%'} fontWeight={'500'}>
                    Điểm trả:
                  </FormLabel>
                </Flex>
                <FormErrorMessage justifyContent={'flex-end'}>
                  Điểm trả là bắt buộc
                </FormErrorMessage>
                <RadioGroup
                  value={locationDrop}
                  onChange={(e) => handleChangeLocationDrop(e)}
                  maxHeight={'250px'}
                  overflowY={'auto'}
                  margin={'10px 0'}
                >
                  {locationDropOffHTML}
                  <Stack marginBottom={'10px'} marginLeft={'5px'}>
                    <>
                      <Radio value="#">
                        <Text fontWeight={'500'} fontSize={'16px'}>
                          Khác
                        </Text>
                      </Radio>
                      {locationDrop == '#' && (
                        <Textarea
                          marginLeft="33px!important"
                          w="320px"
                          marginTop={'5px!important'}
                          value={locationDropOff}
                          onChange={(e) => setLocationDropOff(e.target.value)}
                        ></Textarea>
                      )}
                    </>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </Box>
            <Box>
              <FormControl marginBottom="5%" isRequired isInvalid={false}>
                <Flex>
                  <FormLabel width={'51.5%'} fontWeight={'500'} mt={'2'}>
                    Giá vé:
                  </FormLabel>
                  <Input value={formatMoney(props.scheduleData.price)} disabled />
                </Flex>
              </FormControl>
              <FormControl marginBottom="5%">
                <Flex>
                  <FormLabel width={'51.5%'} fontWeight={'500'}>
                    Trạng thái thanh toán
                  </FormLabel>
                  <Select value={paymentStatus} onChange={(e) => handleChangePaymentStatus(e)}>
                    <option value="0">Chưa thanh toán</option>
                    <option value="1">Đã thanh toán</option>
                  </Select>
                </Flex>
              </FormControl>
            </Box>
            <Box marginBottom={'5%'}>
              <Flex
                marginBottom="5%"
                justifyContent={'space-between'}
                fontWeight="600"
                color="#363636"
                fontSize={'18px'}
              >
                <Text>Tổng tiền:</Text>
                <Text>{formatMoney(props.scheduleData.price * seat.length)}</Text>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <Flex>
                  <Button
                    backgroundColor={'#fff'}
                    border="1px solid"
                    marginRight={'10px'}
                    onClick={() => updateUserInformation('hủy vé')}
                  >
                    Huỷ vé
                  </Button>
                </Flex>
                <Flex>
                  <Button
                    backgroundColor="#F26A4C"
                    color="#fff"
                    marginRight={'10px'}
                    onClick={updateUserInformation}
                  >
                    Cập nhật
                  </Button>
                  <Button backgroundColor={'#fff'} border="1px solid" onClick={props.onClose}>
                    Đóng
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
