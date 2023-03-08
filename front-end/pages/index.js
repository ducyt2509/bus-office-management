import { useCallback, useEffect, useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';

import ForgetPasswordStep4 from '../components/home/login/ForgetPassword-step4';
import ForgetPasswordStep3 from '../components/home/login/ForgetPassword-step3';
import ForgetPasswordStep2 from '../components/home/login/ForgetPassword-step2';
import ForgetPasswordStep1 from '../components/home/login/ForgetPassword-step1';
import StepForgetPassword from '../components/home/login/StepForgetPassword';
import LoginForm from '../components/home/login/LoginForm';
import NavBar from '../components/home/login/NavBar';
import HomeContent from '../components/home/content/HomeContent';
import HomeDestination from '@/components/home/book-ticket/HomeDestination';
import PopularRoute from '@/components/home/content/PopularRoute';
import ContactUs from '@/components/common/ContactUs';
import ContactUsDecor from '@/components/common/ContactUsDecor';

export default function HomePage(props) {
  const [userData, setUserData] = useState({});
  const [otpCode, setOtpCode] = useState(new Array(6).fill(null));
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(false);

  const [errorInput, setErrorInput] = useState({
    user: false,
    password: false,
    confirm_password: false,
  });

  const [countdown, setCountdown] = useState(60);
  const [showCountdownTime, setShowCountdownTime] = useState(false);

  const [stepForgetPassword, setStepForgetPassword] = useState(0);

  const handleChangeUserValue = useCallback(
    (event) => {
      let value = event.target.value;
      setUser(value);
      let error = { ...errorInput };
      let pattern = '^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})|(^[0-9]{10})+$';
      if (value == '' || !value.toLowerCase().match(pattern)) {
        error.user = true;
      } else {
        error.user = false;
      }
      setErrorInput(error);
    },
    [errorInput]
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleChangePasswordValue = useCallback(
    (event) => {
      let value = event.target.value;
      setPassword(value);
      let error = { ...errorInput };
      let pattern = '^(?=.*?[A-Z]).{8,}$';
      if (value == '' || !value.match(pattern)) {
        error.password = true;
      } else {
        error.password = false;
      }
      setErrorInput(error);
    },
    [errorInput]
  );

  const handleChangeConfirmPasswordValue = useCallback(
    (event) => {
      let value = event.target.value;
      setConfirmPassword(value);
      let error = { ...errorInput };
      let pattern = '^(?=.*?[A-Z]).{8,}$';
      if (value == '' || value != password || !value.match(pattern)) {
        error.confirm_password = true;
      } else {
        error.confirm_password = false;
      }
      setErrorInput(error);
    },
    [errorInput, password]
  );

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
      setUserData({});
      setUser('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
    }
    if (!showForgetPassword == false || !showLogin == true) {
      step = 0;
      setShowCountdownTime(false);
      setCountdown(60);
      setUserData({});
      setUser('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
    }
    setStepForgetPassword(step);
    setShowLogin(!showLogin);
    setShowForgetPassword(!showForgetPassword);
  }, [showLogin, showForgetPassword, stepForgetPassword]);

  const handleLogin = useCallback(async () => {
    if (user && password) {
      let value = user;
      if (value.length >= 8 && value[0] == 0 && parseInt(value)) {
        value = '+84' + value.substring(1);
      }
      const submitData = {
        user: value,
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

  const handleResendOTP = useCallback(async () => {
    var submitData = {
      user: userData?.phone,
    };
    const sendOTP = await axios.post(
      `http://localhost:${props.BACK_END_PORT}/send-otp`,
      submitData
    );
    if (sendOTP.data.statusCode === 200) {
      setShowCountdownTime(true);
    } else if (sendOTP.data.statusCode === 403) {
      console.log(sendOTP.data.data.message);
    }
  }, [userData]);

  const handleForgetPassword = useCallback(async () => {
    let step = stepForgetPassword + 1;
    if (step > 4) {
      console.log(23);
      step = 0;
      setStepForgetPassword(step);
      setShowLogin(true);
      setShowForgetPassword(false);
      setShowCountdownTime(false);
      setCountdown(60);
      setUserData({});
      setUser('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      return;
    }
    switch (stepForgetPassword) {
      case 1:
        let value = user;
        if (errorInput.user) {
          return;
        }
        if (value.length >= 8 && value[0] == 0 && parseInt(value)) {
          value = '+84' + value.substring(1);
        }
        var submitData = {
          user: value,
        };
        setLoading(true);
        const sendOTP = await axios.post(
          `http://localhost:${props.BACK_END_PORT}/send-otp`,
          submitData
        );
        if (sendOTP.data.statusCode === 200) {
          setUserData(sendOTP.data.data);
          setStepForgetPassword(step);
        } else if (sendOTP.data.statusCode === 403) {
          console.log(sendOTP.data.data.message);
        }
        setShowCountdownTime(true);
        setLoading(false);
        break;
      case 2:
        const button = document.querySelector(
          'div.bom-login > div.bom-login-left > div > div.bom-login-form > button.bom-button-verify'
        );
        if (button && button.classList.contains('active')) {
          setLoading(true);
          // setShowCountdownTime(false);
          var submitData = {
            otpCode: otpCode.join(''),
            hash: userData?.hash,
            phone: userData?.phone,
          };
          const verifyOTP = await axios.post(
            `http://localhost:${props.BACK_END_PORT}/verify-otp`,
            submitData
          );
          if (verifyOTP.data.statusCode === 200) {
            setStepForgetPassword(step);
            setUserData(verifyOTP.data.data);
          } else if (verifyOTP.data.statusCode === 403) {
            console.log(verifyOTP.data.data.message);
          }
          setLoading(false);
        }
        break;
      case 3:
        if (errorInput.password || errorInput.confirm_password) {
          return;
        }
        setLoading(true);
        var submitData = {
          password: password,
          user: userData?.phone,
          verifyOTPCode: userData?.verifyOTPCode,
          confirm_password: confirmPassword,
        };
        const changePassword = await axios.put(
          `http://localhost:${props.BACK_END_PORT}/change-password`,
          submitData
        );
        if (changePassword.data.statusCode === 200) {
          setStepForgetPassword(step);
        } else if (changePassword.data.statusCode === 403) {
          console.log(changePassword.data.data.message);
        }
        setLoading(false);
        break;
    }
  }, [
    stepForgetPassword,
    countdown,
    user,
    otpCode,
    userData,
    password,
    confirmPassword,
    errorInput,
  ]);

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
              errorInput={errorInput}
              handleShowForgetPassWord={handleShowForgetPassWord}
            />
          )}
          {(showForgetPassword && stepForgetPassword == 1 && (
            <ForgetPasswordStep1
              user={user}
              loading={loading}
              errorInput={errorInput}
              handleChangeUserValue={handleChangeUserValue}
              handleForgetPassword={handleForgetPassword}
              stepForgetPasswordHTML={stepForgetPasswordHTML}
            />
          )) ||
            (showForgetPassword && stepForgetPassword == 2 && (
              <ForgetPasswordStep2
                showCountdownTime={showCountdownTime}
                countdown={countdown}
                loading={loading}
                handleResendOTP={handleResendOTP}
                handleForgetPassword={handleForgetPassword}
                userData={userData}
                otpCode={otpCode}
                setOtpCode={setOtpCode}
                setShowCountdownTime={setShowCountdownTime}
                setCountdown={setCountdown}
                stepForgetPasswordHTML={stepForgetPasswordHTML}
              />
            )) ||
            (showForgetPassword && stepForgetPassword == 3 && (
              <ForgetPasswordStep3
                showPassword={showPassword}
                password={password}
                loading={loading}
                confirmPassword={confirmPassword}
                errorInput={errorInput}
                handleChangeConfirmPasswordValue={handleChangeConfirmPasswordValue}
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

  const HomeContentHTML = <HomeContent />;
  const HomeDestinationHTML = (
    <HomeDestination list_city={props.list_city} port={props.BACK_END_PORT} />
  );

  const PopularRouteHTML = <PopularRoute />;
  const ContactusHTML = <ContactUs />;
  const ContactusDecorHTML = <ContactUsDecor />;

  return (
    <>
      <header>
        {NavBarHTML}
        {LoginFormHTML}
        {/* {HomeContentHTML}
        {HomeDestinationHTML} */}

        {ContactusDecorHTML}
        {ContactusHTML}
      </header>
      <main>{PopularRouteHTML}</main>
    </>
  );
}
export async function getStaticProps() {
  const getListCity = await axios.get(
    `http://localhost:${process.env.BACK_END_PORT}/city/list-city`
  );
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
      list_city: getListCity.data.data?.listCity,
    },
  };
}
