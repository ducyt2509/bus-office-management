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
import ActionBar from "@/components/location/ActionBar";
import AddLocation from "@/components/location/AddLocation";
import ListLocation from "@/components/location/ListLocation";
import Pagination from "@/components/common/Pagination";

export default function ManagementOffice(props) {
  const [state, dispath] = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [listLocation, setListLocation] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dynamicListLocation, setDynamicListLocation] = useState([]);
  const [querySearch, setQuerySearch] = useState("");
  const [numberLocation, setNumberLocation] = useState("");
  const [locationId, setLocationId] = useState();
  const [location, setLocation] = useState({});

  const handleGetListLocation = useCallback(
    async (page, limit) => {
      console.log("[PAGE , LIMIT]", currentPage, page)
      limit = limit ? limit : 7;
      page = page ? page - 1 : 0;
      const offset = limit * page;
      if (page) {
        setCurrentPage(page);
      }
      const token = `Bearer ${state.dataUser.token}`;
      const getListLocation = await axios.post(
        `http://localhost:${props.BACK_END_PORT}/location/list-location`,
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
      if (getListLocation.data.statusCode === 200) {
        setListLocation(getListLocation.data.data.listLocation);
        setDynamicListLocation(getListLocation.data.data.listLocation);
        setCurrentPage(page);
        setNumberLocation(getListLocation.data.data.numberLocation);
      }
    },
    [state],
  );
  useEffect(() => {
    handleGetListLocation();
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
            <Heading size="lg">Quản lí điểm đón trả</Heading>
          </CardHeader>
          <CardBody>
            <ActionBar
              onOpen={onOpen}
              setLocationId={setLocationId}
            />
            <ListLocation
              list={listLocation}
              onOpen={onOpen}
              setLocationId={setLocationId}
              setLocation={setLocation}
              handleGetListLocation={handleGetListLocation}
              port={props.BACK_END_PORT}
            />
            <Pagination
              list_number={numberLocation}
              handleGetList={handleGetListLocation}
              setList={setListLocation}
              list={listLocation}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
            <AddLocation
              isOpen={isOpen}
              onClose={onClose}
              port={props.BACK_END_PORT}
              token={`Bearer ${state.dataUser.token}`}
              handleGetListLocation={handleGetListLocation}
              locationId={locationId}
              location={location}
              currentPage={currentPage}
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
