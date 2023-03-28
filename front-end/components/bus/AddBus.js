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
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export default function AddCar(props) {
  const [listDriver, setListDriver] = useState([]);
  const [listVehicle, setListVehicle] = useState([]);

  const [vehiclePlate, setVehiclePlate] = useState('');
  const [mainDriver, setMainDriver] = useState();
  const [supportDriver, setSupportDriver] = useState();
  const [vehicleType, setVehicleType] = useState();
  const [vehicleStatus, setVehicleStatus] = useState();

  const handleChangeVehiclePlate = (e) => {
    setVehiclePlate(e.target.value);
  };
  const handleChangeMainDriver = (e) => {
    setMainDriver(e.target.value);
  };
  const handleChangeSupportDriver = (e) => {
    setSupportDriver(e.target.value);
  };
  const handleChangeVehicleType = (e) => {
    setVehicleType(e.target.value);
  };
  const handleChangeVehicleStatus = useCallback(
    (e) => {
      setVehicleStatus(!vehicleStatus);
    },
    [vehicleStatus]
  );
  const handleAddVehicle = useCallback(async () => {
    const submitData = {
      vehicle_plate: vehiclePlate,
      main_driver_id: mainDriver,
      support_driver_id: supportDriver,
      vehicle_id: vehicleType,
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
        props.handleGetListBus();
        props.onClose();
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
        props.handleGetListBus();
        props.onClose();
      }
    }
  }, [vehiclePlate, mainDriver, supportDriver, vehicleType, props.vehicleId, vehicleStatus]);

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
    const getListVehicle = await axios.get(`http://localhost:${props.port}/vehicle-type/list-vehicle-type`);
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
            <Flex marginBottom={'5%'}>
              <Text width={'51.5%'} fontWeight={'500'}>
                Biển số xe
              </Text>
              <Input value={vehiclePlate} onChange={handleChangeVehiclePlate} />
            </Flex>
            <Flex marginBottom={'5%'}>
              <Text width={'50%'} fontWeight={'500'}>
                Loại xe
              </Text>
              <Select
                placeholder="Select option"
                value={vehicleType}
                onChange={handleChangeVehicleType}
              >
                {listVehicle.map((vehicle) => {
                  return <option value={vehicle?.id}>{vehicle?.vehicle_name}</option>;
                })}
              </Select>
            </Flex>
            <Flex marginBottom={'5%'}>
              <Text width={'50%'} fontWeight={'500'}>
                Tài xế chính
              </Text>
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
            <Flex marginBottom={'5%'}>
              <Text width={'50%'} fontWeight={'500'}>
                Tài xế phụ
              </Text>
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
