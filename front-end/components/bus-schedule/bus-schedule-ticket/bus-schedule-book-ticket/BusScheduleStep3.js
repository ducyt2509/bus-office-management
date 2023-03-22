import { Box, Text, Input, InputGroup, InputLeftAddon, Textarea } from '@chakra-ui/react';

export default function BusScheduleStep3(props) {
  return (
    <>
      <Box
        borderTop="1px solid #E2E8F0"
        borderBottom="1px solid #E2E8F0"
        margin="3% auto"
        w={'75%'}
      >
        <div style={{ margin: '4% auto' }}>
          <Text marginBottom={'1%'} fontWeight="500">
            Họ và tên
          </Text>
          <Input
            marginBottom={'3%'}
            placeholder="Tên người đi"
            border={'1px solid #000'}
            value={props.userName}
            onChange={props.handleChangeUserName}
          />
          <Text marginBottom={'1%'} fontWeight="500">
            Số điện thoại
          </Text>
          <InputGroup marginBottom={'3%'} border={'1px solid #000'} borderRadius="7px">
            <InputLeftAddon children="+84" />
            <Input
              type="tel"
              placeholder="Số điện thoại"
              value={props.phone}
              onChange={props.handleChangePhone}
            />
          </InputGroup>
          <Text marginBottom={'1%'} fontWeight="500">
            Email để nhận thông tin vé
          </Text>
          <Input
            placeholder="Email để nhận thông tin vé"
            marginBottom={'3%'}
            border={'1px solid #000'}
            value={props.email}
            onChange={props.handleChangeEmail}
          />
          <Text marginBottom={'1%'} fontWeight="500">
            Ghi chú hoặc yêu cầu khác (Nếu có)
          </Text>
          <Textarea
            marginBottom={'3%'}
            minHeight="200px"
            border={'1px solid #000'}
            value={props.notice}
            onChange={props.handleChangeNotice}
          />
        </div>
      </Box>
    </>
  );
}
