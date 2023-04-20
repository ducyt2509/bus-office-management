import {
  Text,
  Heading,
  FormLabel,
  Input,
  FormControl,
  Flex,
  Image,
  Stack,
  ButtonGroup,
  Button,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { actions, useStore } from '@/src/store';
import Cookies from 'js-cookie';

export default function Setting(props) {
  const [token, setToken] = useState('');
  const toast = useToast();
  const toastIdRef = useRef();
  const [state, dispatch, axiosJWT] = useStore();
  const [errorInput, setErrorInput] = useState({
    password: false,
    confirm_password: false,
  });
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
  const handleChangePassword = useCallback(async () => {
    if (errorInput.password || errorInput.confirm_password) {
      return;
    }
    var submitData = {
      password: password,
      user: state.dataUser?.phone,
      verifyOTPCode: {
        success: true,
        messages: 'Correct OTP Code',
      },
      confirm_password: confirmPassword,
    };
    try {
      const changePassword = await axiosJWT.put(
        `http://localhost:${props.BACK_END_PORT}/change-password`,
        submitData,
        { headers: { token } }
      );
      if (changePassword.data.statusCode === 200) {
        toastIdRef.current = toast({
          title: 'Thay đổi mật khẩu thành công.',
          description: 'Mật khẩu của bạn đã được thay đổi.',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 5000,
        });
      }
    } catch (err) {
      toastIdRef.current = toast({
        title: 'Thay đổi mật khẩu thất bại.',
        description: 'Xảy ra lỗi trong quá trình thao tác. Làm ơn hãy thử lại.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 5000,
      });
    }
  }, [errorInput, password, confirmPassword, state, token]);

  useEffect(() => {
    let userData = Cookies.get('dataUser') ? Cookies.get('dataUser') : '';
    let accessToken = '';
    try {
      userData = JSON.parse(userData);
      accessToken = `Bearer ${userData?.token}`;
    } catch (error) {
      userData = {};
      accessToken = `Bearer `;
    }
    dispatch(actions.setDataUser(userData));
    setToken(accessToken);
  }, [token]);
  return (
    <div style={{ position: 'relative', left: '20%', width: '80%' }}>
      <Flex
        alignItems={'center'}
        justifyContent="flex-end"
        width={'84%'}
        margin="0 auto"
        marginBottom={'2%'}
        paddingTop="2%"
      >
        <Text marginRight="1%">{state.dataUser.user_name}</Text>
        <Image
          borderRadius="full"
          boxSize="50px"
          src={state.dataUser.avatar ? state.dataUser.avatar : 'https://bit.ly/dan-abramov'}
          alt="Nguyễn Văn A"
        />
      </Flex>
      <div className={'bom-personal-info'}>
        <Flex padding={'3%'} justifyContent="space-between" height={'100vh'}>
          <Stack width={'49%'} justifyContent="space-between">
            <div>
              <Heading fontSize={'25px'} marginBottom="5%">
                Đổi mật khẩu
              </Heading>

              <FormControl isRequired isInvalid={errorInput.password} marginBottom={'5%'}>
                <FormLabel marginBottom={'3%'}>Mật khẩu mới</FormLabel>
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
                <FormErrorMessage>
                  {password == ''
                    ? 'Mật khẩu là bắt buộc'
                    : 'Mật khẩu chứa ít nhất tám ký tự và một ký tự viết hoa'}
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errorInput.confirm_password}>
                <FormLabel marginBottom={'3%'}>Xác nhận mật khẩu</FormLabel>
                <InputGroup size="md">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={handleChangeConfirmPasswordValue}
                    placeholder="Xác nhận mật khẩu"
                  />
                  <InputRightElement width="3.5rem" onClick={handleShowPassword}>
                    {!showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {confirmPassword != password
                    ? 'Xác nhận mật khẩu không đúng '
                    : 'Mật khẩu chứa ít nhất tám ký tự và một ký tự viết hoa'}
                </FormErrorMessage>
              </FormControl>

              <ButtonGroup width={'100%'} justifyContent={'space-evenly'} marginTop={'7%'}>
                <Button padding={'20px 40px'} backgroundColor={'#c2c2c2'}>
                  Huỷ
                </Button>
                <Button
                  padding={'20px 40px'}
                  backgroundColor={'#363636'}
                  color={'#fff'}
                  onClick={handleChangePassword}
                >
                  Lưu
                </Button>
              </ButtonGroup>
            </div>
          </Stack>
        </Flex>
      </div>
    </div>
  );
}
export async function getStaticProps() {
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
    },
  };
}
