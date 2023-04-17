import { useCallback, useEffect, useState } from 'react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';
import ListLocationOnBusSchedule from '@/components/bus-schedule/ListLocationOnBusSchedule';
import AddLocation from '../location/AddLocation';
import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Text,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';

export default function ListLocationBusSchedule(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [location, setLocation] = useState();
  const [address, setAddress] = useState();
  const [time, setTime] = useState();
  const [error, setError] = useState({ location: false, time: false });

  const handleChangeTime = useCallback((e) => {
    let value = e.target.value;
    let oldError = { ...error };
    if (!value) {
      oldError.time = true;
    } else {
      oldError.time = false;
    }
    setError(oldError);
    setTime(value);
  });
  const html =
    props.listLocation && props.listLocation.length
      ? props.listLocation.map((element, index) => {
          return (
            <div className="bom-location-bus-schedule">
              {element} <CloseIcon onClick={() => deleteLocationBusSchedule(index)} />
            </div>
          );
        })
      : null;
  const deleteLocationBusSchedule = useCallback(
    (index) => {
      const oldListLocation = [...props.listLocation];
      oldListLocation.splice(index, 1);
      props.setListLocation(oldListLocation);

      const oldListAddress = [...props.listAddress];
      oldListAddress.splice(index, 1);
      props.setListAddress(oldListAddress);
    },
    [props.listLocation]
  );
  const handleDisplayAddLocation = () => {
    const selector = document.querySelector(
      `.bom-add-location-pickup.bom-add-location-pickup${props.id}`
    );
    if (selector) {
      selector.classList.toggle('active');
    }
  };

  const addNewLocationBusSchedule = useCallback(() => {
    let oldError = { ...error };
    if (!location) {
      oldError.location = true;
    }
    if (!time) {
      oldError.time = true;
    }
    if (oldError.location || oldError.time) {
      setError(oldError);
      return;
    }
    let oldList = [...props.listLocation];
    let newLocation = location + ': ' + time;
    oldList.push(newLocation);
    props.setListLocation(oldList);

    let oldListAddress = [...props.listAddress];
    let newAddress = address;
    oldListAddress.push(newAddress);
    props.setListAddress(oldListAddress);

    handleDisplayAddLocation();
  }, [props.listLocation, location, time, address, error]);

  useEffect(() => {
    let filterList = [];
    if (props.list && props.list.length && props.id == 5) {
      filterList = props.list.filter((element) => {
        return element.bus_location_type == 0;
      });
    } else if (props.list && props.list.length && props.id == 6) {
      filterList = props.list.filter((element) => {
        return element.bus_location_type == 1;
      });
    }
    if (filterList[0]?.bus_detail && typeof filterList[0]?.bus_detail == 'string') {
      props.setListLocation(JSON.parse(filterList[0]?.bus_detail));
    }
    if (
      filterList[0]?.bus_location_address &&
      typeof filterList[0]?.bus_location_address == 'string'
    ) {
      props.setListAddress(JSON.parse(filterList[0]?.bus_location_address));
    }
  }, [props.list, props.data]);
  return (
    <div>
      <div
        className="bom-location-bus-schedule add-location-bus-schedule"
        onClick={handleDisplayAddLocation}
      >
        Thêm địa điểm
      </div>
      <div className={`bom-add-location-pickup bom-add-location-pickup${props.id}`}>
        <div>
          <FormControl isInvalid={error.location}>
            <ListLocationOnBusSchedule
              state={props.state}
              BACK_END_PORT={props.BACK_END_PORT}
              location={location}
              setLocation={setLocation}
              address={address}
			  route={props.route}
              setAddress={setAddress}
              id={props.id}
              type={'pickup/drop'}
              error={error}
              setError={setError}
            />
          </FormControl>
          <FormControl isInvalid={error.time} w="97%" margin={'0 3%'}>
            <Input type={'time'} value={time} onChange={handleChangeTime} border={'1px solid '} />
            <FormErrorMessage fontSize={'12px'}>
              {!time ? 'Thời gian là bắt buộc' : ''}
            </FormErrorMessage>
          </FormControl>
          <Button colorScheme="linkedin" onClick={addNewLocationBusSchedule}>
            Thêm
          </Button>
        </div>
        <Flex justifyContent={'space-between'} marginTop={'2%'}>
          <Text
            color={'red'}
            cursor={'pointer'}
            fontSize={'12px'}
            textDecoration={'underline'}
            onClick={onOpen}
          >
            Chưa có địa điểm bạn muốn? Thêm mới ngay bây giờ
          </Text>
          <Text
            color={'blue'}
            cursor={'pointer'}
            fontSize={'12px'}
            textDecoration={'underline'}
            onClick={handleDisplayAddLocation}
          >
            Đóng
          </Text>
        </Flex>
        <AddLocation
          isOpen={isOpen}
          onClose={onClose}
          port={props.BACK_END_PORT}
          token={`Bearer ${props.state.dataUser.token}`}
          handleGetListLocation={() => {}}
          currentPage={1}
        />
      </div>
      {html}
    </div>
  );
}
