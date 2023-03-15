import { Select, Input, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useState } from 'react';

export default function HomeDestination(props) {
  const [startLocation, setStartLocation] = useState();
  const [endLocation, setEndLocation] = useState();
  const [departureDay, setDepartureDay] = useState();

  const handleChangeStartLocation = (e) => setStartLocation(e.target.value);
  const handleChangeEndLocation = (e) => setEndLocation(e.target.value);
  const handleChangeDepartureDay = (e) => setDepartureDay(e.target.value);
  const searchBusSchedule = useCallback(async () => {
    const listBusSchedule = await axios.get(
      `http://localhost:${props.port}/bus-schedule/list-bus-schedule`
    );
  }, [startLocation, endLocation, departureDay]);
  const cityOption =
    props.list_city &&
    props.list_city.map((city) => <option value={city.id}>{city.city_name}</option>);
  return (
    <div className="home-destination">
      <form action="">
        <div className="group-input">
          <label for="from">Điểm xuất phát</label>
          <Select
            placeholder="Select option"
            size="md"
            p={1}
            w="100%"
            onChange={handleChangeStartLocation}
            value={startLocation}
          >
            {cityOption}
          </Select>
        </div>
        <div className="group-input">
          <label for="to">Điểm đến</label>
          <Select
            placeholder="Select option"
            size="md"
            p={1}
            w="100%"
            onChange={handleChangeEndLocation}
            value={endLocation}
          >
            {cityOption}
          </Select>
        </div>
        <div className="group-input">
          <label for="date">Ngày đi</label>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="date"
            onChange={handleChangeDepartureDay}
            value={departureDay}
          />
        </div>
        <Button colorScheme="blue" onClick={searchBusSchedule}>
          Đặt Vé
        </Button>
      </form>
    </div>
  );
}
