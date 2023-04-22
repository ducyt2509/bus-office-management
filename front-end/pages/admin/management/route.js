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
import ActionBar from '@/src/components/route/ActionBar';
import AddRoute from '@/src/components/route/AddRoute';
import ListRoute from '@/src/components/route/ListRoute';
import Pagination from '@/src/components/common/Pagination';
import Cookies from 'js-cookie';

export default function ManagementRoute(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [token, setToken] = useState('');
  const [state, dispatch, axiosJWT] = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [listRoute, setListRoute] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [querySearch, setQuerySearch] = useState('');
  const [numberRoute, setNumberRoute] = useState('');
  const [routeId, setRouteId] = useState();
  const [route, setRoute] = useState({});

  const handleGetListRoute = useCallback(
    async (type, page, limit, value) => {
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page : 1;
      const offset = limit * (page - 1);
      if (typeof page == 'number') {
        setCurrentPage(page);
      }
      try {
        const getListRoute = await axiosJWT.post(
          `http://localhost:${props.BACK_END_PORT}/route/list-route`,
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
        if (getListRoute.data.statusCode === 200) {
          setListRoute(getListRoute.data.data.list_route);
          if (type == 'search') {
            setCurrentPage(1);
          }
          setNumberRoute(getListRoute.data.data.number_route);
        }
      } catch (error) {
        toastIdRef.current = toast({
          title: 'Phiên của bạn đã hết hạn',
          description: 'Phiên đã hết hạn vui lòng đăng nhập lại',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        console.log(error);
      }
    },
    [state, querySearch, token]
  );
  const handleChangeQuerySearch = useCallback((e) => {
    const value = e.target.value;
    setQuerySearch(value);
    if (!value) {
      handleGetListRoute('search', null, null, '');
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
      handleGetListRoute();
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
            <Heading size="lg">Quản lí tuyến đường</Heading>
          </CardHeader>
          <CardBody>
            <ActionBar
              onOpen={onOpen}
              setRouteId={setRouteId}
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              handleGetListRoute={handleGetListRoute}
              handleChangeQuerySearch={handleChangeQuerySearch}
            />
            <ListRoute
              list={listRoute}
              onOpen={onOpen}
              setRouteId={setRouteId}
              setRoute={setRoute}
              handleGetListRoute={handleGetListRoute}
              port={props.BACK_END_PORT}
              page={'route'}
              axiosJWT={axiosJWT}
              token={`Bearer ${state.dataUser.token}`}
            />
            <Pagination
              list_number={numberRoute}
              handleGetList={handleGetListRoute}
              setList={setListRoute}
              list={listRoute}
              currentPage={currentPage}
            />
            <AddRoute
              isOpen={isOpen}
              onClose={onClose}
              port={props.BACK_END_PORT}
              token={`Bearer ${state.dataUser.token}`}
              handleGetListRoute={handleGetListRoute}
              routeId={routeId}
              route={route}
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
