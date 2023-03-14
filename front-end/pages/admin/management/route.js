import {
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useStore } from "@/src/store";
import axios from "axios";
import ActionBar from "@/components/route/ActionBar";
import AddRoute from "@/components/route/AddRoute";
import ListRoute from "@/components/route/ListRoute";
import Pagination from "@/components/common/Pagination";

export default function ManagementRoute(props) {
  const [state, dispath] = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [listRoute, setListRoute] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dynamicListRoute, setDynamicListRoute] = useState([]);
  const [querySearch, setQuerySearch] = useState("");
  const [numberRoute, setNumberRoute] = useState("");
  const [routeId, setRouteId] = useState();
  const [route, setRoute] = useState({});

  const handleGetListRoute = useCallback(
    async (page, limit) => {
      limit = limit ? limit : 7;
      page = page ? page - 1 : 0;
      const offset = limit * page;
      if (page) {
        setCurrentPage(page);
      }
      const token = `Bearer ${state.dataUser.token}`;
      const getListRoute = await axios.post(
        `http://localhost:${props.BACK_END_PORT}/route/get-list-route`,
        {
          offset: offset,
          limit: limit,
        },
        {
          headers: {
            token: token,
          },
        },
      );
      if (getListRoute.data.statusCode === 200) {
        setListRoute(getListRoute.data.data.list_route);
        setDynamicListRoute(getListRoute.data.data.number_route);
        setCurrentPage(1);
        setNumberRoute(getListRoute.data.data.number_route);
      }
    },
    [state],
  );
  useEffect(() => {
    handleGetListRoute();
  }, []);
  return (
    <div style={{ position: "relative", left: "20%", width: "80%" }}>
      <Flex
        alignItems={"center"}
        justifyContent="flex-end"
        width={"84%"}
        margin="0 auto"
        marginBottom={"2%"}
        paddingTop="2%"
      >
        <Text marginRight="1%">{state.dataUser.user_name}</Text>
        <Image
          borderRadius="full"
          boxSize="50px"
          src={state.dataUser.avatar ? state.dataUser.avatar : "https://bit.ly/dan-abramov"}
          alt="Dan Abramov"
        />
      </Flex>
      <div style={{ width: "90%", margin: "0 auto" }}>
        <Card backgroundColor={"#F5F5F5"}>
          <CardHeader>
            <Heading size="lg">Quản lí văn phòng</Heading>
          </CardHeader>
          <CardBody>
            <ActionBar
              onOpen={onOpen}
              setRouteId={setRouteId}
            />
            <ListRoute
              list={listRoute}
              onOpen={onOpen}
              setRouteId={setRouteId}
              setRoute={setRoute}
              handleGetListRoute={handleGetListRoute}
              port={props.BACK_END_PORT}
            />
            <Pagination
              list_number={numberRoute}
              handleGetList={handleGetListRoute}
              setList={setListRoute}
              list={listRoute}
              currentPage={currentPage}
            />
            <AddRoute
              isOpen={isOpen}
              onClose={onClose}
              port={props.BACK_END_PORT}
              token={`Bearer ${state.dataUser.token}`}
              handleGetListRoute={handleGetListRoute}
              routeId={routeId}
              route={route}
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
