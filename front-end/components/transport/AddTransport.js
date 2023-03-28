import { useStore } from '@/src/store';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Input,
  Select,
  Text,
  Textarea,
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { convertTime, formatDate, validate } from '@/helper';

export default function AddTransport(props) {
  const [state, dispatch] = useStore()
  const [listBusSchedule, setListBusSchedule] = useState([])
  const [listBus, setListBus] = useState([])

  const [busPlate, setBusPlate] = useState()
  const [busSchedule, setBusSchedule] = useState()
  const [time, setTime] = useState()


  const handleChangeBusPlate = (e) => {
    setBusPlate(e.target.value);
  };
  const handleChangeBusSchedule = (e) => {
    setBusSchedule(e.target.value);
  };
  const handleChangeTime = (e) => {
    setTime(e.target.value);
  };

  const handleAddTransport = useCallback(async () => {
    const submitData = {
      bus_schedule_id: busSchedule,
      bus_id: busPlate,
      departure_date: time,
    };
    if (props.locationId) {
      submitData.id = props.locationId;
      const updateLocation = await axios.put(
        `http://localhost:${props.port}/location/update-location`,
        submitData,
        {
          headers: { token: props.token },
        }
      );
      if (updateLocation.data.statusCode == 200) {
        props.handleGetListTransport(props.currentPage);
        props.onClose();
      }
    } else {
      const addLocation = await axios.post(
        `http://localhost:${props.port}/transport/add-transport`,
        submitData,
        {
          headers: { token: props.token },
        }
      );
      if (addLocation.data.statusCode == 200) {
        props.handleGetListTransport(props.currentPage,);
        props.onClose();
      }
    }
    setBusPlate(0);
    setBusSchedule(0);
    setTime("")

  }, [time, busPlate, busSchedule]);

  const handleGetListBusSchedule = useCallback(
    async (page, limit, value) => {
      page = typeof page == 'number' ? page - 1 : 0;
      limit = limit ? limit : 7;
      const token = `Bearer ${state.dataUser.token}`;
      const offset = limit * page;
      const getListBusSchedule = await axios.post(
        `http://localhost:${props.port}/bus-schedule/list-bus-schedule`,
        {
          offset: offset,
          limit: limit,
          // query_search: value != undefined ? value : querySearch,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      if (getListBusSchedule.data.statusCode === 200) {
        setListBusSchedule(getListBusSchedule.data.data.list_bus_schedule);
      }
    },
    [state]
  );
  const handleGetListBus = useCallback(
    async (page, limit, value) => {
      const token = `Bearer ${state.dataUser.token}`;
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page - 1 : 0;
      const offset = limit * page;
      const getListBus = await axios.post(
        `http://localhost:${props.port}/bus/list-bus`,
        {
          offset: offset,
          limit: limit,
          // query_search: value != undefined ? value : querySearch,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      if (getListBus.data.statusCode === 200) {
        setListBus(getListBus.data.data.list_bus);
      }
    },
    [state]
  );

  useEffect(() => {
    console.log(props.transport)
    if (props.transportId) {
      setTime(formatDate(props.transport.departure_date));
      setBusPlate(props.transport.bus_id);
      setBusSchedule(props.transport.bus_schedule_id)
    } else {
      setBusPlate(0);
      setBusSchedule(0);
      setTime("")
    }
  }, [props.transportId]);

  useEffect(() => {
    if (props.isOpen) {
      handleGetListBus();
      handleGetListBusSchedule()
    }
  }, [props.isOpen]);
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size="lg" >
        <ModalOverlay />
        <ModalContent p={3}>
          <ModalHeader>
            <Text fontSize={'3xl'} textAlign="center">
              {!props.transportId ? 'Tạo Hành Trình Xe' : 'Chỉnh Sửa Hành Trình Xe'}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex marginBottom={'5%'}>
              <Text width={'51.5%'} fontWeight={'500'}>
                Lịch trình xe
              </Text>
              <Select placeholder="Select option" value={busSchedule} onChange={handleChangeBusSchedule}>
                {listBusSchedule.map((bs) => {
                  return <option value={bs?.id}>{bs?.route[0].city_from} - {bs?.route[0].city_to} | {convertTime(bs.time_from, 0)} - {convertTime(bs.time_from, bs.travel_time)}</option>;
                })}
              </Select>
            </Flex>
            <Flex marginBottom={'5%'}>
              <Text width={'50%'} fontWeight={'500'}>
                Biển số xe
              </Text>
              <Select placeholder="Select option" value={busPlate} onChange={handleChangeBusPlate}>
                {listBus.map((bus) => {
                  return <option value={bus?.id}>{bus?.vehicle_plate}</option>;
                })}
              </Select>
            </Flex>
            <Flex marginBottom={'5%'}>
              <Text width={'51.5%'} fontWeight={'500'}>
                Ngày khởi hành
              </Text>
              <Input value={time} onChange={handleChangeTime} type="date" min={validate.min_date}/>
            </Flex>
          </ModalBody>

          <ModalFooter justifyContent={'space-around'}>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={props.onClose}
              backgroundColor="#fff"
              color="#686868"
              border={'1px solid #686868'}
            >
              Huỷ
            </Button>
            <Button backgroundColor="#686868" color="#fff" onClick={handleAddTransport}>
              {!props.locationId ? 'Tạo Điểm Đón Trả' : 'Chỉnh Sửa Điểm Đón Trả'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
