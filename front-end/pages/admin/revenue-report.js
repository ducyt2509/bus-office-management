import BarChart from '@/components/revenue/BarChart';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Image, Grid
} from '@chakra-ui/react';
import axios from 'axios';
import { Icon } from '@chakra-ui/react'
import { RiMoneyDollarBoxLine } from "react-icons/ri";
export default function RevenueReport(props) {
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
        <Image
          borderRadius="full"
          boxSize="50px"
          src="https://bit.ly/dan-abramov"
          alt="Nguyễn Văn A"
        />
      </Flex>
      <div style={{ width: '90%', margin: '0 auto' }}>
        <Heading size="lg">Báo cáo doanh thu </Heading>


        <Grid templateColumns='repeat(3, 1fr)' gap={12} mt={3}>
          <Card backgroundColor={'#D6D6D6'} p={[0, 3]}>
            <CardHeader>
              <Heading size='md' textAlign="left">Danh thu</Heading>
            </CardHeader>
            <CardBody>
              <Flex justifyContent="space-between" alignItems="center">
                <Icon as={RiMoneyDollarBoxLine} boxSize={6} />
                <span style={{ fontSize: "30px", fontWeight: "bold" }}>30000</span>
              </Flex>
            </CardBody>
          </Card>


          <Card backgroundColor={'#D6D6D6'} p={[0, 3]}>
            <CardHeader>
              <Heading size='md' textAlign="left">Danh thu</Heading>
            </CardHeader>
            <CardBody>
              <Flex justifyContent="space-between" alignItems="center">
                <Icon as={RiMoneyDollarBoxLine} boxSize={6} />
                <span style={{ fontSize: "30px", fontWeight: "bold" }}>30000</span>
              </Flex>
            </CardBody>
          </Card>
          <Card backgroundColor={'#D6D6D6'} p={[0, 3]}>
            <CardHeader>
              <Heading size='md' textAlign="left">Danh thu</Heading>
            </CardHeader>
            <CardBody>
              <Flex justifyContent="space-between" alignItems="center">
                <Icon as={RiMoneyDollarBoxLine} boxSize={6} />
                <span style={{ fontSize: "30px", fontWeight: "bold" }}>30000</span>
              </Flex>
            </CardBody>
          </Card>
        </Grid>

        <div style={{ padding: "30px 20px", margin: '10px auto', width: '90%' }} >
          <BarChart width='80%'></BarChart>
        </div>
      </div>
    </div>
  );
}
export async function getStaticProps() {
  const getListCity = await axios.post(
    `http://localhost:${process.env.BACK_END_PORT}/city/list-city`
  );
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
      list_city: getListCity.data.data?.listCity,
    },
  };
}
