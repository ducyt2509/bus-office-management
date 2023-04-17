import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FormErrorMessage } from '@chakra-ui/react';

export default function ListLocationOnBusSchedule(props) {
  const [listLocation, setListLocation] = useState([]);
  const [locationName, setLocationName] = useState();
  const [querySearch, setQuerySearch] = useState('');

  const handleGetListLocation = useCallback(
    async (page, limit, value) => {
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page - 1 : 1;
      const offset = limit * (page - 1);
      const token = `Bearer ${props.state.dataUser.token}`;
      const route = await axios.post(
        `http://localhost:${props.BACK_END_PORT}/route/route-by-id`,
        {
          id: props.route,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      const getListLocation = await axios.post(
        `http://localhost:${props.BACK_END_PORT}/location/list-location`,
        {
          offset: offset,
          limit: limit,
          route: route.data?.data?.route,
          query_search: value != undefined ? value : querySearch,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      if (getListLocation.data.statusCode === 200) {
        setListLocation(
          getListLocation.data.data.listLocation.filter((location) => location.city_id)
        );
      }
    },
    [props.state, querySearch, props.route]
  );
  const handleChangeQuerySearch = useCallback((e) => {
    const value = e.target.value;
    setQuerySearch(value);
    if (!value) {
      handleGetListLocation(null, null, '');
    } else {
      handleGetListLocation(null, null, value);
    }
  });
  const handleSelectLocation = useCallback(
    (id, value, address) => {
      let oldError = { ...props.error };
      if (!value) {
        if (props.id == 3) {
          oldError.departureLocationId = true;
        } else if (props.id == 4) {
          oldError.arriveLocationId = true;
        } else if (props.id == 5) {
          oldError.location = true;
        } else if (props.id == 6) {
          oldError.location = true;
        }
      } else {
        if (props.id == 3) {
          oldError.departureLocationId = false;
        } else if (props.id == 4) {
          oldError.arriveLocationId = false;
        } else if (props.id == 5) {
          oldError.location = false;
        } else if (props.id == 6) {
          oldError.location = false;
        }
      }
      if (props.id == 3 || props.id == 4 || props.id == 5 || props.id == 6) {
        props.setError(oldError);
      }
      setLocationName(value);
      props.setLocation(props.type == 'pickup/drop' ? value : id);
      if (props.type == 'pickup/drop') {
        props.setAddress(address);
      }
      handleOpenSelect();
    },
    [props.id, props.error]
  );
  console.log(props.id, listLocation);
  const ListLocationHTML = listLocation.map((location) => {
    return (
      <li
        onClick={() => handleSelectLocation(location.id, location.location_name, location.address)}
      >
        {location.location_name}
      </li>
    );
  });
  const handleOpenSelect = () => {
    const wrapper = document.querySelector(`.bom-bus-schedule-detail .wrapper.wrapper${props.id}`);
    wrapper.classList.toggle('active');
  };
  useEffect(() => {
    if (props.route) {
      handleGetListLocation();
    }
  }, [props.route]);
  useEffect(() => {
    if (props.data && props.data.length) {
      setLocationName(
        props.id == 3 ? props.data[0]?.location_start : props.data[0]?.location_finish
      );
    }
    if (!props.location) {
      setLocationName('');
    }
  }, [props.data, props.data, props.location]);
  return (
    <div className={`wrapper wrapper${props.id}`}>
      <div
        className="select-btn"
        onClick={handleOpenSelect}
        style={
          (props.id == 3 && props.error?.departureLocationId) ||
          (props.id == 4 && props.error?.arriveLocationId) ||
          (props.id == 5 && props.error?.location) ||
          (props.id == 6 && props.error?.location)
            ? { borderColor: '#E53E3E', boxShadow: '0 0 0 1px #E53E3E' }
            : {}
        }
      >
        <p>{locationName ? locationName : 'Chọn địa điểm'}</p>
        <IoIosArrowDown />
      </div>
      <FormErrorMessage>
        {props.id == 5 || props.id == 6 ? 'Địa điêm là bắt buộc' : ''}
      </FormErrorMessage>
      <div className="content">
        <div className="search">
          <AiOutlineSearch />
          <input onChange={handleChangeQuerySearch} value={querySearch} />
        </div>
        <ul className="options">{ListLocationHTML}</ul>
      </div>
    </div>
  );
}
