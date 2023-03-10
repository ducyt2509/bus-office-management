import {
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Image,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/src/store';
import axios from 'axios';
import ActionBar from '@/components/office/ActionBar';
import AddOffice from '@/components/office/AddOffice';
import ListOffice from '@/components/office/ListOffice';

export default function ManagementOffice(props) {
  const [state, dispath] = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [listOffice, setListOffice] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dynamicListOffice, setDynamicListOffice] = useState([]);
  const [querySearch, setQuerySearch] = useState('');
  const [numberOffice, setNumberOffice] = useState('');
  const [officeId, setOfficeId] = useState();
  const [office, setOffice] = useState({});

  const handleGetListOffice = useCallback(
    async (offset, limit) => {
      const token = `Bearer ${state.dataUser.token}`;
      offset = offset ? offset : 0;
      limit = limit ? limit : 7;
      const getListOffice = await axios.post(
        `http://localhost:${props.BACK_END_PORT}/office/list-office`,
        {
          offset: offset,
          limit: limit,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      if (getListOffice.data.statusCode === 200) {
        setListOffice(getListOffice.data.data.list_office);
        setDynamicListOffice(getListOffice.data.data.list_office);
        setCurrentPage(1);
        setNumberOffice(getListOffice.data.data.number_office);
      }
    },
    [state]
  );
  useEffect(() => {
    handleGetListOffice();
  }, []);
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
        <Text marginRight="1%">Dan Abramov</Text>
        <Image
          borderRadius="full"
          boxSize="50px"
          src="https://bit.ly/dan-abramov"
          alt="Dan Abramov"
        />
      </Flex>
      <div style={{ width: '90%', margin: '0 auto' }}>
        <Card backgroundColor={'#F5F5F5'}>
          <CardHeader>
            <Heading size="lg">Quản lí văn phòng</Heading>
          </CardHeader>
          <CardBody>
            <ActionBar onOpen={onOpen} setOfficeId={setOfficeId} />
            <ListOffice
              list={listOffice}
              onOpen={onOpen}
              setOfficeId={setOfficeId}
              setOffice={setOffice}
              handleGetListOffice={handleGetListOffice}
              port={props.BACK_END_PORT}
            />
            <AddOffice
              isOpen={isOpen}
              onClose={onClose}
              port={props.BACK_END_PORT}
              token={`Bearer ${state.dataUser.token}`}
              handleGetListOffice={handleGetListOffice}
              officeId={officeId}
              office={office}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
export async function getStaticProps() {
  const getListCity = await axios.get(
    `http://localhost:${process.env.BACK_END_PORT}/city/list-city`
  );
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
      list_city: getListCity.data.data?.listCity,
    },
  };
}
