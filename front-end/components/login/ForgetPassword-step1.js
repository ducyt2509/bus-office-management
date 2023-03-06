import { Input, Button } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
export default function ForgetPasswordStep1(props) {
  return (
    <div style={{ margin: '14% 10%' }}>
      <h1 className="bom-forget-password-title">Quên mật khẩu</h1>
      <div className="bom-login-form">
        <p>Nhập số điện thoại/Email</p>
        <Input
          value={props.user}
          onChange={props.InputhandleChangeUserValue}
          placeholder="Nhập số điện thoại/Email"
          size="md"
        />
        <Button
          variant="solid"
          onClick={props.handleForgetPassword}
          className="bom-button-send-request"
        >
          Gửi yêu cầu
        </Button>
        {props.stepForgetPasswordHTML}
      </div>
    </div>
  );
}
