import axios from 'axios';
import { useStore } from '@/src/store';
import { useEffect, useState } from 'react';
import { Flex, Text, Image, Stack, Card, IconButton, CardBody, Heading } from '@chakra-ui/react';
import { IoIosArrowBack } from 'react-icons/io';
import Link from 'next/link';

export default function Employee(props) {
  const [state, dispatch] = useStore();
  const [employeeInformation, setEmployeeInformation] = useState({});
  const getEmployeeDetail = async () => {
    const employeeDetail = await axios.post(
      `http://localhost:${props.BACK_END_PORT}/user/user-by-id`,
      { id: props.id },
      { headers: state.accessToken }
    );
    if (employeeDetail.data.statusCode == 200) {
      setEmployeeInformation(employeeDetail.data.data);
    }
  };
  useEffect(() => {
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
          alt="Dan Abramov"
        />
      </Flex>
      <Link href={'/admin/management/employee'}>
        <Text display={'flex'} alignItems="center" className='bom-back-management'>
          <IoIosArrowBack boxSize={16} /> Back To Management Screen
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
          boxSize="30%"
          height="auto"
          src={state.dataUser.avatar ? state.dataUser.avatar : 'https://bit.ly/dan-abramov'}
          alt="Dan Abramov"
          marginRight={'3%'}
        />
        <Stack width={'50%'}>
          <CardBody>
            <Heading fontSize={'25px'}>Thông tin cá nhân</Heading>
            <Stack py="8">
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Họ và tên:</Text>
                <Text>{employeeInformation.user_name}</Text>
              </Flex>
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Email:</Text>
                <Text>{employeeInformation.email}</Text>
              </Flex>
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Số diện thoại:</Text>
                <Text>{employeeInformation.phone}</Text>
              </Flex>
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Chức vụ:</Text>
                <Text>
                  {employeeInformation.role_id == 1
                    ? 'Manager'
                    : employeeInformation.role_id == 2
                    ? 'Customer Service Staff'
                    : 'Driver'}
                </Text>
              </Flex>
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Văn phòng:</Text>
                <Text>{employeeInformation?.office?.office_name}</Text>
              </Flex>
              <Flex justifyContent={'flex-start'} marginBottom={'1%'}>
                <Text className="bom-personal-info-title">Địa chỉ:</Text>
                <Text>{employeeInformation?.office?.office_address}</Text>
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
