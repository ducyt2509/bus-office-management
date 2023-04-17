import {
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Image,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ActionBar from '@/components/employee/ActionBar';
import AddEmployee from '@/components/employee/AddEmployee';
import ListEmployee from '@/components/employee/ListEmployee';
import Pagination from '@/components/common/Pagination';
import { useStore } from '@/src/store';

export default function ManagementEmployees(props) {
  const [state, dispatch, axiosJWT] = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [listUser, setListUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [querySearch, setQuerySearch] = useState('');
  const [numberUser, setNumberUser] = useState('');
  const [userId, setUserId] = useState();
  const [user, setUser] = useState({});

  const handleGetListUser = useCallback(
    async (type, page, limit, value) => {
      page = typeof page == 'number' ? page : 1;
      limit = limit ? limit : 7;
      if (typeof page == 'number') {
        setCurrentPage(page);
      }
      const token = `Bearer ${state.dataUser.token}`;
      const offset = limit * (page - 1);
      try {
        const getListUser = await axiosJWT.post(
          `http://localhost:${props.BACK_END_PORT}/user/list-user`,
          {
            offset: offset,
            limit: limit,
            query_search: value != undefined ? value : querySearch,
          },
          {
            headers: {
              token: token,
            },
          }
        );
        if (getListUser.data.statusCode === 200) {
          setListUser(getListUser.data.data.list_user);
          if (type == 'search') {
            setCurrentPage(1);
          }
          setNumberUser(getListUser.data.data.number_user);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [state, querySearch]
  );
  const handleChangeQuerySearch = useCallback((e) => {
    const value = e.target.value;
    setQuerySearch(value);
    if (!value) {
      handleGetListUser('search', null, null, '');
    }
  });
  useEffect(() => {
    handleGetListUser();
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
      <div style={{ width: '90%', margin: '0 auto' }}>
        <Card backgroundColor={'#F5F5F5'}>
          <CardHeader>
            <Heading size="lg">Quản lí nhân viên</Heading>
          </CardHeader>
          <CardBody>
            <ActionBar
              onOpen={onOpen}
              setUserId={setUserId}
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              handleGetListUser={handleGetListUser}
              handleChangeQuerySearch={handleChangeQuerySearch}
            />
            <ListEmployee
              list={listUser}
              onOpen={onOpen}
              setUserId={setUserId}
              setUser={setUser}
              handleGetListUser={handleGetListUser}
              port={props.BACK_END_PORT}
			  axiosJWT={axiosJWT}
            />
            <Pagination
              list_number={numberUser}
              handleGetList={handleGetListUser}
              setList={setListUser}
              list={listUser}
              currentPage={currentPage}
            />
            <AddEmployee
              isOpen={isOpen}
              onClose={onClose}
              port={props.BACK_END_PORT}
              token={`Bearer ${state.dataUser.token}`}
              handleGetListUser={handleGetListUser}
              userId={userId}
              user={user}
			  axiosJWT={axiosJWT}
            />
          </CardBody>
        </Card>
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
