import { Text, Button, Stack } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

export default function ForgetPasswordStep2(props) {
  const [otp1, setOtp1] = useState('');
  const [otp2, setOtp2] = useState('');
  const [otp3, setOtp3] = useState('');
  const [otp4, setOtp4] = useState('');
  const [otp5, setOtp5] = useState('');
  const [otp6, setOtp6] = useState('');

  const handleChangeValueOtp1 = (e) => {
    let code = e.target.value;
    let arrOtpCode = [...props.otpCode];
    arrOtpCode[0] = code;
    setOtp1(code);
    props.setOtpCode(arrOtpCode);
  };
  const handleChangeValueOtp2 = (e) => {
    let code = e.target.value;
    let arrOtpCode = [...props.otpCode];
    arrOtpCode[1] = code;
    setOtp2(code);
    props.setOtpCode(arrOtpCode);
  };
  const handleChangeValueOtp3 = (e) => {
    let code = e.target.value;
    let arrOtpCode = [...props.otpCode];
    arrOtpCode[2] = code;
    setOtp3(code);
    props.setOtpCode(arrOtpCode);
  };
  const handleChangeValueOtp4 = (e) => {
    let code = e.target.value;
    let arrOtpCode = [...props.otpCode];
    arrOtpCode[3] = code;
    setOtp4(code);
    props.setOtpCode(arrOtpCode);
  };
  const handleChangeValueOtp5 = (e) => {
    let code = e.target.value;
    let arrOtpCode = [...props.otpCode];
    arrOtpCode[4] = code;
    setOtp5(code);
    props.setOtpCode(arrOtpCode);
  };
  const handleChangeValueOtp6 = (e) => {
    let code = e.target.value;
    let arrOtpCode = [...props.otpCode];
    arrOtpCode[5] = code;
    setOtp6(code);
    props.setOtpCode(arrOtpCode);
  };

  let phone = props.userData?.phone;
  if (phone) {
    phone = phone.replace('+84', '0').substring(0, 5) + '******';
  }
  console.log(props.otpCode);
  useEffect(() => {
    if (props.showCountdownTime) {
      let inputOTP = setTimeout(() => {
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
      if (!props.countdown) {
        props.setShowCountdownTime(false);
        props.setCountdown(60);
        return;
      }
      let countdownTime = setInterval(() => {
        props.setCountdown((prev) => prev - 1);
      }, 1000);
      return () => {
        clearInterval(countdownTime);
        clearTimeout(inputOTP);
      };
    }
  }, [props.countdown, props.showCountdownTime]);
  return (
    <div style={{ margin: '-4% 10%' }}>
      <div className="bom-verify-otp-title">
        <h1 className="bom-verify-otp-title">Xác thực mã OTP</h1>
        <p>Mã xác thực đã được gửi qua SĐT: {phone} </p>
      </div>
      <div className="bom-login-form">
        <Stack direction={['column', 'row']} spacing="5%">
          <input value={otp1} onChange={handleChangeValueOtp1} />
          <input disabled value={otp2} onChange={handleChangeValueOtp2} />
          <input disabled value={otp3} onChange={handleChangeValueOtp3} />
          <input disabled value={otp4} onChange={handleChangeValueOtp4} />
          <input disabled value={otp5} onChange={handleChangeValueOtp5} />
          <input disabled value={otp6} onChange={handleChangeValueOtp6} />
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
        <Button
          variant="solid"
          onClick={props.handleForgetPassword}
          className="bom-button-verify"
          isLoading={props.loading}
        >
          Xác thực
        </Button>
        {props.stepForgetPasswordHTML}
      </div>
    </div>
  );
}
