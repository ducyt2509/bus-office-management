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
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState();
  const [location, setLocation] = useState();

  const handleChangeLocationName = (e) => {
    setLocationName(e.target.value);
  };
  const handleChangeCity = (e) => {
    console.log("[CITY ID ]", e.target.value)
    setCity(e.target.value);
  };
  const handleChangeLocation = (e) => {
    setLocation(e.target.value);
  };

  const handleAddLocation = useCallback(async () => {
    console.log("Current page : ", props.currentPage,);
    const submitData = {
      location_name: locationName,
      city_id: city,
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
        props.handleGetListLocation(props.currentPage,);
        props.onClose();
      }
    } else {
      const addLocation = await axios.post(
        `http://localhost:${props.port}/location/add-location`,
        submitData,
        {
          headers: { token: props.token },
        }
      );
      if (addLocation.data.statusCode == 200) {
        props.handleGetListLocation(props.currentPage,);
        props.onClose();
      }
    }
    setLocationName('');
    setCity(0);

  }, [location, city, locationName]);

  const handleGetListCity = async () => {
    const getListCity = await axios.get(`http://localhost:${props.port}/city/list-city`, {
      headers: { token: props.token },
    });
    if (getListCity.data.statusCode == 200) {
      setListCity(getListCity.data.data?.listCity);
    }
  };

  useEffect(() => {
    if (props.locationId) {
      setLocationName(props.location.location_name);
      setCity(props.location.city_id);
    } else {
      setLocationName('');
      setCity(0);
    }
  }, [props.locationId]);

  useEffect(() => {
    if (props.isOpen) {
      handleGetListCity();
    }
  }, [props.isOpen]);
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size="lg" >
        <ModalOverlay />
        <ModalContent p={3}>
          <ModalHeader>
            <Text fontSize={'3xl'} textAlign="center">
              {!props.locationId ? 'Tạo Điểm Đón Trả' : 'Chỉnh Sửa Điểm Đón Trả'}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex marginBottom={'5%'}>
              <Text width={'51.5%'} fontWeight={'500'}>
                Tên văn phòng
              </Text>
              <Input value={locationName} onChange={handleChangeLocationName} />
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
            <Button backgroundColor="#686868" color="#fff" onClick={handleAddLocation}>
              {!props.locationId ? 'Tạo Điểm Đón Trả' : 'Chỉnh Sửa Điểm Đón Trả'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
