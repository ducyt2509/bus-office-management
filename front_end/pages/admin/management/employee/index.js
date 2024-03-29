import {
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Image,
  useDisclosure,
  Stack,
  useToast,
  CircularProgress,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import ActionBar from '@/src/components/employee/ActionBar';
import AddEmployee from '@/src/components/employee/AddEmployee';
import ListEmployee from '@/src/components/employee/ListEmployee';
import Pagination from '@/src/components/common/Pagination';
import { actions, useStore } from '@/src/store';
import Cookies from 'js-cookie';
import { HiOutlineDocumentSearch } from 'react-icons/hi';

export default function ManagementEmployees(props) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const toast = useToast();
  const toastIdRef = useRef();
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
      const offset = limit * (page - 1);
      setLoading(true)
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
            description: 'Không thể lấy danh sách người dùng. Làm ơn hãy thử lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        }
      }
      setTimeout(() => {
        setLoading(false);
      }, 700);
    },
    [state, querySearch, token]
  );
  const handleChangeQuerySearch = useCallback((e) => {
    const value = e.target.value;
    setQuerySearch(value);
    if (!value) {
      handleGetListUser('search', null, null, '');
    }
  });
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
      handleGetListUser();
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
        <Text marginRight="1%" fontWeight="500">
          {state.dataUser.user_name}
        </Text>
        <Image
          borderRadius="full"
          boxSize="50px"
          src={state.dataUser.avatar ? state.dataUser.avatar : 'https://bit.ly/dan-abramov'}
        />
      </Flex>
      <div style={{ width: '90%', margin: '0 auto' }}>
        <Card>
          <CardHeader paddingBottom="0" paddingTop="0">
            <Heading size="lg">Quản lí nhân viên</Heading>
          </CardHeader>
          <CardBody paddingTop="0">
            <ActionBar
              onOpen={onOpen}
              setUserId={setUserId}
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              handleGetListUser={handleGetListUser}
              handleChangeQuerySearch={handleChangeQuerySearch}
            />
            {loading ? (
              <CircularProgress isIndeterminate color=" #ffbea8" />
            ) : listUser.length ? (
              <>
                <ListEmployee
                  list={listUser}
                  onOpen={onOpen}
                  setUserId={setUserId}
                  setUser={setUser}
                  handleGetListUser={handleGetListUser}
                  port={props.BACK_END_PORT}
                  axiosJWT={axiosJWT}
                  token={`Bearer ${state.dataUser.token}`}
                />
                <Pagination
                  list_number={numberUser}
                  handleGetList={handleGetListUser}
                  setList={setListUser}
                  list={listUser}
                  currentPage={currentPage}
                />
              </>
            ) : (
              <Stack fontSize={'200px'} color="#F26A4C" alignItems={'center'} marginTop="10%">
                {<HiOutlineDocumentSearch />}
                <Text fontSize={'25px'} fontWeight={500}>
                  Không có dữ liệu
                </Text>
                <Text fontSize={'20px'} color="#686868" fontWeight={500}>
                  Hãy thử tìm bằng từ khoá khác hoặc tạo dữ liệu
                </Text>
              </Stack>
            )}
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
