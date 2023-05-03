import { Flex, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import EmptyChair from '@/images/icons/empty-chair.png';
import SoldChair from '@/images/icons/sold-chair.png';
import SelectChair from '@/images/icons/select-chair.png';
import Steering from '@/images/icons/steering.png';
import { useCallback } from 'react';

export default function Seat44(props) {
  const handleSeatSelected = useCallback(
    (id) => {
      if (props.seatCustomerSelected && props.seatCustomerSelected.includes(id)) {
        return;
      }
      const oldSeat = [...props.seatSelected];
      if (!oldSeat.includes(id)) {
        oldSeat.push(id);
      } else {
        oldSeat.splice(oldSeat.indexOf(id), 1);
      }
      props.setSeatSelected(oldSeat);
    },
    [props.seatSelected]
  );

  const ChairHTML = (id) => {
    return (
      <Image
        src={
          props.seatSelected && props.seatSelected.includes(id)
            ? SelectChair
            : props.seatCustomerSelected && props.seatCustomerSelected.includes(id)
            ? SoldChair
            : EmptyChair
        }
        style={
          props.page == 'ticket detail'
            ? props.seatCustomerSelected && props.seatCustomerSelected.includes(id)
              ? { cursor: 'not-allowed', width: '20px', height: '100%' }
              : { cursor: 'pointer', width: '20px', height: '100%' }
            : props.seatCustomerSelected && props.seatCustomerSelected.includes(id)
            ? { cursor: 'not-allowed', width: '25px', height: '100%' }
            : { cursor: 'pointer', width: '25px', height: '100%' }
        }
        onClick={() => {
          props.page != 'ticket detail' && handleSeatSelected(id);
        }}
      />
    );
  };
  const SteeringHTML = (
    <Image src={Steering} style={{ cursor: 'pointer', width: '20%', marginLeft: '15%' }} />
  );
  return (
    <Flex justifyContent="space-between" width="30%">
      <Stack
        className="bom-vehicle-type"
        justifyContent={'space-evenly'}
        w={props.page == 'ticket detail' && '25%'}
        pointerEvents={props.page == 'ticket detail' && 'none'}
        width="48%"
      >
        <Text
          position="absolute"
          bottom="13%"
          marginLeft="4%"
          display={props.page == 'ticket detail' ? 'none' : 'block'}
        >
          Tầng 1
        </Text>
        <Flex marginBottom="8%">{SteeringHTML}</Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'28%'} justifyContent="flex-start">
            {ChairHTML('A1')}
          </Flex>
          <Flex width={'28%'} justifyContent="center">
            {ChairHTML('A2')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('A3')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'28%'} justifyContent="flex-start">
            {ChairHTML('B1')}
          </Flex>
          <Flex width={'28%'} justifyContent="center">
            {ChairHTML('B2')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('B3')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'28%'} justifyContent="flex-start">
            {ChairHTML('C1')}
          </Flex>
          <Flex width={'28%'} justifyContent="center">
            {ChairHTML('C2')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('C3')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'28%'} justifyContent="flex-start">
            {ChairHTML('D1')}
          </Flex>
          <Flex width={'28%'} justifyContent="center">
            {ChairHTML('D2')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('D3')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'28%'} justifyContent="flex-start">
            {ChairHTML('E1')}
          </Flex>
          <Flex width={'28%'} justifyContent="center">
            {ChairHTML('E2')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('E3')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('F1')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-start">
            {ChairHTML('F2')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'16.8%'} justifyContent="flex-start">
            {ChairHTML('G1')}
          </Flex>
          <Flex width={'16.8%'} justifyContent="center">
            {ChairHTML('G2')}
          </Flex>
          <Flex width={'16.8%'} justifyContent="center">
            {ChairHTML('G3')}
          </Flex>
          <Flex width={'16.8%'} justifyContent="center">
            {ChairHTML('G4')}
          </Flex>
          <Flex width={'16.8%'} justifyContent="flex-end">
            {ChairHTML('G5')}
          </Flex>
        </Flex>
      </Stack>
      <Stack
        className="bom-vehicle-type"
        justifyContent={'space-evenly'}
        w={props.page == 'ticket detail' && '25%'}
        pointerEvents={props.page == 'ticket detail' && 'none'}
        width="48%"
      >
        <Text
          position="absolute"
          bottom="13%"
          marginLeft="4%"
          display={props.page == 'ticket detail' ? 'none' : 'block'}
        >
          Tầng 2
        </Text>
        <Flex marginBottom="8%" opacity={0}>
          {SteeringHTML}
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'28%'} justifyContent="flex-start">
            {ChairHTML('H1')}
          </Flex>
          <Flex width={'28%'} justifyContent="center">
            {ChairHTML('H2')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('H3')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'28%'} justifyContent="flex-start">
            {ChairHTML('I1')}
          </Flex>
          <Flex width={'28%'} justifyContent="center">
            {ChairHTML('I2')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('I3')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'28%'} justifyContent="flex-start">
            {ChairHTML('K1')}
          </Flex>
          <Flex width={'28%'} justifyContent="center">
            {ChairHTML('K2')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('K3')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'28%'} justifyContent="flex-start">
            {ChairHTML('L1')}
          </Flex>
          <Flex width={'28%'} justifyContent="center">
            {ChairHTML('L2')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('L3')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'28%'} justifyContent="flex-start">
            {ChairHTML('M1')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('M2')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('M3')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'28%'} justifyContent="flex-start">
            {ChairHTML('N1')}
          </Flex>
          <Flex width={'28%'} justifyContent="flex-end">
            {ChairHTML('N2')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'16.8%'} justifyContent="flex-start">
            {ChairHTML('O1')}
          </Flex>
          <Flex width={'16.8%'} justifyContent="center">
            {ChairHTML('O2')}
          </Flex>
          <Flex width={'16.8%'} justifyContent="center">
            {ChairHTML('O3')}
          </Flex>
          <Flex width={'16.8%'} justifyContent="center">
            {ChairHTML('O4')}
          </Flex>
          <Flex width={'16.8%'} justifyContent="flex-end">
            {ChairHTML('O5')}
          </Flex>
        </Flex>
      </Stack>
    </Flex>
  );
}
