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
  Input,
  Select,
  Text,
  useToast,
  FormControl,
  FormLabel,
  Flex,
  FormErrorMessage,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { convertTime, formatDate, validate } from '@/helper';
import { useRef } from 'react';

export default function AddTransport(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [state, dispatch] = useStore();
  const [listBusSchedule, setListBusSchedule] = useState([]);
  const [listBus, setListBus] = useState([]);

  const [busPlate, setBusPlate] = useState();
  const [busSchedule, setBusSchedule] = useState();
  const [departureDate, setDepartureDate] = useState();
  const [error, setError] = useState({
    busPlate: false,
    busSchedule: false,
  });

  const handleChangeBusPlate = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value) {
        oldError.busPlate = true;
      } else {
        oldError.busPlate = false;
      }
      setError(oldError);
      setBusPlate(value);
    },
    [error]
  );
  const handleChangeBusSchedule = useCallback(
    async (e) => {
      let value = e.target.value;
      const getBS = await props.axiosJWT.post(
        `http://localhost:${props.port}/bus-schedule/bus-schedule-by-id`,
        { id: value },
        {
          headers: { token: props.token },
        }
      );
      let oldError = { ...error };
      if (!value) {
        oldError.busSchedule = true;
      } else {
        oldError.busSchedule = false;
      }

      setError(oldError);
      setBusSchedule(value);

      // nếu eff date >= current thì departure date = eff  và ngược lại 
      if (getBS.data.data.bus_schedule[0].effective_date.split('T')[0] <= new Date().toISOString().split('T')[0]) { setDepartureDate(new Date().toISOString().split('T')[0]) }
      else {
        setDepartureDate(getBS.data.data.bus_schedule[0].effective_date.split('T')[0])
      }

    },
    [error]
  );

  const handleAddTransport = useCallback(async () => {
    let oldError = { ...error };

    if (!busPlate) {
      oldError.busPlate = true;
    }
    if (!busSchedule) {
      oldError.busSchedule = true;
    }
    if (oldError.busPlate || oldError.busSchedule) {
      setError(oldError);
      return;
    }
    const submitData = {
      bus_schedule_id: busSchedule,
      bus_id: busPlate,
      departure_date: departureDate,
    };
    if (props.locationId) {
      submitData.id = props.locationId;
      try {
        const updateLocation = await props.axiosJWT.put(
          `http://localhost:${props.port}/location/update-location`,
          submitData,
          {
            headers: { token: props.token },
          }
        );
        if (updateLocation.data.statusCode == 200) {
          toastIdRef.current = toast({
            title: 'Hành trình xe đã được cập nhật.',
            description: 'Chúng tôi đã cập nhật hành trình xe cho bạn.',
            status: 'success',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
          props.handleGetListTransport(props.currentPage);
          props.onClose();
        }
      } catch (err) {
        if (err.response.data.statusCode == 401) {
          toastIdRef.current = toast({
            title: 'Phiên của bạn đã hết hạn.',
            description: 'Phiên đã hết hạn vui lòng đăng nhập lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        } else {
          toastIdRef.current = toast({
            title: err.response.data.data.message,
            description: 'Xảy ra lỗi khi cập nhật hành trình xe. Làm ơn hãy thử lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        }
      }
    } else {
      try {
        const addLocation = await props.axiosJWT.post(
          `http://localhost:${props.port}/transport/add-transport`,
          submitData,
          {
            headers: { token: props.token },
          }
        );
        if (addLocation.data.statusCode == 200) {
          toastIdRef.current = toast({
            title: 'Hành trình xe đã được thêm.',
            description: 'Chúng tôi đã thêm hành trình xe cho bạn.',
            status: 'success',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
          props.handleGetListTransport(props.currentPage);
          props.onClose();
        }
      } catch (err) {
        if (err.response.data.statusCode == 401) {
          toastIdRef.current = toast({
            title: 'Phiên của bạn đã hết hạn.',
            description: 'Phiên đã hết hạn vui lòng đăng nhập lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        } else {
          toastIdRef.current = toast({
            title: err.response.data.data.message,
            description: 'Xảy ra lỗi khi thêm hành trình xe. Làm ơn hãy thử lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        }
      }
    }
    setBusPlate(0);
    setBusSchedule(0);
  }, [busPlate, busSchedule, error]);

  const handleGetListBusSchedule = useCallback(
    async (page, limit, value) => {
      page = typeof page == 'number' ? page - 1 : 1;
      limit = limit ? limit : 1000;
      const token = `Bearer ${state.dataUser.token}`;
      const offset = limit * (page - 1);
      try {
        const getListBusSchedule = await props.axiosJWT.post(
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
      } catch (err) {
        if (err.response.data.statusCode == 401) {
          toastIdRef.current = toast({
            title: 'Phiên của bạn đã hết hạn.',
            description: 'Phiên đã hết hạn vui lòng đăng nhập lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        } else {
          toastIdRef.current = toast({
            title: err.response.data.data.message,
            description: 'Không thể lấy danh sách lịch trình. Làm ơn hãy thử lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        }
      }
    },
    [state]
  );
  const handleGetListBus = useCallback(
    async (page, limit, value) => {
      const token = `Bearer ${state.dataUser.token}`;
      limit = limit ? limit : 1000;
      page = typeof page == 'number' ? page - 1 : 1;
      const offset = limit * (page - 1);
      try {
        const getListBus = await props.axiosJWT.post(
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
      } catch (err) {
        console.log(err);
        toastIdRef.current = toast({
          title: 'Phiên của bạn đã hết hạn',
          description: 'Phiên đã hết hạn vui lòng đăng nhập lại',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    },
    [state]
  );

  useEffect(() => {
    if (props.transportId) {
      setBusPlate(props.transport.bus_id);
      setBusSchedule(props.transport.bus_schedule_id);
      setError({
        busPlate: false,
        busSchedule: false,
      });
    } else {
      setBusPlate(0);
      setBusSchedule(0);
    }
  }, [props.transportId]);

  useEffect(() => {
    if (props.isOpen) {
      handleGetListBus();
      handleGetListBusSchedule();
    }
  }, [props.isOpen]);

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size="lg">
        <ModalOverlay />
        <ModalContent p={3}>
          <ModalHeader>
            <Text fontSize={'3xl'} textAlign="center">
              {!props.transportId ? 'Tạo Hành Trình Xe' : 'Chỉnh Sửa Hành Trình Xe'}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={error.busSchedule} isRequired marginBottom={'5%'}>
              <Flex>
                <FormLabel width={'51.5%'} fontWeight={'500'}>
                  Lịch trình xe
                </FormLabel>
                <Select
                  placeholder="Chọn lịch trình xe"
                  value={busSchedule}
                  onChange={handleChangeBusSchedule}
                >
                  {listBusSchedule.map((bs) => {
                    return (
                      <option value={bs?.id}>
                        {bs?.route[0].city_from} - {bs?.route[0].city_to} |{' '}
                        {convertTime(bs.time_from, 0)} - {convertTime(bs.time_from, bs.travel_time)}
                      </option>
                    );
                  })}
                </Select>
              </Flex>
              <FormErrorMessage justifyContent={'flex-end'}>
                Lịch trình xe là bắt buộc
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={error.busPlate} isRequired marginBottom={'5%'}>
              <Box display={'flex'}>
                <FormLabel width={'50%'} fontWeight={'500'}>
                  Biển số xe
                </FormLabel>
                <Select
                  placeholder="Chọn biển số xe"
                  value={busPlate}
                  onChange={handleChangeBusPlate}
                >
                  {listBus.map((bus) => {
                    return <option value={bus?.id}>{bus?.vehicle_plate}</option>;
                  })}
                </Select>
              </Box>
              <FormErrorMessage justifyContent={'flex-end'}>
                Biển số xe là bắt buộc
              </FormErrorMessage>
            </FormControl>
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
            <Button backgroundColor="#F26A4C" color="#fff" onClick={handleAddTransport}>
              {!props.transportId ? 'Tạo' : 'Chỉnh Sửa'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
