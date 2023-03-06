import {
  Text,
  Button,
  Stack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

export default function ForgetPasswordStep2(props) {
  return (
    <div style={{ margin: '-4% 10%' }}>
      <div className="bom-verify-otp-title">
        <h1 className="bom-verify-otp-title">Xác thực mã OTP</h1>
        <p>Mã xác thực đã được gửi qua SĐT: 0948****** </p>
      </div>
      <div className="bom-login-form">
        <Stack direction={['column', 'row']} spacing="5%">
          <input />
          <input disabled />
          <input disabled />
          <input disabled />
          <input disabled />
          <input disabled />
        </Stack>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text fontSize="md" style={props.showCountdownTime ? { opacity: 1 } : { opacity: 0 }}>
            Yêu cầu cấp lại mã sau {props.countdown} giây
          </Text>
          {!props.showCountdownTime && (
            <Text fontSize="md" onClick={props.handleResendOTP}>
              Gửi lại OTP
            </Text>
          )}
        </div>
        <Button variant="solid" onClick={props.handleForgetPassword} className="bom-button-verify">
          Xác thực
        </Button>
        {props.stepForgetPasswordHTML}
      </div>
    </div>
  );
}
