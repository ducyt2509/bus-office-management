import {
  Stack,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
  useDisclosure,
  Image,
  useToast,
  CircularProgress,
} from '@chakra-ui/react';
import axios from 'axios';
import { actions, useStore } from '@/src/store';
import { useCallback, useEffect, useRef, useState } from 'react';
import ListBus from '@/src/components/bus/ListBus';
import ActionBar from '@/src/components/bus/ActionBar';
import Pagination from '@/src/components/common/Pagination';
import AddBus from '@/src/components/bus/AddBus';
import Cookies from 'js-cookie';
import { HiOutlineDocumentSearch } from 'react-icons/hi';

export default function ManagementBus(props) {
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const toastIdRef = useRef();
  const [token, setToken] = useState('');
  const [state, dispatch, axiosJWT] = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [listBus, setListBus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [querySearch, setQuerySearch] = useState('');
  const [numberBus, setNumberBus] = useState('');
  const [vehicleId, setVehicleId] = useState();
  const [vehicle, setVehicle] = useState({});

  const handleGetListBus = useCallback(
    async (type, page, limit, value) => {
      const token = `Bearer ${state.dataUser.token}`;
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page : 1;
      const offset = limit * (page - 1);
      if (typeof page == 'number') {
        setCurrentPage(page);
      }
      setLoading(true);
      try {
        const getListBus = await axiosJWT.post(
          `http://localhost:${props.BACK_END_PORT}/bus/list-bus`,
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
        if (getListBus.data.statusCode === 200) {
          setListBus(getListBus.data.data.list_bus);
          if (type == 'search') {
            setCurrentPage(1);
          }
          setNumberBus(getListBus.data.data.number_bus);
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
            description: 'Không thể lấy danh sách xe. Làm ơn hãy thử lại.',
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
      handleGetListBus('search', null, null, '');
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
      handleGetListBus();
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
          alt="Dan Abramov"
        />
      </Flex>
      <div style={{ width: '90%', margin: '0 auto' }}>
        <Card>
          <CardHeader paddingBottom="0" paddingTop="0">
            <Heading size="lg">Quản lí xe</Heading>
          </CardHeader>
          <CardBody paddingTop="0">
            <ActionBar
              onOpen={onOpen}
              setVehicleId={setVehicleId}
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              handleGetListBus={handleGetListBus}
              handleChangeQuerySearch={handleChangeQuerySearch}
            />
            {loading ? (
              <CircularProgress isIndeterminate color=" #ffbea8" />
            ) : listBus.length ? (
              <>
                <ListBus
                  list={listBus}
                  onOpen={onOpen}
                  setVehicleId={setVehicleId}
                  setVehicle={setVehicle}
                  handleGetListBus={handleGetListBus}
                  port={props.BACK_END_PORT}
                  axiosJWT={axiosJWT}
                  token={`Bearer ${state.dataUser.token}`}
                />
                <Pagination
                  list_number={numberBus}
                  handleGetList={handleGetListBus}
                  setList={setListBus}
                  list={listBus}
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
            <AddBus
              isOpen={isOpen}
              onClose={onClose}
              port={props.BACK_END_PORT}
              token={`Bearer ${state.dataUser.token}`}
              handleGetListBus={handleGetListBus}
              vehicleId={vehicleId}
              vehicle={vehicle}
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
