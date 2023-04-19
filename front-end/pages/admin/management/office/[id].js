import axios from 'axios';
import { actions, useStore } from '@/src/store';
import { useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Image,
  CardHeader,
  Avatar,
  Card,
  IconButton,
  CardBody,
  Box,
  Heading,
} from '@chakra-ui/react';
import { MdOutlineLocationCity } from 'react-icons/md';
import { IoIosArrowBack } from 'react-icons/io';
import { VscPerson } from 'react-icons/vsc';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function Employee(props) {
  const [state, dispatch, axiosJWT] = useStore();
  const [officeInformation, setOfficeInformation] = useState({});

  const getOfficeDetail = async () => {
    const officeDetail = await axiosJWT.post(
      `http://localhost:${props.BACK_END_PORT}/office/office-by-id`,
      { id: props.id },
      { headers: state.accessToken }
    );
    if (officeDetail.data.statusCode == 200) {
      setOfficeInformation(officeDetail.data.data);
    }
  };
  const ListEmployee =
    officeInformation.number_employee &&
    officeInformation.number_employee.map((employee) => {
      return (
        <Link href={`/admin/management/employee/${employee.id}`}>
          <Text fontSize={'17px'} marginTop="2%" className="bom-list-employee-office">
            &emsp; &bull; &ensp; {employee.user_name}
          </Text>
        </Link>
      );
    });

  useEffect(() => {
    const userData = Cookies.get('dataUser');
    dispatch(actions.setDataUser(JSON.parse(userData)));
    getOfficeDetail();
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
      <Link href={'/admin/management/office'}>
        <Text display={'flex'} alignItems="center" className="bom-back-management">
          <IoIosArrowBack boxSize={16} /> Quay lại
        </Text>
      </Link>

      <Card
        backgroundColor={'#f5f5f5'}
        className="bom-office-info-detail"
        width={'96%'}
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
        marginTop={'2%'}
      >
        {/* <div style={{ width: "50%", backgroundColor: "#F26A4C" }}> */}
        <Image
          width={'50%'}
          margin={'0 auto'}
          // minHeight={"500px"}
          src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        />
        {/* </div> */}
        <CardBody>
          <Flex spacing="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar
                name="Segun Adebayo"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM5fZ7GjLkvEUMUX5_0Tu6pAHbfdZkF_QhKw&usqp=CAU"
              />

              <Box>
                <Heading size="sm">{officeInformation.office_name}</Heading>
                <Text>{officeInformation.city?.city_name}</Text>
              </Box>
            </Flex>
          </Flex>
          <Flex alignItems={'center'} marginTop="5%">
            <MdOutlineLocationCity width={'25px'} height={'25px'} />
            <Text fontSize={'18px'} fontWeight="500" marginLeft="1%">
              Địa chỉ:{' '}
            </Text>
          </Flex>
          <Text fontSize={'17px'} marginLeft="3%" marginTop="3%">
            {officeInformation.office_address}
          </Text>
          <Flex alignItems={'center'} marginTop="5%">
            <VscPerson width={'25px'} height={'25px'} />
            <Text fontSize={'18px'} fontWeight="500" marginLeft="1%">
              Danh sách nhân viên:
            </Text>
          </Flex>
          {ListEmployee}
        </CardBody>
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
