import {
  Input,
  Text,
  InputGroup,
  Button,
  InputRightElement,
  Checkbox,
  Stack,
  Box,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { ViewIcon, ViewOffIcon, CloseIcon, ArrowBackIcon, CheckIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function HomePage(props) {
  const [userData, setUserDate] = useState({});
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState('');

  const [countdown, setCountdown] = useState(60);
  const [showCountdownTime, setShowCountdownTime] = useState(false);

  const [stepForgetPassword, setStepForgetPassword] = useState(0);

  const handleChangeUserValue = (event) => setUser(event.target.value);

  const [password, setPassword] = useState('');
  const handleChangePasswordValue = (event) => setPassword(event.target.value);

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleShowLoginForm = useCallback(() => {
    if (!showLoginForm == true) {
      setShowLoginForm(!showLoginForm);
      setShowLogin(!showLogin);
      setTimeout(() => {
        document.querySelector('.bom-login').style.opacity = 1;
      }, 200);
    } else {
      document.querySelector('.bom-login').style.opacity = 0;
      setTimeout(() => {
        setShowLoginForm(!showLoginForm);
        setShowLogin(!showLogin);
      }, 100);
    }
  }, [showLoginForm]);

  const [showForgetPassword, setShowForgetPassword] = useState(false);

  const handleShowForgetPassWord = useCallback(() => {
    let step = stepForgetPassword + 1;
    if (stepForgetPassword == 4) {
      step = 0;
      setShowCountdownTime(false);
      setCountdown(60);
    }
    if (!showForgetPassword == false || !showLogin == true) {
      step = 0;
      setShowCountdownTime(false);
      setCountdown(60);
    }
    setStepForgetPassword(step);
    setShowLogin(!showLogin);
    setShowForgetPassword(!showForgetPassword);
  }, [showLogin, showForgetPassword, stepForgetPassword]);

  const handleLogin = useCallback(async () => {
    if (user && password) {
      const submitData = {
        user,
        password,
      };
      const loginAccount = await axios.post(
        `http://localhost:${props.BACK_END_PORT}/login`,
        submitData
      );
      if (loginAccount.data.statusCode === 200) {
        console.log('login success');
      } else if (loginAccount.data.statusCode === 403) {
        console.log(loginAccount.data.data.message);
      }
    }
  }, [user, password]);

  const handleResendOTP = useCallback(() => {
    setShowCountdownTime(true);
    // var submitData = {
    //   user: userData?.user,
    //   otpCode: userData?.otpCode,
    //   hash: userData?.hash,
    //   phone: userData?.phone,
    // };
    // const verifyOTP = await axios.post(
    //   `http://localhost:${props.BACK_END_PORT}/verify-otp`,
    //   submitData
    // );
    // if (verifyOTP.data.statusCode === 200) {
    //   setStepForgetPassword(step);
    // } else if (verifyOTP.data.statusCode === 403) {
    //   console.log(verifyOTP.data.data.message);
    // }
  }, []);

  const handleForgetPassword = useCallback(async () => {
    let step = stepForgetPassword + 1;
    if (step > 4) {
      step = 0;
      setStepForgetPassword(step);
      setShowLogin(true);
      setShowForgetPassword(false);
      setShowCountdownTime(false);
      setCountdown(60);
      return;
    }
    switch (stepForgetPassword) {
      case 1:
        setStepForgetPassword(step);
        // var submitData = {
        //   user,
        // };
        // const sendOTP = await axios.post(
        //   `http://localhost:${props.BACK_END_PORT}/send-otp`,
        //   submitData
        // );
        // if (sendOTP.data.statusCode === 200) {
        //   setStepForgetPassword(step);
        //   console.log('login success');
        // } else if (sendOTP.data.statusCode === 403) {
        //   console.log(sendOTP.data.data.message);
        // }
        setShowCountdownTime(true);
        break;
      case 2:
        const button = document.querySelector(
          'div.bom-login > div.bom-login-left > div > div.bom-login-form > button.bom-button-verify'
        );
        if (button && button.classList.contains('active')) {
          setShowCountdownTime(false);
          setStepForgetPassword(step);
          // var submitData = {
          //   user: userData?.user,
          //   otpCode: userData?.otpCode,
          //   hash: userData?.hash,
          //   phone: userData?.phone,
          // };
          // const verifyOTP = await axios.post(
          //   `http://localhost:${props.BACK_END_PORT}/verify-otp`,
          //   submitData
          // );
          // if (verifyOTP.data.statusCode === 200) {
          //   setStepForgetPassword(step);
          // } else if (verifyOTP.data.statusCode === 403) {
          //   console.log(verifyOTP.data.data.message);
          // }
        }
        break;
      case 3:
        setStepForgetPassword(step);
        // var submitData = {
        //   password: userData?.password,
        //   user: userData?.user,
        //   verifyOTPCode: userData?.verifyOTPCode,
        //   confirmPassword: userData?.confirm_password,
        // };
        // const changePassword = await axios.post(
        //   `http://localhost:${props.BACK_END_PORT}/change-password`,
        //   submitData
        // );
        // if (changePassword.data.statusCode === 200) {
        //   setStepForgetPassword(step);
        // } else if (changePassword.data.statusCode === 403) {
        //   console.log(changePassword.data.data.message);
        // }
        break;
    }
  }, [stepForgetPassword, countdown]);

  useEffect(() => {
    if (showCountdownTime) {
      setTimeout(() => {
        const inputs = document.querySelectorAll(
            'div.bom-login > div.bom-login-left > div > div.bom-login-form > .chakra-stack input'
          ),
          button = document.querySelector(
            'div.bom-login > div.bom-login-left > div > div.bom-login-form > button.bom-button-verify'
          );

        inputs.forEach((input, index1) => {
          input.addEventListener('keyup', (e) => {
            const currentInput = input,
              nextInput = input.nextElementSibling,
              prevInput = input.previousElementSibling;

            if (currentInput.value.length > 1) {
              currentInput.value = '';
              return;
            }
            if (nextInput && nextInput.hasAttribute('disabled') && currentInput.value !== '') {
              nextInput.removeAttribute('disabled');
              nextInput.style.backgroundColor = '#fff';
              nextInput.focus();
            }
            if (e.key === 'Backspace') {
              inputs.forEach((input, index2) => {
                if (index1 <= index2 && prevInput) {
                  input.setAttribute('disabled', true);
                  currentInput.style.backgroundColor = '#ededed';
                  input.value = '';
                  prevInput.focus();
                }
              });
            }
            if (!inputs[5].disabled && inputs[5].value !== '') {
              button.classList.add('active');
              return;
            }
            button.classList.remove('active');
          });
        });
      }, 1000);
      if (!countdown) {
        setShowCountdownTime(false);
        setCountdown(60);
        return;
      }
      let countdownTime = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdownTime);
    }
  }, [countdown, showCountdownTime]);

  const NavBar = (
    <div className="bom-navbar">
      <div className="bom-navbar-bom-logo">
        <h1>BOM</h1>
      </div>
      <ul className="bom-navbar-component">
        <li>
          <div>Trang chủ</div>
        </li>
        <li>
          <div>Tra cứu vé</div>
        </li>
        <li>
          <div>Về chúng tôi</div>
        </li>
        <li>
          <div>Liên hệ</div>
        </li>
        <li>
          <div onClick={handleShowLoginForm}>Đăng nhập</div>
        </li>
      </ul>
    </div>
  );
  const stepForgetPasswordHTML = (
    <div className="bom-return-login-form">
      <Text fontSize="md" onClick={handleShowForgetPassWord}>
        <ArrowBackIcon /> Quay lại đăng nhập
      </Text>
      <Stack direction="row" spacing={4} align="center">
        <Button
          colorScheme="teal"
          variant="outline"
          className={stepForgetPassword == 1 && 'bom-button-selected'}
        >
          1
        </Button>
        <Button
          colorScheme="teal"
          variant="outline"
          className={stepForgetPassword == 2 && 'bom-button-selected'}
        >
          2
        </Button>
        <Button
          colorScheme="teal"
          variant="outline"
          className={stepForgetPassword == 3 && 'bom-button-selected'}
        >
          3
        </Button>
        <Button
          colorScheme="teal"
          variant="outline"
          className={stepForgetPassword == 4 && 'bom-button-selected'}
        >
          <CheckIcon boxSize={3} />
        </Button>
      </Stack>
    </div>
  );
  const LoginForm = showLoginForm && (
    <>
      <div id="bom-login"></div>
      <div className="bom-login">
        <CloseIcon onClick={handleShowLoginForm} />
        <div className="bom-login-left">
          {showLogin && (
            <div style={{ margin: '11% 10%' }}>
              <h1>Đăng nhập</h1>
              <div className="bom-login-form">
                <p>Số Điện Thoại/Email</p>
                <Input
                  value={user}
                  onChange={handleChangeUserValue}
                  placeholder="Số Điện Thoại/Email"
                  size="md"
                />
                <p>Mật khẩu</p>
                <InputGroup size="md">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handleChangePasswordValue}
                    placeholder="Mật khẩu"
                  />
                  <InputRightElement width="3.5rem" onClick={handleShowPassword}>
                    {!showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </InputRightElement>
                </InputGroup>
                <Button variant="solid" onClick={handleLogin}>
                  Đăng nhập
                </Button>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5%' }}>
                  <Checkbox defaultChecked>Nhớ Mật Khẩu</Checkbox>
                  <Text fontSize="md" onClick={handleShowForgetPassWord}>
                    Quên mật khẩu
                  </Text>
                </div>
              </div>
            </div>
          )}
          {(showForgetPassword && stepForgetPassword == 1 && (
            <div style={{ margin: '14% 10%' }}>
              <h1 className="bom-forget-password-title">Quên mật khẩu</h1>
              <div className="bom-login-form">
                <p>Nhập số điện thoại/Email</p>
                <Input
                  value={user}
                  onChange={handleChangeUserValue}
                  placeholder="Nhập số điện thoại/Email"
                  size="md"
                />
                <Button
                  variant="solid"
                  onClick={handleForgetPassword}
                  className="bom-button-send-request"
                >
                  Gửi yêu cầu
                </Button>
                {stepForgetPasswordHTML}
              </div>
            </div>
          )) ||
            (stepForgetPassword == 2 && (
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
                    <Text fontSize="md" style={showCountdownTime ? { opacity: 1 } : { opacity: 0 }}>
                      Yêu cầu cấp lại mã sau {countdown} giây
                    </Text>
                    {!showCountdownTime && (
                      <Text fontSize="md" onClick={handleResendOTP}>
                        Gửi lại OTP
                      </Text>
                    )}
                  </div>
                  <Button
                    variant="solid"
                    onClick={handleForgetPassword}
                    className="bom-button-verify"
                  >
                    Xác thực
                  </Button>
                  {stepForgetPasswordHTML}
                </div>
              </div>
            )) ||
            (stepForgetPassword == 3 && (
              <div style={{ margin: '9% 10%' }}>
                <h1 className="bom-change-password-title">Đặt lại mật khẩu</h1>
                <div className="bom-login-form">
                  <p>Nhập mật khẩu</p>
                  <InputGroup size="md">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handleChangePasswordValue}
                      placeholder="Mật khẩu"
                    />
                    <InputRightElement width="3.5rem" onClick={handleShowPassword}>
                      {!showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </InputRightElement>
                  </InputGroup>
                  <p>Xác nhận mật khẩu</p>
                  <InputGroup size="md">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handleChangePasswordValue}
                      placeholder="Xác nhận mật khẩu"
                    />
                    <InputRightElement width="3.5rem" onClick={handleShowPassword}>
                      {!showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </InputRightElement>
                  </InputGroup>
                  <Button variant="solid" onClick={handleForgetPassword}>
                    Đặt lại mật khẩu
                  </Button>
                  {stepForgetPasswordHTML}
                </div>
              </div>
            )) ||
            (stepForgetPassword == 4 && (
              <div>
                <h1 className="bom-forget-password-complete-title">Hoàn thành</h1>
                <div className="bom-login-form" style={{ textAlign: 'center' }}>
                  <Button
                    colorScheme="teal"
                    variant="outline"
                    className={stepForgetPassword == 4 && 'bom-button-selected'}
                  >
                    <CheckIcon boxSize={3} />
                  </Button>
                  {stepForgetPasswordHTML}
                </div>
              </div>
            ))}
        </div>
        <div className="bom-login-right"></div>
      </div>
    </>
  );

  return (
    <>
      {NavBar}
      {LoginForm}
    </>
  );
}
export async function getStaticProps() {
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
    },
  };
}
