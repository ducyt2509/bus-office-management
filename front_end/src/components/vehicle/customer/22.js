import { Flex, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import EmptyChair from '@/images/icons/empty-chair.png';
import SoldChair from '@/images/icons/sold-chair.png';
import SelectChair from '@/images/icons/select-chair.png';
import Steering from '@/images/icons/steering.png';
import { useCallback } from 'react';

export default function Seat22(props) {
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
          props.seatCustomerSelected && props.seatCustomerSelected.includes(id)
            ? { cursor: 'not-allowed', width: '43%', height: '100%' }
            : { cursor: 'pointer', width: '43%', height: '100%' }
        }
        onClick={() => {
          props.page != 'ticket detail' && handleSeatSelected(id);
        }}
      />
    );
  };
  const SteeringHTML = (
    <Image src={Steering} style={{ cursor: 'pointer', width: '25%', marginLeft: '10%' }} />
  );
  return (
    <Flex justifyContent="flex-end" width="30%">
      <Stack
        className="bom-vehicle-type"
        justifyContent={'space-evenly'}
        w={props.page == 'ticket detail' && '25%'}
        pointerEvents={props.page == 'ticket detail' && 'none'}
        width="50%"
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
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('A1')}
          </Flex>
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('A2')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('B1')}
          </Flex>
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('B2')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('C1')}
          </Flex>
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('C2')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('D1')}
          </Flex>
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('D2')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('E1')}
          </Flex>
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('E2')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('F1')}
          </Flex>
        </Flex>
      </Stack>
      <Stack
        className="bom-vehicle-type"
        justifyContent={'space-evenly'}
        w={props.page == 'ticket detail' && '25%'}
        pointerEvents={props.page == 'ticket detail' && 'none'}
        marginLeft="2%"
        width="50%"
      >
        <Text
          position="absolute"
          bottom="13%"
          marginLeft="4%"
          display={props.page == 'ticket detail' ? 'none' : 'block'}
        >
          Tầng 2
        </Text>
        <Flex marginBottom="8%">
          <Image src={Steering} style={{ cursor: 'pointer', width: '25%', opacity: 0 }} />
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('G1')}
          </Flex>
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('G2')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('H1')}
          </Flex>
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('H2')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('I1')}
          </Flex>
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('I2')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('K1')}
          </Flex>
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('K2')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('L1')}
          </Flex>
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('L2')}
          </Flex>
        </Flex>
        <Flex justifyContent={'space-between'} marginBottom="10% !important">
          <Flex width={'42%'} justifyContent="center">
            {ChairHTML('M1')}
          </Flex>
        </Flex>
      </Stack>
    </Flex>
  );
}
