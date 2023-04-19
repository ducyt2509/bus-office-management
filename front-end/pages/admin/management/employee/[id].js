import axios from 'axios';
import { actions, useStore } from '@/src/store';
import { useEffect, useState } from 'react';
import { Flex, Text, Image, Stack, Card, IconButton, CardBody, Heading } from '@chakra-ui/react';
import { IoIosArrowBack } from 'react-icons/io';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function Employee(props) {
  const [state, dispatch, axiosJWT] = useStore();
  const [employeeInformation, setEmployeeInformation] = useState({});
  const getEmployeeDetail = async () => {
    try {
      const employeeDetail = await axiosJWT.post(
        `http://localhost:${props.BACK_END_PORT}/user/user-by-id`,
        { id: props.id },
        { headers: state.accessToken }
      );
      if (employeeDetail.data.statusCode == 200) {
        setEmployeeInformation(employeeDetail.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const userData = Cookies.get('dataUser');
    dispatch(actions.setDataUser(JSON.parse(userData)));
    getEmployeeDetail();
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
          alt="Nguyễn Văn A"
        />
      </Flex>
      <Link href={'/admin/management/employee'}>
        <Text display={'flex'} alignItems="center" className="bom-back-management">
          <IoIosArrowBack boxSize={16} /> Quay lại
        </Text>
      </Link>

      <Card
        backgroundColor={'#f5f5f5'}
        className="bom-personal-info-detail"
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
        width={'96%'}
        marginTop={'2%'}
      >
        <Image
          boxSize={[250, 340]}
          height={[250, 340]}
          borderRadius={'full'}
          src={state.dataUser.avatar ? state.dataUser.avatar : 'https://bit.ly/dan-abramov'}
          alt="Nguyễn Văn A"
          marginRight={'3%'}
        />
        <Stack width={'50%'}>
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
                <Text fontSize={'17px'}>{employeeInformation?.office?.office_name}</Text>
              </Flex>
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Địa chỉ văn phòng:</Text>
                <Text fontSize={'17px'}>{employeeInformation?.office?.office_address}</Text>
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
