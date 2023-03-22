import { Box, Flex, Text, Stack } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
export default function BusScheduleBookTicketStep(props) {
  return (
    <Box>
      <Flex className="bom-book-ticket-steps">
        <Flex alignItems={'center'}>
          <div
            className={props.step == 1 ? 'bom-step active' : 'bom-step'}
            style={props.step != 1 ? { backgroundColor: '#F26A4C', opacity: '0.6' } : {}}
          >
            {props.step != 1 ? <CheckIcon /> : 1}
          </div>
          <Text>Chỗ mong muốn</Text>
        </Flex>
        <span style={props.step != 1 ? { color: '#F26A4C' } : {}}>
          &mdash;&mdash;&mdash;&mdash;&mdash;
        </span>
        <Flex alignItems={'center'}>
          <div
            className={props.step == 2 ? 'bom-step active' : 'bom-step'}
            style={props.step > 2 ? { backgroundColor: '#F26A4C', opacity: '0.6' } : {}}
          >
            {props.step > 2 ? <CheckIcon /> : 2}
          </div>
          <Text>Điểm đón, trả</Text>
        </Flex>
        <span style={props.step > 2 ? { color: '#F26A4C' } : {}}>
          &mdash;&mdash;&mdash;&mdash;&mdash;
        </span>
        <Flex alignItems={'center'}>
          <div
            className={props.step == 3 ? 'bom-step active' : 'bom-step'}
            style={props.step > 3 ? { backgroundColor: '#F26A4C', opacity: '0.6' } : {}}
          >
            {props.step > 3 ? <CheckIcon /> : 3}
          </div>
          <Text>Nhập thông tin</Text>
        </Flex>
      </Flex>
    </Box>
  );
}
