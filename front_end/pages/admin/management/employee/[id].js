import axios from 'axios';
import { actions, useStore } from '@/src/store';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Flex,
  Text,
  Image,
  Stack,
  Card,
  IconButton,
  CardBody,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { IoIosArrowBack } from 'react-icons/io';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function Employee(props) {
  const [token, setToken] = useState('');
  const toast = useToast();
  const toastIdRef = useRef();
  const [state, dispatch, axiosJWT] = useStore();
  const [employeeInformation, setEmployeeInformation] = useState({});
  const getEmployeeDetail = useCallback(async () => {
    try {
      const employeeDetail = await axiosJWT.post(
        `http://localhost:${props.BACK_END_PORT}/user/user-by-id`,
        { id: props.id },
        { headers: { token } }
      );
      if (employeeDetail.data.statusCode == 200) {
        setEmployeeInformation(employeeDetail.data.data);
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
          description: 'Không thể lấy thông tin người dùng. Làm ơn hãy thử lại',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }

      console.log(err);
    }
  }, [token]);

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
    if (token) {
      getEmployeeDetail();
    }
  }, [token]);

  return (
    <div style={{ position: 'relative', left: '20%', width: '80%' }}>
      <Flex
        alignItems={'center'}
        justifyContent="flex-end"
        width={'84%'}
        margin="0 auto"
        marginBottom={'5%'}
        paddingTop="2%"
      >
        <Text marginRight="1%" fontWeight="500">
          {state.dataUser.user_name}
        </Text>
        <Image
          borderRadius="full"
          boxSize="50px"
          src={state.dataUser.avatar ? state.dataUser.avatar : 'https://bit.ly/dan-abramov'}
        />
      </Flex>
      <Link href={'/admin/management/employee'}>
        <Text
          display={'flex'}
          alignItems="center"
          className="bom-back-management"
          marginLeft={'220px'}
        >
          <IoIosArrowBack boxSize={16} /> Quay lại
        </Text>
      </Link>

      <Card
        className="bom-personal-info-detail"
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
        width={'96%'}
        alignItems={'center'}
        maxWidth="960px"
        margin="2% auto"
        boxShadow="0px 0px 15px 0px #a7bad3"
      >
        <Image
          boxSize={[250, 250]}
          height={[250, 250]}
          borderRadius={'full'}
          src={state.dataUser.avatar ? state.dataUser.avatar : 'https://bit.ly/dan-abramov'}
          margin={'0 3% 0 5%'}
        />
        <Stack width={'70%'}>
          <CardBody>
            <Heading fontSize={'25px'}>Thông tin cá nhân</Heading>
            <Stack py="8">
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Họ và tên:</Text>
                <Text fontSize={'17px'}>{employeeInformation.user_name}</Text>
              </Flex>
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Email:</Text>
                <Text fontSize={'17px'}>{employeeInformation.email}</Text>
              </Flex>
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Số điện thoại:</Text>
                <Text fontSize={'17px'}>{employeeInformation.phone}</Text>
              </Flex>
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Chức vụ:</Text>
                <Text fontSize={'17px'}>
                  {employeeInformation.role_id == 1
                    ? 'Quản lý'
                    : employeeInformation.role_id == 2
                    ? 'Nhân viên hỗ trợ khách hàng'
                    : 'Tài xế'}
                </Text>
              </Flex>
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Văn phòng:</Text>
                <Text fontSize={'17px'}>
                  {employeeInformation?.office?.office_name
                    ? employeeInformation?.office?.office_name
                    : 'Không có văn phòng'}
                </Text>
              </Flex>
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Địa chỉ văn phòng:</Text>
                <Text fontSize={'17px'}>
                  {employeeInformation?.office?.office_address
                    ? employeeInformation?.office?.office_address
                    : 'Không có  địa chỉ văn phòng'}
                </Text>
              </Flex>
            </Stack>
          </CardBody>
        </Stack>
      </Card>
    </div>
  );
}
export async function getServerSideProps(context) {
  const id = context.query.id;
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
      id: id,
    }, // will be passed to the page component as props
  };
}
