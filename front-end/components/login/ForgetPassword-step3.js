import { Input, InputGroup, Button, InputRightElement } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function ForgetPasswordStep3(props) {
  return (
    <div style={{ margin: '9% 10%' }}>
      <h1 className="bom-change-password-title">Đặt lại mật khẩu</h1>
      <div className="bom-login-form">
        <p>Nhập mật khẩu</p>
        <InputGroup size="md">
          <Input
            type={props.showPassword ? 'text' : 'password'}
            value={props.password}
            onChange={props.handleChangePasswordValue}
            placeholder="Mật khẩu"
          />
          <InputRightElement width="3.5rem" onClick={props.handleShowPassword}>
            {!props.showPassword ? <ViewIcon /> : <ViewOffIcon />}
          </InputRightElement>
        </InputGroup>
        <p>Xác nhận mật khẩu</p>
        <InputGroup size="md">
          <Input
            type={props.showPassword ? 'text' : 'password'}
            value={props.password}
            onChange={props.handleChangePasswordValue}
            placeholder="Xác nhận mật khẩu"
          />
          <InputRightElement width="3.5rem" onClick={props.handleShowPassword}>
            {!props.showPassword ? <ViewIcon /> : <ViewOffIcon />}
          </InputRightElement>
        </InputGroup>
        <Button variant="solid" onClick={props.handleForgetPassword}>
          Đặt lại mật khẩu
        </Button>
        {props.stepForgetPasswordHTML}
      </div>
    </div>
  );
}
