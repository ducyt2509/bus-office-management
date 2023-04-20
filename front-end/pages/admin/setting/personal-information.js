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
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState, useRef } from 'react';
import { actions, useStore } from '@/src/store';
import { validate } from '@/helper';
import Cookies from 'js-cookie';

export default function Setting(props) {
  const [token, setToken] = useState('');
  const toast = useToast();
  const toastIdRef = useRef();
  const [state, dispatch, axiosJWT] = useStore();
  const [listOffice, setListOffice] = useState([]);

  const [userName, setUserName] = useState(state.dataUser.user_name);
  const [userEmail, setUserEmail] = useState(state.dataUser.email);
  const [userPhone, setUserPhone] = useState(state.dataUser.phone);
  const [userRole, setUserRole] = useState(state.dataUser.role_id);
  const [userOffice, setUserOffice] = useState(state.dataUser?.office_id);
  const [userAddress, setUserAddress] = useState(state.dataUser?.office?.office_address);

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
  const handleChangeUserOffice = useCallback(
    (e) => {
      setUserOffice(e.target.value);
      const office = listOffice.filter((office) => office.id == e.target.value);
      setUserAddress(office[0].office_address);
    },
    [listOffice]
  );
  const handleGetListOffice = useCallback(async () => {
    try {
      const getListOffice = await axiosJWT.post(
        `http://localhost:${props.BACK_END_PORT}/office/list-office`,{},
        {
          headers: { token: token },
        }
      );
      if (getListOffice.data.statusCode == 200) {
        setListOffice(getListOffice.data.data.list_office);
      }
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  const handleCancelUpdateUser = () => {
    setUserName(state.dataUser.user_name);
    setUserEmail(state.dataUser.email);
    setUserPhone(state.dataUser.phone);
    setUserRole(state.dataUser.role_id);
    setUserOffice(state.dataUser.office.office_name);
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
      role_id: userRole,
      office_id: userOffice,
    };
    if (state.dataUser.role_id !== 1) {
      delete submitData.role_id;
      delete submitData.office_id;
    }
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
      toastIdRef.current = toast({
        title: 'Chưa thể cập nhât thông tin người dùng.',
        description: 'Xảy ra lỗi trong quá trình thao tác. Làm ơn hãy thử lại.',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 5000,
      });
    }
  }, [userEmail, userPhone, userRole, userOffice, userName, state, error, token]);

  useEffect(() => {
    const userData = Cookies.get('dataUser');
    dispatch(actions.setDataUser(JSON.parse(userData)));
    setToken(`Bearer ${JSON.parse(userData).token}`);
    if (token) {
      handleGetListOffice();
    }
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
      <div className={'bom-personal-info'} style={{ height: '130vh' }}>
        <Flex padding={'3%'} justifyContent="space-between" height={'100vh'}>
          <div style={{ width: '48%' }}>
            <Heading fontSize={'25px'} marginBottom="5%">
              Thông tin cá nhân
            </Heading>
            <Flex marginBottom={'3%'} alignItems={'center'}>
              <Image
                borderRadius="full"
                boxSize="40%"
                height="auto"
                src={state.dataUser.avatar ? state.dataUser.avatar : 'https://bit.ly/dan-abramov'}
                alt="Nguyễn Văn A"
              />
              <Button marginLeft={'8%'} backgroundColor={'#c2c2c2'}>
                Thay đổi
              </Button>
            </Flex>
            <FormControl marginBottom={'4%'} isRequired isInvalid={error.userName}>
              <FormLabel marginBottom={'3%'}>Họ và tên</FormLabel>
              <Input value={userName} onChange={handleChangeUserName} />
              <FormErrorMessage>Họ và tên là bắt buộc</FormErrorMessage>
            </FormControl>
            <Flex marginBottom={'4%'} justifyContent={'space-between'}>
              <Stack width={'48%'} justifyContent="flex-end">
                <FormControl isRequired isInvalid={error.userPhone}>
                  <FormLabel marginBottom={'6%'}>Số điện thoại</FormLabel>
                  <Input value={userPhone} onChange={handleChangeUserPhone} />
                  <FormErrorMessage>
                    {!userPhone ? 'Số điện thoại là bắt buộc' : 'Số điện thoại sai định dạng'}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
              <Stack width={'48%'}>
                <Text marginBottom={'3%'}>Email</Text>
                <Input value={userEmail} onChange={handleChangeUserEmail} />
              </Stack>
            </Flex>
            <Text marginBottom={'3%'}>Chức vụ</Text>
            <Select
              marginBottom={'4%'}
              value={userRole}
              onChange={handleChangeUserRole}
              disabled={state.dataUser.role_id !== 1 ? true : false}
            >
              <option value={'1'}>Manager</option>
              <option value={'2'}>Customer Service Staff</option>
              <option value={'3'}>Driver</option>
            </Select>
            <Text marginBottom={'3%'}>Văn phòng</Text>
            <Select
              marginBottom={'4%'}
              value={userOffice}
              onChange={handleChangeUserOffice}
              disabled={state.dataUser.role_id !== 1 ? true : false}
            >
              {listOffice.map((office) => {
                return <option value={office?.id}>{office?.office_name}</option>;
              })}
            </Select>
            <Text marginBottom={'3%'}>Địa chỉ</Text>
            <Input value={userAddress} disabled />
            <ButtonGroup width={'100%'} justifyContent={'space-evenly'} marginTop={'6%'}>
              <Button
                padding={'20px 40px'}
                backgroundColor={'#c2c2c2'}
                onClick={handleCancelUpdateUser}
              >
                Huỷ
              </Button>
              <Button
                padding={'20px 40px'}
                backgroundColor={'#363636'}
                color={'#fff'}
                onClick={handleUpdateUser}
              >
                Lưu
              </Button>
            </ButtonGroup>
          </div>
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
