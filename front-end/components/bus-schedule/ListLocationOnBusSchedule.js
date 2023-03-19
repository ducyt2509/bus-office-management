import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

export default function ListLocationOnBusSchedule(props) {
  const [listLocation, setListLocation] = useState([]);
  const [locationName, setLocationName] = useState();
  const [querySearch, setQuerySearch] = useState('');

  const handleGetListLocation = useCallback(
    async (page, limit, value) => {
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page - 1 : 0;
      const offset = limit * page;
      const token = `Bearer ${props.state.dataUser.token}`;
      const getListLocation = await axios.post(
        `http://localhost:${props.BACK_END_PORT}/location/list-location`,
        {
          offset: offset,
          limit: limit,
          query_search: value != undefined ? value : querySearch,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      if (getListLocation.data.statusCode === 200) {
        setListLocation(getListLocation.data.data.listLocation);
      }
    },
    [props.state, querySearch]
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
  const handleSelectLocation = (id, value) => {
    setLocationName(value);
    props.setLocation(props.type == 'pickup/drop' ? value : id);
    handleOpenSelect();
  };
  const ListLocationHTML = listLocation.map((location) => {
    return (
      <li onClick={() => handleSelectLocation(location.id, location.location_name)}>
        {location.location_name}
      </li>
    );
  });
  const handleOpenSelect = () => {
    const wrapper = document.querySelector(`.bom-bus-schedule-detail .wrapper.wrapper${props.id}`);
    wrapper.classList.toggle('active');
  };
  useEffect(() => {
    handleGetListLocation();
  }, []);
  useEffect(() => {
    if (props.data && props.data.length) {
      setLocationName(props.id == 3 ? props.data[0]?.location_start : props.data[0]?.location_finish)
    }
  }, [props.data]);
  return (
    <div className={`wrapper wrapper${props.id}`}>
      <div className="select-btn" onClick={handleOpenSelect}>
        <p>{locationName ? locationName : 'Chọn địa điểm'}</p>
        <IoIosArrowDown />
      </div>
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
