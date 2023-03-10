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

export default function AddCar(props) {
  const [listCity, setListCity] = useState([]);

  const [officeName, setOfficeName] = useState('');
  const [city, setCity] = useState();
  const [location, setLocation] = useState();

  const handleChangeOfficeName = (e) => {
    setOfficeName(e.target.value);
  };
  const handleChangeCity = (e) => {
    setCity(e.target.value);
  };
  const handleChangeLocation = (e) => {
    setLocation(e.target.value);
  };

  const handleAddVehicle = useCallback(async () => {
    const submitData = {
      office_name: officeName,
      city_id: city,
      office_address: location,
    };
    if (props.officeId) {
      submitData.id = props.officeId;
      const updateOffice = await axios.put(
        `http://localhost:${props.port}/office/update-office`,
        submitData,
        {
          headers: { token: props.token },
        }
      );
      if (updateOffice.data.statusCode == 200) {
        props.handleGetListOffice();
        props.onClose();
      }
    } else {
      const addOffice = await axios.post(
        `http://localhost:${props.port}/office/add-office`,
        submitData,
        {
          headers: { token: props.token },
        }
      );
      if (addOffice.data.statusCode == 200) {
        props.handleGetListOffice();
        props.onClose();
      }
    }
  }, [location, city, officeName]);

  const handleGetListCity = async () => {
    const getListCity = await axios.get(`http://localhost:${props.port}/city/list-city`, {
      headers: { token: props.token },
    });
    if (getListCity.data.statusCode == 200) {
      setListCity(getListCity.data.data?.listCity);
    }
  };

  useEffect(() => {
    if (props.officeId) {
      setOfficeName(props.office.office_name);
      setCity(props.office.city.id);
      setLocation(props.office.office_address);
    } else {
      setOfficeName();
      setCity();
      setLocation();
    }
  }, [props.officeId]);

  useEffect(() => {
    if (props.isOpen) {
      handleGetListCity();
    }
  }, [props.isOpen]);
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize={'3xl'} textAlign="center">
              {!props.vehicleId ? 'Tạo văn phòng' : 'Chỉnh sửa thông tin văn phòng'}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex marginBottom={'5%'}>
              <Text width={'51.5%'} fontWeight={'500'}>
                Tên văn phòng
              </Text>
              <Input value={officeName} onChange={handleChangeOfficeName} />
            </Flex>
            <Flex marginBottom={'5%'}>
              <Text width={'50%'} fontWeight={'500'}>
                Tỉnh/Thành phố
              </Text>
              <Select placeholder="Select option" value={city} onChange={handleChangeCity}>
                {listCity.map((city) => {
                  return <option value={city?.id}>{city?.city_name}</option>;
                })}
              </Select>
            </Flex>
            <Flex marginBottom={'5%'}>
              <Text width={'51.5%'} fontWeight={'500'}>
                Địa chỉ
              </Text>
              <Textarea value={location} onChange={handleChangeLocation} />
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
              {!props.vehicleId ? 'Tạo văn phòng' : 'Chỉnh sửa thông tin văn phòng'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
