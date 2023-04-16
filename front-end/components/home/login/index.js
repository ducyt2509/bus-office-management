import { useCallback, useRef, useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useStore, actions } from '@/src/store';
import { useRouter } from 'next/router';
import ForgetPasswordStep1 from './ForgetPassword-step1';
import ForgetPasswordStep2 from './ForgetPassword-step2';
import ForgetPasswordStep3 from './ForgetPassword-step3';
import ForgetPasswordStep4 from './ForgetPassword-step4';
import StepForgetPassword from './StepForgetPassword';
import LoginForm from './LoginForm';
import { validate } from '@/helper';
import NavBar from '@/components/common/sidebar/NavBar';
import { useToast } from '@chakra-ui/react';

export default function Login(props) {
  console.log(props);
  const toast = useToast();
  const toastIdRef = useRef();

  const [state, dispatch] = useStore();
  const router = useRouter();
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  const handleChangeUserValue = useCallback(
    (event) => {
      let value = event.target.value;
      setUser(value);
      let error = { ...errorInput };
      let pattern = validate.email_and_phone;
      if (value == '' || !value.toLowerCase().match(pattern)) {
        error.user = true;
      } else {
        error.user = false;
      }
      setErrorInput(error);
    },
    [errorInput]
  );

  const handleChangePasswordValue = useCallback(
    (event) => {
      let value = event.target.value;
      setPassword(value);
      let error = { ...errorInput };
      let pattern = validate.password;
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
      try {
        const loginAccount = await axios.post(
          `http://localhost:${props.BACK_END_PORT}/login`,
          submitData
        );
        if (loginAccount.data.statusCode === 200) {
          dispatch(
            actions.setDataUser({
              ...loginAccount.data.data.dataValues,
              token: loginAccount.data.data.accessToken,
            })
          );
          if (loginAccount.data.data.dataValues.role_id == 1) {
            router.push('/admin');
          }
          if (loginAccount.data.data.dataValues.role_id == 2) {
            router.push('/staff');
          }
          if (loginAccount.data.data.dataValues.role_id == 3) {
            router.push('/driver');
          }
        }
      } catch (error) {
        toastIdRef.current = toast({
          title: 'Đăng nhập thất bại.',
          description: 'Xảy ra lỗi trong quá trình thao tác. Làm ơn hãy thử lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    }
  }, [user, password]);

  const handleResendOTP = useCallback(async () => {
    var submitData = {
      user: userData?.phone,
    };
    try {
      const sendOTP = await axios.post(
        `http://localhost:${props.BACK_END_PORT}/send-otp`,
        submitData
      );
      if (sendOTP.data.statusCode === 200) {
        setShowCountdownTime(true);
        setUserData(sendOTP.data.data);
      }
    } catch (error) {
      toastIdRef.current = toast({
        title: 'Lỗi.',
        description: 'Xảy ra lỗi trong quá trình thao tác. Làm ơn hãy thử lại.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 2000,
      });
    }
  }, [userData]);

  const handleForgetPassword = useCallback(async () => {
    let step = stepForgetPassword + 1;
    if (step > 4) {
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
        if (!value) {
          setErrorInput({ ...errorInput, user: true });
          return;
        }

        if (value.length >= 8 && value[0] == 0 && parseInt(value)) {
          value = '+84' + value.substring(1);
        }
        var submitData = {
          user: value,
        };
        setLoading(true);
        try {
          const sendOTP = await axios.post(
            `http://localhost:${props.BACK_END_PORT}/send-otp`,
            submitData
          );
          if (sendOTP.data.statusCode === 200) {
            setUserData(sendOTP.data.data);
            setStepForgetPassword(step);
          }
        } catch (error) {
          toastIdRef.current = toast({
            title: 'Tài khoản không tồn tại.',
            description: 'Tài khoản không tồn tại. Làm ơn hãy thử lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
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
          try {
            const verifyOTP = await axios.post(
              `http://localhost:${props.BACK_END_PORT}/verify-otp`,
              submitData
            );
            if (verifyOTP.data.statusCode === 200) {
              setStepForgetPassword(step);
              setUserData(verifyOTP.data.data);
            }
          } catch (error) {
            toastIdRef.current = toast({
              title: 'Mã OTP không đúng.',
              description: 'Mã OTP không đúng. Làm ơn hãy thử lại.',
              status: 'error',
              isClosable: true,
              position: 'top',
              duration: 2000,
            });
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
        try {
          const changePassword = await axios.put(
            `http://localhost:${props.BACK_END_PORT}/change-password`,
            submitData
          );
          if (changePassword.data.statusCode === 200) {
            setStepForgetPassword(step);
          }
        } catch (error) {
          toastIdRef.current = toast({
            title: 'Lỗi.',
            description: 'Xảy ra lỗi trong quá trình thao tác. Làm ơn hãy thử lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
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
  return (
    <>
      {NavBarHTML}
      {LoginFormHTML}
    </>
  );
}
