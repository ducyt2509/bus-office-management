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
  Select,
  Text,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';

export default function AddRoute(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [listCity, setListCity] = useState([]);

  const [cityFrom, setCityFrom] = useState('');
  const [cityTo, setCityTo] = useState('');
  const [error, setError] = useState({
    cityFrom: false,
    cityTo: false,
  });

  const handleChangeCityFrom = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value) {
        oldError.cityFrom = true;
      } else {
        oldError.cityFrom = false;
      }
      setError(oldError);
      setCityFrom(value);
    },
    [error]
  );

  const handleChangeCityTo = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value) {
        oldError.cityTo = true;
      } else {
        oldError.cityTo = false;
      }
      setError(oldError);
      setCityTo(value);
    },
    [error]
  );

  const handleAddRoute = useCallback(async () => {
    let oldError = { ...error };
    if (!cityFrom) {
      oldError.cityFrom = true;
    }
    if (!cityTo) {
      oldError.cityTo = true;
    }

    if (oldError.cityFrom || oldError.cityTo) {
      setError(oldError);
      return;
    }
    const submitData = {
      city_from_id: cityFrom,
      city_to_id: cityTo,
    };
    if (props.routeId) {
      submitData.id = props.routeId;
      const updateRoute = await axios.put(
        `http://localhost:${props.port}/route/update-route`,
        submitData,
        {
          headers: { token: props.token },
        }
      );
      if (updateRoute.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Thông tin tuyến đường đã được cập nhật.',
          description: 'Chúng tôi đã cập nhật thông tin tuyến đường cho bạn.',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        props.handleGetListRoute();
        props.onClose();
      } else {
        toastIdRef.current = toast({
          title: 'Thông tin tuyến đường không thể cập nhật.',
          description: 'Xảy ra lỗi khi cập nhật thông tin tuyến đường. Làm ơn hãy thử lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    } else {
      const addRoute = await axios.post(
        `http://localhost:${props.port}/route/add-route`,
        submitData,
        {
          headers: { token: props.token },
        }
      );
      if (addRoute.data.statusCode == 200) {
        toastIdRef.current = toast({
          title: 'Thông tin tuyến đường đã được thêm.',
          description: 'Chúng tôi đã thêm thông tin tuyến đường cho bạn.',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        props.handleGetListRoute();
        props.onClose();
      } else {
        toastIdRef.current = toast({
          title: 'Không thể thêm mới thông tin tuyến đường.',
          description: 'Xảy ra lỗi khi thêm thông tin tuyến đường. Làm ơn hãy thử lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
    }
  }, [cityFrom, cityTo, error]);

  const handleGetListCity = async () => {
    const getListCity = await axios.get(`http://localhost:${props.port}/city/list-city`, {
      headers: { token: props.token },
    });
    if (getListCity.data.statusCode == 200) {
      setListCity(getListCity.data.data?.listCity);
    }
  };

  useEffect(() => {
    if (props.routeId) {
      setCityFrom(props.route.city_from_id);
      setCityTo(props.route.city_to_id);
      setError({
        cityFrom: false,
        cityTo: false,
      });
    } else {
      setCityFrom(0);
      setCityTo(0);
    }
  }, [props.routeId]);

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
              {!props.routeId ? 'Tạo tuyến mới' : 'Chỉnh sửa thông tin tuyến đường'}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl marginBottom={'5%'} isRequired isInvalid={error.cityFrom}>
              <Flex>
                <FormLabel width={'50%'} fontWeight={'500'} marginBottom="0">
                  Tỉnh/Thành phố đi :
                </FormLabel>
                <Select
                  placeholder="Select option"
                  value={cityFrom}
                  onChange={handleChangeCityFrom}
                >
                  {listCity.map((city) => {
                    return (
                      <option value={city?.id} disabled={cityTo == city?.id ? true : false}>
                        {city?.city_name}
                      </option>
                    );
                  })}
                </Select>
              </Flex>
              <FormErrorMessage justifyContent={'flex-end'}>
                Tỉnh/Thành phố đi là bắt buộc
              </FormErrorMessage>
            </FormControl>

            <FormControl marginBottom={'5%'} isRequired isInvalid={error.cityTo}>
              <Flex>
                <FormLabel width={'50%'} fontWeight={'500'} marginBottom="0">
                  Tỉnh/Thành phố đến :
                </FormLabel>
                <Select placeholder="Select option" value={cityTo} onChange={handleChangeCityTo}>
                  {listCity.map((city) => {
                    return (
                      <option value={city?.id} disabled={cityFrom == city?.id ? true : false}>
                        {city?.city_name}
                      </option>
                    );
                  })}
                </Select>
              </Flex>
              <FormErrorMessage justifyContent={'flex-end'}>
                Tỉnh/Thành phố đến là bắt buộc
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
            <Button backgroundColor="#686868" color="#fff" onClick={handleAddRoute}>
              {!props.routeId ? 'Tạo tuyến mới' : 'Chỉnh sửa'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
