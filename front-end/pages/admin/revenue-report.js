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
import { useState } from 'react';

export default function RevenueReport(props) {
  const [report, setReport] = useState('1');
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
        <Text marginRight="1%">Nguyễn Văn A</Text>
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
          <Select w="20%" value={report} onChange={(e) => setReport(e.target.value)}>
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
                <Text fontWeight={600}>423.3tr VND</Text>
              </Flex>
            </CardBody>
          </Card>

          <Card backgroundColor={'#F5F5F5'}>
            <CardBody padding={'5% 10%'} fontSize={'20px'}>
              <Text fontWeight={600}>Vé bán</Text>
              <Flex justifyContent={'space-between'} alignItems={'center'} marginTop="10px">
                <Image src={TrungBinhNgay} width={'30'} height={'30'} />
                <Text fontWeight={600}>423.3tr VND</Text>
              </Flex>
            </CardBody>
          </Card>

          <Card backgroundColor={'#F5F5F5'}>
            <CardBody padding={'5% 10%'} fontSize={'20px'}>
              <Text fontWeight={600}>Trung bình mỗi ngày</Text>
              <Flex justifyContent={'space-between'} alignItems={'center'} marginTop="10px">
                <Image src={VeBan} width={'30'} height={'30'} />
                <Text fontWeight={600}>423.3tr VND</Text>
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
                    <BarChart report={report} />
                  </div>
                </TabPanel>
                <TabPanel>
                  <ListCashier />
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
          <ListCashier />
        )}
      </div>
    </div>
  );
}
export async function getStaticProps() {
  // const getListCity = await axios.post(
  //   `http://localhost:${process.env.BACK_END_PORT}/city/list-city`
  // );
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
      // list_city: getListCity.data.data?.listCity,
    },
  };
}
