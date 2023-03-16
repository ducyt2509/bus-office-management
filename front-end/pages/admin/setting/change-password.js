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
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/src/store';

export default function Setting(props) {
  const [state, dispath] = useStore();
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
    // setLoading(true);
    var submitData = {
      password: password,
      user: state.dataUser?.phone,
      verifyOTPCode: {
        success: true,
        messages: 'Correct OTP Code',
      },
      confirm_password: confirmPassword,
    };
    const changePassword = await axios.put(
      `http://localhost:${props.BACK_END_PORT}/change-password`,
      submitData
    );
    if (changePassword.data.statusCode === 200) {
    } else if (changePassword.data.statusCode === 403) {
      console.log(changePassword.data.data.message);
    }
    // setLoading(false);
  }, [errorInput, password, confirmPassword, state]);
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
          alt="Dan Abramov"
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
                    : 'Mật khẩu chứa ít nhất 8 kí tự và 1 kí tự viết hoa'}
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
                    : 'Mật khẩu chứa ít nhất 8 kí tự và 1 kí tự viết hoa'}
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
