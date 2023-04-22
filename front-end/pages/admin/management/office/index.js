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
import ActionBar from '@/src/components/office/ActionBar';
import AddOffice from '@/src/components/office/AddOffice';
import ListOffice from '@/src/components/office/ListOffice';
import Pagination from '@/src/components/common/Pagination';
import Cookies from 'js-cookie';

export default function ManagementOffice(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [token, setToken] = useState('');
  const [state, dispatch, axiosJWT] = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [listOffice, setListOffice] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [querySearch, setQuerySearch] = useState('');
  const [numberOffice, setNumberOffice] = useState('');
  const [officeId, setOfficeId] = useState();
  const [office, setOffice] = useState({});

  const handleGetListOffice = useCallback(
    async (type, page, limit, value) => {
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page : 1;
      const offset = limit * (page - 1);
      if (typeof page == 'number') {
        setCurrentPage(page);
      }
      try {
        const getListOffice = await axiosJWT.post(
          `http://localhost:${props.BACK_END_PORT}/office/list-office`,
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
        if (getListOffice.data.statusCode === 200) {
          setListOffice(getListOffice.data.data.list_office);
          if (type == 'search') {
            setCurrentPage(1);
          }
          setNumberOffice(getListOffice.data.data.number_office);
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
      handleGetListOffice('search', null, null, '');
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
      handleGetListOffice();
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
            <Heading size="lg">Quản lí văn phòng</Heading>
          </CardHeader>
          <CardBody>
            <ActionBar
              onOpen={onOpen}
              setOfficeId={setOfficeId}
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              handleGetListOffice={handleGetListOffice}
              handleChangeQuerySearch={handleChangeQuerySearch}
            />
            <ListOffice
              list={listOffice}
              onOpen={onOpen}
              token={`Bearer ${state.dataUser.token}`}
              setOfficeId={setOfficeId}
              setOffice={setOffice}
              handleGetListOffice={handleGetListOffice}
              port={props.BACK_END_PORT}
              axiosJWT={axiosJWT}
            />
            <Pagination
              list_number={numberOffice}
              handleGetList={handleGetListOffice}
              setList={setListOffice}
              list={listOffice}
              currentPage={currentPage}
            />
            <AddOffice
              isOpen={isOpen}
              onClose={onClose}
              port={props.BACK_END_PORT}
              token={`Bearer ${state.dataUser.token}`}
              handleGetListOffice={handleGetListOffice}
              officeId={officeId}
              office={office}
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
