import {
  Text,
  Heading,
  Input,
  Flex,
  Image,
  Stack,
  Button,
  ButtonGroup,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState, useRef } from 'react';
import { actions, useStore } from '@/src/store';
import { validate } from '@/helper';
import { ViewIcon, ViewOffIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function UserInformation(props) {
  const router = useRouter();
  const [token, setToken] = useState('');
  const toast = useToast();
  const toastIdRef = useRef();
  const [state, dispatch, axiosJWT] = useStore();

  const [userName, setUserName] = useState(state.dataUser.user_name);
  const [userEmail, setUserEmail] = useState(state.dataUser.email);
  const [userPhone, setUserPhone] = useState(state.dataUser.phone);
  const [userRole, setUserRole] = useState(state.dataUser.role_id);
  const [userOffice, setUserOffice] = useState(state.dataUser?.office_id);

  const [error, setError] = useState({
    userName: false,
    userPhone: false,
  });

  const handleChangeUserName = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value) {
        oldError.userName = true;
      } else {
        oldError.userName = false;
      }
      setError(oldError);
      setUserName(value);
    },
    [error]
  );
  const handleChangeUserPhone = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value || !value.match(validate.phone)) {
        oldError.userPhone = true;
      } else {
        oldError.userPhone = false;
      }
      setError(oldError);
      setUserPhone(value);
    },
    [error]
  );
  const handleChangeUserEmail = (e) => {
    setUserEmail(e.target.value);
  };
  const handleChangeUserRole = (e) => {
    setUserRole(e.target.value);
  };

  const handleCancelUpdateUser = () => {
    setUserName(state.dataUser.user_name);
    setUserEmail(state.dataUser.email);
    setUserPhone(state.dataUser.phone);
    setUserRole(state.dataUser.role_id);
  };
  const handleUpdateUser = useCallback(async () => {
    let oldError = { ...error };
    if (!userName) {
      oldError.userName = true;
    }
    if (!userPhone) {
      oldError.userPhone = true;
    }
    if (oldError.userName || oldError.userPhone) {
      setError(oldError);
      return;
    }
    let phone = userPhone;
    if (userPhone && userPhone[0] == 0) {
      phone = '+84' + userPhone.substring(1);
    }
    const submitData = {
      id: state.dataUser.id,
      user_name: userName,
      email: userEmail,
      phone: phone,
      role_id: 3,
      office_id: userOffice,
    };

    try {
      const updateUser = await axiosJWT.put(
        `http://localhost:${props.BACK_END_PORT}/user/update-user`,
        submitData,
        {
          headers: { token: token },
        }
      );
      if (updateUser.data.statusCode == 200) {
        const userDate = Cookies.get('dataUser');
        let cloneData = {
          ...JSON.parse(userDate),
          id: state.dataUser.id,
          user_name: userName,
          email: userEmail,
          phone: phone,
          role_id: userRole,
          office_id: userOffice,
        };
        Cookies.set('dataUser', cloneData);
        dispatch(actions.setDataUser(cloneData));

        toastIdRef.current = toast({
          title: 'Thay đổi thông tin thành công.',
          description: 'Thông tin của bạn đã được thay đổi.',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 5000,
        });
      }
    } catch (err) {
      if (err.response.data.statusCode == 401) {
        toastIdRef.current = toast({
          title: 'Phiên của bạn đã hết hạn.',
          description: 'Phiên đã hết hạn vui lòng đăng nhập lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      } else {
        toastIdRef.current = toast({
          title: err.response.data.data.message,
          description: 'Xảy ra lỗi trong quá trình thao tác. Làm ơn hãy thử lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    }
  }, [userEmail, userPhone, userRole, userOffice, userName, state, error]);

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
    <Box style={{ width: '90%' }} height={'100vh'} padding={'3%'} margin={'0 auto'}>
      <Heading
        fontSize={'25px'}
        marginBottom="10%"
        marginTop="30%"
        display={'flex'}
        alignItems={'center'}
      >
        <ChevronLeftIcon onClick={() => router.push('/driver')} />
        &ensp;Thông tin cá nhân
      </Heading>
      <Flex marginBottom={'8%'} alignItems={'center'}>
        <Image
          borderRadius="full"
          boxSize="40%"
          height="auto"
          src={state.dataUser.avatar ? state.dataUser.avatar : 'https://bit.ly/dan-abramov'}
        />
        <Button marginLeft={'8%'} backgroundColor={'#fff'} border="1px solid #000">
          Thay đổi
        </Button>
      </Flex>

      <Tabs variant="soft-rounded" colorScheme="green">
        <TabList>
          <Tab>Thông tin</Tab>
          <Tab>Mật khẩu</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormControl marginBottom={'8%'} isRequired isInvalid={error.userName}>
              <FormLabel marginBottom={'3%'}>Họ và tên</FormLabel>
              <Input value={userName} onChange={handleChangeUserName} />
              <FormErrorMessage>Họ và tên là bắt buộc</FormErrorMessage>
            </FormControl>
            <Stack marginBottom={'8%'}>
              <FormControl isRequired isInvalid={error.userPhone}>
                <FormLabel marginBottom={'3%'}>Số điện thoại</FormLabel>
                <Input value={userPhone} onChange={handleChangeUserPhone} />
                <FormErrorMessage>
                  {!userPhone ? 'Số điện thoại là bắt buộc' : 'Số điện thoại sai định dạng'}
                </FormErrorMessage>
              </FormControl>
            </Stack>
            <Stack marginBottom={'8%'} fontWeight={'500'}>
              <Text>Email</Text>
              <Input value={userEmail} onChange={handleChangeUserEmail} />
            </Stack>
            <Text marginBottom={'3%'} fontWeight={'500'}>
              Chức vụ
            </Text>
            <Select
              marginBottom={'4%'}
              value={userRole}
              onChange={handleChangeUserRole}
              disabled={state.dataUser.role_id !== 1 ? true : false}
            >
              <option value={'1'}>Quản lí</option>
              <option value={'2'}>Nhân viên hỗ trợ khách hàng</option>
              <option value={'3'}>Tài xế</option>
            </Select>

            <ButtonGroup width={'100%'} justifyContent={'space-evenly'} marginTop={'6%'}>
              <Button
                padding={'20px 40px'}
                backgroundColor={'#fff'}
                border="1px solid #000"
                onClick={handleCancelUpdateUser}
              >
                Huỷ
              </Button>
              <Button
                padding={'20px 40px'}
                backgroundColor={'#F26A4C'}
                color={'#fff'}
                onClick={handleUpdateUser}
              >
                Lưu
              </Button>
            </ButtonGroup>
          </TabPanel>
          <TabPanel>
            <FormControl isRequired isInvalid={errorInput.password} marginBottom={'8%'}>
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

            <ButtonGroup width={'100%'} justifyContent={'space-evenly'} marginTop={'10%'}>
              <Button padding={'20px 40px'} backgroundColor={'#fff'} border="1px solid #000">
                Huỷ
              </Button>
              <Button
                padding={'20px 40px'}
                backgroundColor={'#F26A4C'}
                color={'#fff'}
                onClick={handleChangePassword}
              >
                Lưu
              </Button>
            </ButtonGroup>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export async function getStaticProps() {
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
    },
  };
}
