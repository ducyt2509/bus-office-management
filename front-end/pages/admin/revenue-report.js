import BarChart from '@/components/revenue/BarChart';
import ListCashier from '@/components/revenue/ListCashier';
import {
  Text,
  Heading,
  Card,
  CardBody,
  Flex,
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TableContainer,
  Select,
  Img,
} from '@chakra-ui/react';
import axios from 'axios';
import Image from 'next/image';
import DoanhThu from '@/images/icons/DoanhThu.png';
import TrungBinhNgay from '@/images/icons/TrungBinhNgay.png';
import VeBan from '@/images/icons/VeBan.png';
import { useCallback, useEffect, useState } from 'react';
import { actions, useStore } from '@/src/store';
import Pagination from '@/components/common/Pagination';
import Cookies from 'js-cookie';

export default function RevenueReport(props) {
  const [token, setToken] = useState('');
  const [report, setReport] = useState('1');
  const [state, dispatch, axiosJWT] = useStore();

  const [listRevenue, setListRevenue] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberRevenue, setNumberRevenue] = useState('');
  const [revenueData, setRevenueData] = useState([]);
  const [revenue, setRevenue] = useState({
    TotalRevenue: 0,
    SoldTicket: 0,
  });

  const handleChangeReport = useCallback((value) => {
    setReport(value);
    handleListRevenue('', 1, 7, value);
  });

  const handleListRevenue = useCallback(
    async (type, page, limit, value) => {
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page : 1;
      const offset = limit * (page - 1);
      if (typeof page == 'number') {
        setCurrentPage(page);
      }
      try {
        const getListRevenue = await axiosJWT.post(
          `http://localhost:${props.BACK_END_PORT}/revenue/list-revenue`,
          {
            offset: offset,
            limit: limit,
            query_search: value != undefined ? value : report,
          },
          {
            headers: {
              token: token,
            },
          }
        );
        if (getListRevenue.data.statusCode == 200) {
          setListRevenue(getListRevenue.data.data.list_revenue);
          setNumberRevenue(getListRevenue.data.data.number_revenue);
          setRevenueData(getListRevenue.data.data.revenue_report);
          setRevenue({
            TotalRevenue: getListRevenue.data.data.total_revenue
              ? getListRevenue.data.data.total_revenue
              : 0,
            SoldTicket: getListRevenue.data.data.count_ticket
              ? getListRevenue.data.data.count_ticket
              : 0,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    [report, state, token]
  );

  let AverageRevenue =
    revenue.TotalRevenue / (report == 1 ? 1 : report == 2 ? 7 : report == 3 ? 30 : 12);

  const formatMoney = (amount) => {
    if (amount && amount.toString().split('.')[0].length < 7) {
      amount = (amount / 1000).toFixed(2) + 'k';
    } else if (
      amount &&
      amount.toString().split('.')[0].length > 6 &&
      amount.toString().split('.')[0].length < 10
    ) {
      amount = (amount / 1000000).toFixed(2) + 'tr';
    }
    if (amount && typeof amount == 'string' && amount.includes('.00')) {
      amount = amount.replace('.00', '');
    }
    return amount + ' VND';
  };

  useEffect(() => {
    const userData = Cookies.get('dataUser');
    dispatch(actions.setDataUser(JSON.parse(userData)));
    setToken(`Bearer ${JSON.parse(userData).token}`);
    if (token) {
      handleListRevenue();
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
        <Img
          borderRadius="full"
          boxSize="50px"
          src="https://bit.ly/dan-abramov"
          alt="Nguyễn Văn A"
        />
      </Flex>
      <div style={{ width: '90%', margin: '0 auto' }}>
        <Heading marginBottom="3%" size="lg">
          Báo cáo kinh doanh
        </Heading>
        <Flex justifyContent={'space-between'} marginBottom="3%">
          <Select w="20%" value={report} onChange={(e) => handleChangeReport(e.target.value)}>
            <option value="1">Hôm nay</option>
            <option value="2">Một tuần</option>
            <option value="3">Một tháng</option>
            <option value="4">Một năm</option>
          </Select>
          <Select w="20%">
            <option value="1">Xuất Excel</option>
            <option value="2">In</option>
          </Select>
        </Flex>

        <Grid templateColumns="repeat(3, 1fr)" gap={12} mt={3} marginBottom="3%">
          <Card backgroundColor={'#F5F5F5'}>
            <CardBody padding={'5% 10%'} fontSize={'20px'}>
              <Text fontWeight={600}>Doanh thu</Text>
              <Flex justifyContent={'space-between'} alignItems={'center'} marginTop="10px">
                <Image src={DoanhThu} width={'30'} height={'30'} />
                <Text fontWeight={600}>{formatMoney(revenue.TotalRevenue)}</Text>
              </Flex>
            </CardBody>
          </Card>

          <Card backgroundColor={'#F5F5F5'}>
            <CardBody padding={'5% 10%'} fontSize={'20px'}>
              <Text fontWeight={600}>Số vé đã bán</Text>
              <Flex justifyContent={'space-between'} alignItems={'center'} marginTop="10px">
                <Image src={TrungBinhNgay} width={'30'} height={'30'} />
                <Text fontWeight={600}>{revenue.SoldTicket} Vé</Text>
              </Flex>
            </CardBody>
          </Card>

          <Card backgroundColor={'#F5F5F5'}>
            <CardBody padding={'5% 10%'} fontSize={'20px'}>
              <Text fontWeight={600}>Trung bình mỗi ngày</Text>
              <Flex justifyContent={'space-between'} alignItems={'center'} marginTop="10px">
                <Image src={VeBan} width={'30'} height={'30'} />
                <Text fontWeight={600}>{formatMoney(AverageRevenue)}</Text>
              </Flex>
            </CardBody>
          </Card>
        </Grid>
        {report != 1 ? (
          <>
            <Tabs isFitted>
              <TabList mb="1em">
                <Tab>Biểu đồ</Tab>
                <Tab>Thu Ngân</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div style={{ padding: '30px 20px', margin: '10px auto', width: '90%' }}>
                    <BarChart report={report} listRevenue={listRevenue} revenueData={revenueData} />
                  </div>
                </TabPanel>
                <TabPanel>
                  <ListCashier listRevenue={listRevenue} />
                  <Pagination
                    list_number={numberRevenue}
                    handleGetList={handleListRevenue}
                    setList={setListRevenue}
                    list={listRevenue}
                    currentPage={currentPage}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
            <TableContainer marginBottom={'3%'} backgroundColor={'#f5f5f5'}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th borderColor="#000">Tuyến đường</Th>
                    <Th borderColor="#000">Số vé đã bán</Th>
                    <Th borderColor="#000">Doanh thu</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td borderColor="#000">inches</Td>
                    <Td borderColor="#000">millimetres (mm)</Td>
                    <Td borderColor="#000">25.4</Td>
                  </Tr>
                  <Tr>
                    <Td borderColor="#000">feet</Td>
                    <Td borderColor="#000">centimetres (cm)</Td>
                    <Td borderColor="#000">30.48</Td>
                  </Tr>
                  <Tr>
                    <Td borderColor="#000">yards</Td>
                    <Td borderColor="#000">metres (m)</Td>
                    <Td borderColor="#000">0.91444</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <>
            <ListCashier listRevenue={listRevenue} />
            <Pagination
              list_number={numberRevenue}
              handleGetList={handleListRevenue}
              setList={setListRevenue}
              list={listRevenue}
              currentPage={currentPage}
            />
          </>
        )}
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
