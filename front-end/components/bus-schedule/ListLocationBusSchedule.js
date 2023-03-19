import { useCallback, useEffect, useState } from 'react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';
import ListLocationOnBusSchedule from '@/components/bus-schedule/ListLocationOnBusSchedule';
import AddLocation from '../location/AddLocation';
import {
  Input,
  InputGroup,
  InputRightAddon,
  Button,
  Text,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';

export default function ListLocationBusSchedule(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [location, setLocation] = useState();
  const [time, setTime] = useState();
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
  }, [props.list, props.data]);
  const html =
    props.listLocation &&
    props.listLocation.length ?
    props.listLocation.map((element, index) => {
      return (
        <div className="bom-location-bus-schedule">
          {element} <CloseIcon onClick={() => deleteLocationBusSchedule(index)} />
        </div>
      );
    }) : null;
  const deleteLocationBusSchedule = useCallback(
    (index) => {
      const oldList = [...props.listLocation];
      oldList.splice(index, 1);
      props.setListLocation(oldList);
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
    let oldList = [...props.listLocation];
    let newLocation = location + ': ' + time;
    oldList.push(newLocation);
    props.setListLocation(oldList);
    handleDisplayAddLocation();
  }, [props.listLocation, location, time]);
  return (
    <div>
      <div
        className="bom-location-bus-schedule add-location-bus-schedule"
        onClick={handleDisplayAddLocation}
      >
        Add location
      </div>
      <div className={`bom-add-location-pickup bom-add-location-pickup${props.id}`}>
        <div>
          <ListLocationOnBusSchedule
            state={props.state}
            BACK_END_PORT={props.BACK_END_PORT}
            location={location}
            setLocation={setLocation}
            id={props.id}
            type={'pickup/drop'}
          />
          <Input
            type={'time'}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            border={'1px solid '}
            margin={'0 3%'}
          />
          <Button colorScheme="linkedin" onClick={addNewLocationBusSchedule}>
            Add
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
            Location not yet ? Add more
          </Text>
          <Text
            color={'blue'}
            cursor={'pointer'}
            fontSize={'12px'}
            textDecoration={'underline'}
            onClick={handleDisplayAddLocation}
          >
            Close
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
