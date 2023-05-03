import { useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Text, Card, CardBody, Flex, Box, useDisclosure } from '@chakra-ui/react';
import TransactionDetails from '@/src/components/ticket/transaction-detail';
import { formatMoney } from '@/helper';

export default function Seat38User(props) {
  const seatVehicle = [
    'A1',
    'A2',
    'A3',
    'B1',
    'B2',
    'B3',
    'C1',
    'C2',
    'C3',
    'D1',
    'D2',
    'D3',
    'E1',
    'E2',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'G1',
    'G2',
    'G3',
    'H1',
    'H2',
    'H3',
    'I1',
    'I2',
    'I3',
    'K1',
    'K2',
    'K3',
    'L1',
    'L2',
    'M1',
    'M2',
    'M3',
    'M4',
    'M5',
  ];

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
      isEnableEdit={props.isEnableEdit}
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
    <>
      <Card backgroundColor={'#F5F5F5'} margin="3% 0">
        <Text textAlign={'center'} fontWeight={'500'}>
          Tầng 1
        </Text>
        <CardBody margin={'0 auto'} w="100%">
          <Box>
            <Flex marginBottom={'20px'} justifyContent="space-around">
              <Flex className="bom-admin">{seatHTML('A1')}</Flex>
              <Flex className="bom-admin">{seatHTML('A2')}</Flex>
              <Flex className="bom-admin">{seatHTML('A3')}</Flex>
            </Flex>
            <Flex marginBottom={'20px'} justifyContent="space-around">
              <Flex className="bom-admin">{seatHTML('B1')}</Flex>
              <Flex className="bom-admin">{seatHTML('B2')}</Flex>
              <Flex className="bom-admin">{seatHTML('B3')}</Flex>
            </Flex>
            <Flex justifyContent="space-around" marginBottom={'20px'}>
              <Flex className="bom-admin">{seatHTML('C1')}</Flex>
              <Flex className="bom-admin">{seatHTML('C2')}</Flex>
              <Flex className="bom-admin">{seatHTML('C3')}</Flex>
            </Flex>
            <Flex justifyContent="space-around" marginBottom={'20px'}>
              <Flex className="bom-admin">{seatHTML('D1')}</Flex>
              <Flex className="bom-admin">{seatHTML('D2')}</Flex>
              <Flex className="bom-admin">{seatHTML('D3')}</Flex>
            </Flex>
            <Flex justifyContent="space-around" marginBottom={'20px'}>
              <Flex className="bom-admin">{seatHTML('E1')}</Flex>
              <Flex className="bom-admin">{seatHTML('E2')}</Flex>
            </Flex>
            <Flex justifyContent="space-around">
              <Flex className="bom-admin">{seatHTML('F1')}</Flex>
              <Flex className="bom-admin">{seatHTML('F2')}</Flex>
              <Flex className="bom-admin">{seatHTML('F3')}</Flex>
              <Flex className="bom-admin">{seatHTML('F4')}</Flex>
              <Flex className="bom-admin">{seatHTML('F5')}</Flex>
            </Flex>
          </Box>
        </CardBody>
      </Card>
      <Card backgroundColor={'#F5F5F5'} margin="3% 0">
        <Text textAlign={'center'} fontWeight={'500'}>
          Tầng 2
        </Text>
        <CardBody margin={'0 auto'} w="100%">
          <Box>
            <Flex marginBottom={'20px'} justifyContent="space-around">
              <Flex className="bom-admin">{seatHTML('G1')}</Flex>
              <Flex className="bom-admin">{seatHTML('G2')}</Flex>
              <Flex className="bom-admin">{seatHTML('G3')}</Flex>
            </Flex>
            <Flex marginBottom={'20px'} justifyContent="space-around">
              <Flex className="bom-admin">{seatHTML('H1')}</Flex>
              <Flex className="bom-admin">{seatHTML('H2')}</Flex>
              <Flex className="bom-admin">{seatHTML('H3')}</Flex>
            </Flex>
            <Flex justifyContent="space-around" marginBottom={'20px'}>
              <Flex className="bom-admin">{seatHTML('I1')}</Flex>
              <Flex className="bom-admin">{seatHTML('I2')}</Flex>
              <Flex className="bom-admin">{seatHTML('I3')}</Flex>
            </Flex>
            <Flex justifyContent="space-around" marginBottom={'20px'}>
              <Flex className="bom-admin">{seatHTML('K1')}</Flex>
              <Flex className="bom-admin">{seatHTML('K2')}</Flex>
              <Flex className="bom-admin">{seatHTML('K3')}</Flex>
            </Flex>
            <Flex justifyContent="space-around" marginBottom={'20px'}>
              <Flex className="bom-admin">{seatHTML('L1')}</Flex>
              <Flex className="bom-admin">{seatHTML('L2')}</Flex>
            </Flex>
            <Flex justifyContent="space-around">
              <Flex className="bom-admin">{seatHTML('M1')}</Flex>
              <Flex className="bom-admin">{seatHTML('M2')}</Flex>
              <Flex className="bom-admin">{seatHTML('M3')}</Flex>
              <Flex className="bom-admin">{seatHTML('M4')}</Flex>
              <Flex className="bom-admin">{seatHTML('M5')}</Flex>
            </Flex>
          </Box>
        </CardBody>
      </Card>
      {ModalHTML}
    </>
  );
}
