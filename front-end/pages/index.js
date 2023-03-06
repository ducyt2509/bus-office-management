import { useCallback, useEffect, useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';

import { Icon, Select, Input, Button } from '@chakra-ui/react'
import { IoLocationOutline } from "react-icons/io5";

import ForgetPasswordStep4 from '../components/login/ForgetPassword-step4';
import ForgetPasswordStep3 from '../components/login/ForgetPassword-step3';
import ForgetPasswordStep2 from '../components/login/ForgetPassword-step2';
import ForgetPasswordStep1 from '../components/login/ForgetPassword-step1';
import StepForgetPassword from '../components/login/StepForgetPassword';
import LoginForm from '../components/login/LoginForm';
import NavBar from '../components/login/NavBar';

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

  const NavBarHTML = <NavBar handleShowLoginForm={handleShowLoginForm} />;
  const stepForgetPasswordHTML = (
    <StepForgetPassword
      handleShowForgetPassWord={handleShowForgetPassWord}
      stepForgetPassword={stepForgetPassword}
    />
  );
  const LoginFormHTML = showLoginForm && (
    <>
      <div id="bom-login"></div>
      <div className="bom-login">
        <CloseIcon onClick={handleShowLoginForm} />
        <div className="bom-login-left">
          {showLogin && (
            <LoginForm
              user={user}
              handleChangeUserValue={handleChangeUserValue}
              showPassword={showPassword}
              password={password}
              handleChangePasswordValue={handleChangePasswordValue}
              handleShowPassword={handleShowPassword}
              handleLogin={handleLogin}
              handleShowForgetPassWord={handleShowForgetPassWord}
            />
          )}
          {(showForgetPassword && stepForgetPassword == 1 && (
            <ForgetPasswordStep1
              user={user}
              handleChangeUserValue={handleChangeUserValue}
              handleForgetPassword={handleForgetPassword}
              stepForgetPasswordHTML={stepForgetPasswordHTML}
            />
          )) ||
            (showForgetPassword && stepForgetPassword == 2 && (
              <ForgetPasswordStep2
                showCountdownTime={showCountdownTime}
                countdown={countdown}
                handleResendOTP={handleResendOTP}
                handleForgetPassword={handleForgetPassword}
                stepForgetPasswordHTML={stepForgetPasswordHTML}
              />
            )) ||
            (showForgetPassword && stepForgetPassword == 3 && (
              <ForgetPasswordStep3
                showPassword={showPassword}
                password={password}
                handleChangePasswordValue={handleChangePasswordValue}
                handleShowPassword={handleShowPassword}
                handleForgetPassword={handleForgetPassword}
                stepForgetPassword={stepForgetPassword}
                stepForgetPasswordHTML={stepForgetPasswordHTML}
              />
            )) ||
            (showForgetPassword && stepForgetPassword == 4 && (
              <ForgetPasswordStep4
                stepForgetPassword={stepForgetPassword}
                handleForgetPassword={handleForgetPassword}
                stepForgetPasswordHTML={stepForgetPasswordHTML}
              />
            ))}
        </div>
        <div className="bom-login-right"></div>
      </div>
    </>
  );

  const HomeContent = (
    <div className="home-content">
      <h3 className="home-title">Lorem ipsum dolor sit amet onsectetur.</h3>
      <p className="home-desc">
        Lorem ipsum dolor sit amet consectetur. Velit non sed lobortis fermentum volutpat dignissim.
      </p>
    </div>
  );
  const HomeDestination = (
    <div className="home-destination">
      <form action="">
        <div className="group-input">
          <label for="from">Điểm xuất phát</label>
          <Select placeholder='Select option' size='md' p={1} w="100%" >
            <option value='option1'>Option 1</option>
            <option value='option2'>Option 2</option>
            <option value='option3'>Option 3</option>
          </Select>
        </div>
        <div className="group-input">
          <label for="to">Điểm đến</label>
          <Select placeholder='Select option' size='md' p={1} w="100%" >
            <option value='option1'>Option 1</option>
            <option value='option2'>Option 2</option>
            <option value='option3'>Option 3</option>
          </Select>
        </div>
        <div className="group-input">
          <label for="date">Ngày đi</label>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="datetime-local"
          />
        </div>
        <Button colorScheme='blue' >Đặt Vé</Button>
      </form>
    </div>
  );
  const PopularRoute = (
    <div className="popular-route">
      <div className="popular-route__title"><span>Tuyến Phổ Biến</span></div>
      <div className="popular-route__list">
        <div className="popular-route__item">
          <div className="popular-route__item-content">
            <span className="popular-route__item-title">Lorem ipsum dolor </span>
            <p className="popular-route__item-desc" > <Icon as={IoLocationOutline} boxSize={5} /> Lorem ipsum dolor sit amet onsectetur.</p>
          </div>
        </div>

        <div className="popular-route__item">
          <div className="popular-route__item-content">
            <span className="popular-route__item-title">Lorem ipsum dolor </span>
            <p className="popular-route__item-desc" > <Icon as={IoLocationOutline} boxSize={5} /> Lorem ipsum dolor sit amet onsectetur.</p>
          </div>
        </div>
        <div className="popular-route__item">
          <div className="popular-route__item-content">
            <span className="popular-route__item-title">Lorem ipsum dolor </span>
            <p className="popular-route__item-desc" > <Icon as={IoLocationOutline} boxSize={5} /> Lorem ipsum dolor sit amet onsectetur.</p>
          </div>
        </div>
        <div className="popular-route__item">
          <div className="popular-route__item-content">
            <span className="popular-route__item-title">Lorem ipsum dolor </span>
            <p className="popular-route__item-desc" > <Icon as={IoLocationOutline} boxSize={5} /> Lorem ipsum dolor sit amet onsectetur.</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <header>
        {NavBarHTML}
        {LoginFormHTML}
        {HomeContent}
        {HomeDestination}
      </header>
      <main>
        {PopularRoute}
      </main>
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
