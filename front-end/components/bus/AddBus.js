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
  Switch,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';

export default function AddCar(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [listDriver, setListDriver] = useState([]);
  const [listVehicle, setListVehicle] = useState([]);

  const [vehiclePlate, setVehiclePlate] = useState('');
  const [mainDriver, setMainDriver] = useState();
  const [supportDriver, setSupportDriver] = useState();
  const [vehicleType, setVehicleType] = useState();
  const [vehicleStatus, setVehicleStatus] = useState();

  const [error, setError] = useState({
    vehiclePlate: false,
    mainDriver: false,
    vehicleType: false,
  });

  const handleChangeVehiclePlate = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value) {
        oldError.vehiclePlate = true;
      } else {
        oldError.vehiclePlate = false;
      }
      setError(oldError);
      setVehiclePlate(value);
    },
    [error]
  );
  const handleChangeMainDriver = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value) {
        oldError.mainDriver = true;
      } else {
        oldError.mainDriver = false;
      }
      setError(oldError);
      setMainDriver(value);
    },
    [error]
  );
  const handleChangeVehicleType = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value) {
        oldError.vehicleType = true;
      } else {
        oldError.vehicleType = false;
      }
      setError(oldError);
      setVehicleType(value);
    },
    [error]
  );
  const handleChangeSupportDriver = (e) => {
    setSupportDriver(e.target.value);
  };
  const handleChangeVehicleStatus = useCallback(
    (e) => {
      setVehicleStatus(!vehicleStatus);
    },
    [vehicleStatus]
  );
  const handleAddVehicle = useCallback(async () => {
    let oldError = { ...error };
    if (!vehiclePlate) {
      oldError.vehiclePlate = true;
    }
    if (!mainDriver) {
      oldError.mainDriver = true;
    }
    if (!vehicleType) {
      oldError.vehicleType = true;
    }
    if (oldError.vehiclePlate || oldError.mainDriver || oldError.vehicleType) {
      setError(oldError);
      return;
    }
    const submitData = {
      vehicle_plate: vehiclePlate,
      main_driver_id: mainDriver,
      support_driver_id: supportDriver ? supportDriver : null,
      vehicle_type_id: vehicleType,
      vehicle_status: 1,
    };
    if (props.vehicleId) {
      submitData.id = props.vehicleId;
      submitData.vehicle_status = vehicleStatus;
      const updateVehicle = await axios.put(
        `http://localhost:${props.port}/bus/update-bus`,
        submitData,
        {
          headers: { token: props.token },
        }
      );
      if (updateVehicle.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Thông tin xe đã được cập nhật.',
          description: 'Chúng tôi đã cập nhật thông tin xe cho bạn.',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        props.handleGetListBus();
        props.onClose();
      } else {
        toastIdRef.current = toast({
          title: 'Thông tin xe không thể cập nhật.',
          description: 'Xảy ra lỗi khi cập nhật thông tin xe. Làm ơn hãy thử lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    } else {
      const addVehicle = await axios.post(
        `http://localhost:${props.port}/bus/add-bus`,
        submitData,
        {
          headers: { token: props.token },
        }
      );
      if (addVehicle.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Thông tin xe đã được thêm.',
          description: 'Chúng tôi đã thêm thông tin xe cho bạn.',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        props.handleGetListBus();
        props.onClose();
      } else {
        toastIdRef.current = toast({
          title: 'Không thể thêm mới Thông tin xe.',
          description: 'Xảy ra lỗi khi thêm thông tin xe. Làm ơn hãy thử lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    }
  }, [vehiclePlate, mainDriver, supportDriver, vehicleType, props.vehicleId, vehicleStatus, error]);

  const handleGetListUser = async () => {
    const getListUser = await axios.post(
      `http://localhost:${props.port}/user/list-user`,
      { role_id: 3 },
      { headers: { token: props.token } }
    );
    if (getListUser.data.statusCode == 200) {
      setListDriver(getListUser.data.data.list_user);
    }
  };
  const handleGetListVehicle = async () => {
    const getListVehicle = await axios.get(
      `http://localhost:${props.port}/vehicle-type/list-vehicle-type`
    );
    if (getListVehicle.data.statusCode == 200) {
      setListVehicle(getListVehicle.data.data);
    }
  };

  useEffect(() => {
    if (props.vehicleId) {
      setVehiclePlate(props.vehicle.vehicle_plate);
      setMainDriver(props.vehicle.main_driver_id);
      setSupportDriver(props.vehicle.support_driver_id);
      setVehicleType(props.vehicle.vehicle_id);
      setVehicleStatus(props.vehicle.vehicle_status);
      setError({
        vehiclePlate: false,
        mainDriver: false,
        vehicleType: false,
      });
    } else {
      setVehiclePlate('');
      setMainDriver(0);
      setSupportDriver(0);
      setVehicleType(0);
      setVehicleStatus(1);
    }
  }, [props.vehicleId]);

  useEffect(() => {
    if (props.isOpen) {
      Promise.all([handleGetListUser(), handleGetListVehicle()]);
    }
  }, [props.isOpen]);
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize={'3xl'} textAlign="center">
              {!props.vehicleId ? 'Tạo Xe' : 'Chỉnh sửa thông tin xe'}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {props.vehicleId != 0 && (
              <Flex marginBottom={'5%'} justifyContent="space-between">
                <Text width={'51.5%'} fontWeight={'500'}>
                  Trạng thái xe
                </Text>
                <Switch size="lg" isChecked={vehicleStatus} onChange={handleChangeVehicleStatus} />
              </Flex>
            )}
            <FormControl isRequired isInvalid={error.vehiclePlate} marginBottom={'5%'}>
              <Flex>
                <FormLabel width={'51.5%'} fontWeight={'500'}>
                  Biển số xe
                </FormLabel>
                <Input value={vehiclePlate} onChange={handleChangeVehiclePlate} />
              </Flex>
              <FormErrorMessage justifyContent={'flex-end'}>
                Biển số xe là bắt buộc
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={error.vehicleType} marginBottom={'5%'}>
              <Flex>
                <FormLabel width={'50%'} fontWeight={'500'}>
                  Loại xe
                </FormLabel>
                <Select
                  placeholder="Select option"
                  value={vehicleType}
                  onChange={handleChangeVehicleType}
                >
                  {listVehicle.map((vehicle) => {
                    return <option value={vehicle?.id}>{vehicle?.vehicle_type_name}</option>;
                  })}
                </Select>
              </Flex>
              <FormErrorMessage justifyContent={'flex-end'}>Loại xe là bắt buộc</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={error.mainDriver} marginBottom={'5%'}>
              <Flex>
                <FormLabel width={'50%'} fontWeight={'500'}>
                  Tài xế chính
                </FormLabel>
                <Select
                  placeholder="Select option"
                  value={mainDriver}
                  onChange={handleChangeMainDriver}
                >
                  {listDriver.map((driver) => {
                    return <option value={driver?.id}>{driver?.user_name}</option>;
                  })}
                </Select>
              </Flex>
              <FormErrorMessage justifyContent={'flex-end'}>
                Tài xế chính là bắt buộc
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <Flex marginBottom={'5%'}>
                <FormLabel width={'50%'} fontWeight={'500'}>
                  Tài xế phụ
                </FormLabel>
                <Select
                  placeholder="Select option"
                  value={supportDriver}
                  onChange={handleChangeSupportDriver}
                >
                  {listDriver.map((driver) => {
                    return <option value={driver?.id}>{driver?.user_name}</option>;
                  })}
                </Select>
              </Flex>
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
            <Button backgroundColor="#686868" color="#fff" onClick={handleAddVehicle}>
              {!props.vehicleId ? 'Tạo Xe' : 'Chỉnh sửa thông tin xe'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
