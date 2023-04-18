import { useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Text, Card, CardBody, Flex, Box, useDisclosure } from '@chakra-ui/react';
import TransactionDetails from '@/components/ticket/transaction-detail';
import { formatMoney } from '@/helper';

export default function Seat12User(props) {
  const seatVehicle = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4'];

  const ModalHTML = (
    <TransactionDetails
      data={props.data}
      setData={props.setData}
      port={props.port}
      scheduleData={props.scheduleData}
      seatCustomerSelected={props.seatCustomerSelected}
      seatVehicle={seatVehicle}
      setSeatCustomerSelected={props.setSeatCustomerSelected}
      isOpen={props.isOpen}
      onOpen={props.onOpen}
      onClose={props.onClose}
      seatInformation={props.seatInformation}
      departureDay={props.departureDay}
      axiosJWT={props.axiosJWT}
      token={props.token}
    />
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
    let numberSeat = props.data.number_seat_selected[position]?.seat
      ? props.data.number_seat_selected[position]?.seat.split(', ').length
      : 1;
    let priceText = formatMoney(props.scheduleData.price);
    let paymentStatus =
      props.data.number_seat_selected[position]?.payment_status == 0
        ? 'Chưa thanh toán'
        : 'Đã thanh toán';

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
        backgroundColor={props.seatSelected.includes(id) ? '#F2CAC2' : '#fff'}
        _hover={{ backgroundColor: '#F2CAC2' }}
        onClick={() => props.handleSeatSelected(id)}
        onDoubleClick={() =>
          props.handleOpenSeatInformation(props.data.number_seat_selected[position], [id])
        }
      >
        {props.seatCustomerSelected.includes(id) ? (
          <>
            <Text marginBottom={'1%'}>{id}</Text>
            <Text fontSize="13px" marginBottom={'2%'}>
              {props.data.number_seat_selected[position]?.passenger_name}
            </Text>
            <Text color={'#363636'} fontSize="11px" marginBottom={'2%'}>
              {props.data.number_seat_selected[position]?.passenger_phone}
            </Text>
            <Flex color={'#363636'} fontSize="10px" justifyContent={'space-between'}>
              <Text
                color={
                  props.data.number_seat_selected[position]?.payment_status == 0 ? 'red' : 'green'
                }
              >
                {paymentStatus}
              </Text>
              <Text>{priceText}</Text>
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
