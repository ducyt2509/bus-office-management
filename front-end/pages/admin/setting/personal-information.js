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
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/src/store';

export default function Setting(props) {
  const [state, dispath] = useStore();
  const [listOffice, setListOffice] = useState([]);

  const [userName, setUserName] = useState(state.dataUser.user_name);
  const [userEmail, setUserEmail] = useState(state.dataUser.email);
  const [userPhone, setUserPhone] = useState(state.dataUser.phone);
  const [userRole, setUserRole] = useState(state.dataUser.role_id);
  const [userOffice, setUserOffice] = useState(state.dataUser?.office_id);
  const [userAddress, setUserAddress] = useState(state.dataUser?.office?.office_address);

  const handleChangeUserName = (e) => {
    setUserName(e.target.value);
  };
  const handleChangeUserEmail = (e) => {
    setUserEmail(e.target.value);
  };
  const handleChangeUserPhone = (e) => {
    setUserPhone(e.target.value);
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
  const handleGetListOffice = async () => {
    const getListOffice = await axios.post(
      `http://localhost:${props.BACK_END_PORT}/office/list-office`,
      {
        headers: { token: state.dataUser.accessToken },
      }
    );
    if (getListOffice.data.statusCode == 200) {
      setListOffice(getListOffice.data.data.list_office);
    }
  };
  const handleCancelUpdateUser = () => {
    setUserName(state.dataUser.user_name);
    setUserEmail(state.dataUser.email);
    setUserPhone(state.dataUser.phone);
    setUserRole(state.dataUser.role_id);
    setUserOffice(state.dataUser.office.office_name);
  };
  const handleUpdateUser = useCallback(async () => {
    let phone = userPhone;
    if (userPhone && userPhone[0] == 0) {
      phone = '+841' + userPhone.substring(1);
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
    const updateUser = await axios.put(
      `http://localhost:${props.BACK_END_PORT}/user/update-user`,
      submitData,
      {
        headers: { token: props.token },
      }
    );
    if (updateUser.data.statusCode == 200) {
    }
  }, [userEmail, userPhone, userRole, userOffice, userName, state]);

  useEffect(() => {
    handleGetListOffice();
  }, []);

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
      <div className={'bom-personal-info'} style={{ height: '120vh' }}>
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
                alt="Dan Abramov"
              />
              <Button marginLeft={'8%'} backgroundColor={'#c2c2c2'}>
                Thay đổi
              </Button>
            </Flex>
            <Text marginBottom={'3%'}>Họ và tên</Text>
            <Input marginBottom={'4%'} value={userName} onChange={handleChangeUserName} />
            <Flex marginBottom={'4%'} justifyContent={'space-between'}>
              <Stack width={'48%'}>
                <Text marginBottom={'3%'}>Email</Text>
                <Input value={userEmail} onChange={handleChangeUserEmail} />
              </Stack>
              <Stack width={'48%'}>
                <Text marginBottom={'3%'}>Số diện thoại</Text>
                <Input value={userPhone} onChange={handleChangeUserPhone} />
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
