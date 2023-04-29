import { formatMoney, validate } from '@/helper';
import {
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Button,
  Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useState } from 'react';
import Pagination from '@/src/components/common/Pagination';
import { useRouter } from 'next/router';

export default function searchTicket(props) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [phone, setPhone] = useState('');
  const [listTicket, setListTicket] = useState([]);
  const [numberTicket, setNumberTicket] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const handleChangePhone = useCallback(
    (e) => {
      let value = e.target.value;
      if (!value) {
        setError(true);
      } else {
        setError(false);
      }
      setPhone(value);
    },
    [error]
  );
  const getTicketDetails = (data) => {
    let submitData = { ...data, route_name: data.city_from + ' - ' + data.city_to };
    submitData.router_name = data.city_from + ' - ' + data.city_to;
    router.push({
      pathname: '/ticket/ticket-detail',
      query: submitData,
    });
  };
  const handleSearchTicket = useCallback(
    async (type, page, limit) => {
      if (!phone) {
        setError(true);
        return;
      }
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page : 1;
      const offset = limit * (page - 1);
      if (typeof page == 'number') {
        setCurrentPage(page);
      }
      const searchTicket = await axios.post(
        `http://localhost:${props.port}/transaction/list-transaction`,
        { phone: phone, offset: offset, limit: limit }
      );
      if (searchTicket.data.statusCode == 200) {
        if (type == 'search') {
          setCurrentPage(1);
        }
        setListTicket(searchTicket.data.data.list_transaction);
        setNumberTicket(searchTicket.data.data.number_transaction);
      }
    },
    [phone]
  );
  const listTicketHTML = listTicket.map((ticket) => {
    return (
      <Card
        border={'1px solid'}
        width={'70%'}
        margin={'0 auto'}
        marginTop="2%"
        cursor={'pointer'}
        onClick={() => getTicketDetails(ticket)}
      >
        <CardBody>
          <Flex justifyContent={'space-between'}>
            <Stack>
              <Flex>
                <Text fontWeight="600">Ngày đi:&ensp;</Text>
                <Text fontWeight="600">{ticket?.date_detail.split('  ')[0]}</Text>
              </Flex>
              <Flex>
                <Text fontWeight="600">Tuyến đường:&ensp;</Text>
                <Text fontWeight="600">{ticket.city_from + ' - ' + ticket.city_to}</Text>
              </Flex>
            </Stack>
            <Stack>
              <Flex>
                <Text fontWeight="600">Thời gian:&ensp;</Text>
                <Text fontWeight="600">{ticket?.date_detail.split('  ')[1]}</Text>
              </Flex>
              <Flex>
                <Text fontWeight="600">Biển số xe:&ensp;</Text>
                <Text fontWeight="600">{ticket?.vehicle_plate}</Text>
              </Flex>
            </Stack>
            <Stack>
              <Flex>
                <Text fontWeight="600">Số ghế:&ensp;</Text>
                <Text fontWeight="600">{ticket?.seat}</Text>
              </Flex>
              <Flex>
                <Text fontWeight="600">Giá vé:&ensp;</Text>
                <Text fontWeight="600">{formatMoney(ticket.ticket_price)}</Text>
              </Flex>
            </Stack>
          </Flex>
        </CardBody>
      </Card>
    );
  });
  return (
    <>
      <Text
        fontSize={'25px'}
        textAlign={'center'}
        marginTop={'2%'}
        margin={'3%'}
        fontWeight={'600'}
      >
        Tra cứu vé
      </Text>
      <FormControl isRequired isInvalid={error}>
        <Flex alignItems={'center'} width={'60%'} margin={'0 auto'}>
          <FormLabel w="30%">Số điện thoại/Mã vé</FormLabel>
          <Input value={phone} onChange={handleChangePhone} marginRight={'3%'} />

          <Button
            backgroundColor={'#F26A4C'}
            color={'#fff'}
            onClick={handleSearchTicket}
            padding="0 30px"
          >
            Tra cứu
          </Button>
        </Flex>
        <FormErrorMessage justifyContent={'space-around'}>
          {!phone ? 'Số điện thoại là bắt buộc' : 'Số điện thoại sai định dạng'}
        </FormErrorMessage>
      </FormControl>
      {listTicketHTML}
      {listTicket && listTicket.length ? (
        <Pagination
          list_number={numberTicket}
          handleGetList={handleSearchTicket}
          setList={setListTicket}
          list={listTicket}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      ) : null}
    </>
  );
}
export async function getServerSideProps(context) {
  return {
    props: {
      port: process.env.BACK_END_PORT,
    }, // will be passed to the page component as props
  };
}
