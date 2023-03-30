import {
  Box,
  Text,
  Input,
  InputGroup,
  InputLeftAddon,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';

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
          <FormControl isRequired isInvalid={props.error?.userName} marginBottom={'3%'}>
            <FormLabel marginBottom={'1%'} fontWeight="500">
              Họ và tên
            </FormLabel>
            <Input
              placeholder="Tên người đi"
              border={'1px solid #000'}
              value={props.userName}
              onChange={props.handleChangeUserName}
            />
            <FormErrorMessage>Họ và tên là bắt buộc</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={props.error?.userPhone} marginBottom={'3%'}>
            <FormLabel marginBottom={'1%'} fontWeight="500">
              Số điện thoại
            </FormLabel>
            <InputGroup border={'1px solid #000'} borderRadius="7px">
              <InputLeftAddon children="+84" />
              <Input
                type="tel"
                placeholder="Số điện thoại"
                value={props.phone}
                onChange={props.handleChangePhone}
              />
            </InputGroup>
            <FormErrorMessage>
              {' '}
              {props.phone == '' ? 'Số điện thoại là bắt buộc' : 'Số điện thoại sai định dạng'}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={props.error?.userMail} marginBottom={'3%'}>
            <FormLabel marginBottom={'1%'} fontWeight="500">
              Email để nhận thông tin vé
            </FormLabel>
            <Input
              placeholder="Email để nhận thông tin vé"
              border={'1px solid #000'}
              value={props.email}
              onChange={props.handleChangeEmail}
            />
            <FormErrorMessage>Email sai định dạng</FormErrorMessage>
          </FormControl>
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
