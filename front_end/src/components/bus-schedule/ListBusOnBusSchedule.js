import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useToast } from '@chakra-ui/react';

export default function ListBusOnBusSchedule(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [listBus, setListBus] = useState([]);
  const [busPlate, setBusPlate] = useState();
  const [querySearch, setQuerySearch] = useState('');

  const handleGetListBus = useCallback(
    async (page, limit, value) => {
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page - 1 : 0;
      const offset = limit * (page - 1);
      const token = `Bearer ${props.state.dataUser.token}`;
      try {
        const getListBus = await props.axiosJWT.post(
          `http://localhost:${props.BACK_END_PORT}/bus/list-bus`,
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
        if (getListBus.data.statusCode === 200) {
          setListBus(getListBus.data.data.list_bus);
        }
      } catch (err) {
        toastIdRef.current = toast({
          title: 'Phiên của bạn đã hết hạn',
          description: 'Phiên đã hết hạn vui lòng đăng nhập lại',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
        console.log(err);
      }
    },
    [props.state, querySearch]
  );
  const handleChangeQuerySearch = useCallback((e) => {
    const value = e.target.value;
    setQuerySearch(value);
    if (!value) {
      handleGetListBus(null, null, '');
    } else {
      handleGetListBus(null, null, value);
    }
  });
  const handleSelectBus = (id, value) => {
    setBusPlate(value);
    props.setBus(id);
    handleOpenSelect();
  };
  const ListBusHTML = listBus.map((bus) => {
    return <li onClick={() => handleSelectBus(bus.id, bus.vehicle_plate)}>{bus.vehicle_plate}</li>;
  });
  const handleOpenSelect = () => {
    const wrapper = document.querySelector('.bom-bus-schedule-detail .wrapper.wrapper2');
    wrapper.classList.toggle('active');
  };

  useEffect(() => {
    handleGetListBus();
  }, []);
  
  useEffect(() => {
    const filterList = listBus.filter((bus) => {
      return bus.id == props.bus;
    });
    setBusPlate(filterList[0]?.vehicle_plate);
  }, [listBus, props.bus]);
  
  return (
    <div className="wrapper wrapper2">
      <div className="select-btn" onClick={handleOpenSelect}>
        <p>{busPlate ? busPlate : 'Chọn xe'}</p>
        <IoIosArrowDown />
      </div>
      <div className="content">
        <div className="search">
          <AiOutlineSearch />
          <input onChange={handleChangeQuerySearch} value={querySearch} />
        </div>
        <ul className="options">{ListBusHTML}</ul>
      </div>
    </div>
  );
}
