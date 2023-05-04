import {
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Image,
  useToast,
  Stack,
  CircularProgress,
} from '@chakra-ui/react';
import axios from 'axios';
import ActionBar from '@/src/components/bus-schedule/ActionBar';
import ListBusSchedule from '@/src/components/bus-schedule/ListBusSchedule';
import Pagination from '@/src/components/common/Pagination';
import { actions, useStore } from '@/src/store';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { HiOutlineDocumentSearch } from 'react-icons/hi';

export default function ManagementBusSchedule(props) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const router = useRouter();
  const toast = useToast();
  const toastIdRef = useRef();
  const [state, dispatch, axiosJWT] = useStore();

  const [listBusSchedule, setListBusSchedule] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [querySearch, setQuerySearch] = useState('');
  const [numberBusSchedule, setNumberBusSchedule] = useState('');

  const handleGetListBusSchedule = useCallback(
    async (type, page, limit, value) => {
      page = typeof page == 'number' ? page : 1;
      limit = limit ? limit : 7;
      if (typeof page == 'number') {
        setCurrentPage(page);
      }
      const offset = limit * (page - 1);
      setLoading(true);
      try {
        const getListBusSchedule = await axiosJWT.post(
          `http://localhost:${props.BACK_END_PORT}/bus-schedule/list-bus-schedule`,
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
        if (getListBusSchedule.data.statusCode === 200) {
          setListBusSchedule(getListBusSchedule.data.data.list_bus_schedule);
          setNumberBusSchedule(getListBusSchedule.data.data.number_bus_schedule);
          if (type == 'search') {
            setCurrentPage(1);
          }
        }
      } catch (err) {
        console.log('BEAN', err);
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
      handleGetListBusSchedule('search', null, null, '');
    }
  });
  const handleGetBusScheduleInformation = useCallback((id, conditionEdit) => {
    if (conditionEdit) {
      return;
    }
    router.push({
      pathname: '/admin/management/bus-schedule/[id]',
      query: { id: id },
    });
  });
  const handleRefreshScheduleInformation = useCallback((id) => {
    router.push({
      pathname: '/admin/management/bus-schedule/[id]',
      query: { id: id, method: 'Refresh' },
    });
  });

  const handleTotalRenewal = useCallback(async () => {
    try {
      const getTotalRenewal = await axiosJWT.get(
        `http://localhost:${props.BACK_END_PORT}/bus-schedule/check-renewal-bus-schedule`,
        {
          headers: {
            token: token,
          },
        }
      );
      if (getTotalRenewal.data.statusCode == 200) {
        let totalRenewal = getTotalRenewal.data.data.totalBSNeedRenewal;
        if (totalRenewal && totalRenewal > 0) {
          let toastRenew = setTimeout(() => {
            toastIdRef.current = toast({
              title: 'Lịch trình xe cần được cập nhật.',
              description: `Có ${totalRenewal} lịch trình sắp hết hạn`,
              status: 'warning',
              isClosable: true,
              position: 'top',
              duration: 10000,
            });
          }, 3000);
          return () => {
            clearTimeout(toastRenew);
          };
        }
      }
    } catch (err) {
      console.log(err);
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
          description: 'Xảy ra lỗi khi thao tác. Làm ơn hãy thử lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
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
    }
    dispatch(actions.setDataUser(userData));
    setToken(accessToken);
    if (token) {
      handleGetListBusSchedule();
      if (userData?.role_id == 1) {
        handleTotalRenewal();
      }
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
        <Text marginRight="1%" fontWeight={'600'}>
          {state.dataUser.user_name}
        </Text>
        <Image borderRadius="full" boxSize="50px" src="https://bit.ly/dan-abramov" />
      </Flex>
      <div style={{ width: '90%', margin: '0 auto' }}>
        <Card>
          <CardHeader paddingBottom="0" paddingTop="0">
            <Heading size="lg">Quản lí lịch trình</Heading>
          </CardHeader>
          <CardBody paddingTop="0">
            <ActionBar
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              handleGetListBusSchedule={handleGetListBusSchedule}
              handleChangeQuerySearch={handleChangeQuerySearch}
              handleGetBusScheduleInformation={handleGetBusScheduleInformation}
            />
            {loading ? (
              <CircularProgress isIndeterminate color=" #ffbea8" />
            ) : listBusSchedule.length ? (
              <>
                <ListBusSchedule
                  list={listBusSchedule}
                  handleGetListBusSchedule={handleGetListBusSchedule}
                  port={props.BACK_END_PORT}
                  handleGetBusScheduleInformation={handleGetBusScheduleInformation}
                  token={`Bearer ${state.dataUser.token}`}
                  axiosJWT={axiosJWT}
                  handleRefreshScheduleInformation={handleRefreshScheduleInformation}
                />
                <Pagination
                  list_number={numberBusSchedule}
                  handleGetList={handleGetListBusSchedule}
                  setList={setListBusSchedule}
                  list={listBusSchedule}
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
