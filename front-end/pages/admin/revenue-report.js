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
  Image,
} from '@chakra-ui/react';
import axios from 'axios';

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
        <Card backgroundColor={'#F5F5F5'}>
          <CardHeader>
            <Heading size="lg">Quản lí xe</Heading>
          </CardHeader>
          <CardBody>
            <Tabs>
              <TabList>
                <Tab>Xe khách</Tab>
                <Tab>Xe trung chuyển</Tab>
              </TabList>
              <TabPanels>
                <TabPanel></TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
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
