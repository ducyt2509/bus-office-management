import {
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Image,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { actions, useStore } from '@/src/store';
import axios from 'axios';
import ActionBar from '@/src/components/transport/ActionBar';
import AddTransport from '@/src/components/transport/AddTransport';
import ListTransport from '@/src/components/transport/ListTransport';
import Pagination from '@/src/components/common/Pagination';
import Cookies from 'js-cookie';

export default function ManagementTransport(props) {
  const [state, dispatch, axiosJWT] = useStore();
  const toast = useToast();
  const toastIdRef = useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [token, setToken] = useState('');
  const [listTransport, setListTransport] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [querySearch, setQuerySearch] = useState('');
  const [numberTransport, setNumberTransport] = useState('');
  const [transportId, setTransportId] = useState();
  const [transport, setTransport] = useState({});

  const handleGetListTransport = useCallback(
    async (type, page, limit, value) => {
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page : 1;
      const offset = limit * (page - 1);
      if (typeof page == 'number') {
        setCurrentPage(page);
      }
      // const token = `Bearer ${state.dataUser.token}`;
      try {
        const getListTransport = await axiosJWT.post(
          `http://localhost:${props.BACK_END_PORT}/transport/list-transport`,
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
        if (getListTransport.data.statusCode === 200) {
          setListTransport(getListTransport.data.data.list_transport);
          if (type == 'search') {
            setCurrentPage(1);
          }
          setNumberTransport(getListTransport.data.data.number_transport);
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
            description: 'Không thể lấy danh sách lịch trình. Làm ơn hãy thử lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        }
      }
    },
    [state, querySearch, token]
  );
  const handleChangeQuerySearch = useCallback((e) => {
    const value = e.target.value;
    setQuerySearch(value);
    if (!value) {
      handleGetListTransport('search', null, null, '');
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
      handleGetListTransport();
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
      <div style={{ width: '90%', margin: '0 auto' }}>
        <Card backgroundColor={'#F5F5F5'}>
          <CardHeader>
            <Heading size="lg">Quản lí hành trình</Heading>
          </CardHeader>
          <CardBody>
            <ActionBar
              onOpen={onOpen}
              setTransportId={setTransportId}
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              handleGetListTransport={handleGetListTransport}
              handleChangeQuerySearch={handleChangeQuerySearch}
            />
            <ListTransport
              list={listTransport}
              onOpen={onOpen}
              setTransportId={setTransportId}
              setTransport={setTransport}
              handleGetListTransport={handleGetListTransport}
              token={`Bearer ${state.dataUser.token}`}
              port={props.BACK_END_PORT}
              axiosJWT={axiosJWT}
            />
            <Pagination
              list_number={numberTransport}
              handleGetList={handleGetListTransport}
              setList={setListTransport}
              list={listTransport}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
            <AddTransport
              isOpen={isOpen}
              onClose={onClose}
              port={props.BACK_END_PORT}
              token={`Bearer ${state.dataUser.token}`}
              handleGetListTransport={handleGetListTransport}
              transportId={transportId}
              transport={transport}
              currentPage={currentPage}
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