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
  Stack,
  CircularProgress
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { actions, useStore } from '@/src/store';
import axios from 'axios';
import ActionBar from '@/src/components/location/ActionBar';
import AddLocation from '@/src/components/location/AddLocation';
import ListLocation from '@/src/components/location/ListLocation';
import Pagination from '@/src/components/common/Pagination';
import Cookies from 'js-cookie';
import { HiOutlineDocumentSearch } from 'react-icons/hi';

export default function ManagementOffice(props) {
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const toastIdRef = useRef();
  const [token, setToken] = useState('');
  const [state, dispatch, axiosJWT] = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [listLocation, setListLocation] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [querySearch, setQuerySearch] = useState('');
  const [numberLocation, setNumberLocation] = useState('');
  const [locationId, setLocationId] = useState();
  const [location, setLocation] = useState({});

  const handleGetListLocation = useCallback(
    async (type, page, limit, value) => {
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page : 1;
      const offset = limit * (page - 1);
      if (typeof page == 'number') {
        setCurrentPage(page);
      }
      setLoading(true);
      try {
        const getListLocation = await axiosJWT.post(
          `http://localhost:${props.BACK_END_PORT}/location/list-location`,
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
        if (getListLocation.data.statusCode === 200) {
          setListLocation(getListLocation.data.data.listLocation);
          if (type == 'search') {
            setCurrentPage(1);
          }
          setNumberLocation(getListLocation.data.data.numberLocation);
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
            description: 'Không thể lấy danh sách địa điểm. Làm ơn hãy thử lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        }

        toastIdRef.current = toast({
          title: 'Phiên của bạn đã hết hạn',
          description: 'Phiên đã hết hạn vui lòng đăng nhập lại',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
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
      handleGetListLocation('search', null, null, '');
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
      handleGetListLocation();
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
            <Heading size="lg">Quản lí điểm đón trả</Heading>
          </CardHeader>
          <CardBody paddingTop="0">
            <ActionBar
              onOpen={onOpen}
              setLocationId={setLocationId}
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              handleGetListLocation={handleGetListLocation}
              handleChangeQuerySearch={handleChangeQuerySearch}
            />
            {loading ? (
              <CircularProgress isIndeterminate color=" #ffbea8" />
            ) : listLocation.length ? (
              <>
                <ListLocation
                  list={listLocation}
                  onOpen={onOpen}
                  setLocationId={setLocationId}
                  setLocation={setLocation}
                  handleGetListLocation={handleGetListLocation}
                  token={`Bearer ${state.dataUser.token}`}
                  port={props.BACK_END_PORT}
                  axiosJWT={axiosJWT}
                />
                <Pagination
                  list_number={numberLocation}
                  handleGetList={handleGetListLocation}
                  setList={setListLocation}
                  list={listLocation}
                  setCurrentPage={setCurrentPage}
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
            <AddLocation
              isOpen={isOpen}
              onClose={onClose}
              port={props.BACK_END_PORT}
              token={`Bearer ${state.dataUser.token}`}
              handleGetListLocation={handleGetListLocation}
              locationId={locationId}
              location={location}
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
