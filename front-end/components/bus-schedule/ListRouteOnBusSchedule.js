import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';

export default function ListRouteOnBusSchedule(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [listRoute, setListRoute] = useState([]);
  const [routeName, setRouteName] = useState();
  const [querySearch, setQuerySearch] = useState('');

  const handleGetListRoute = useCallback(
    async (page, limit, value) => {
      limit = limit ? limit : 7;
      page = typeof page == 'number' ? page - 1 : 1;
      const offset = limit * (page - 1);
      const token = `Bearer ${props.state.dataUser.token}`;
      try {
        const getListRoute = await props.axiosJWT.post(
          `http://localhost:${props.BACK_END_PORT}/route/list-route`,
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
        if (getListRoute.data.statusCode === 200) {
          setListRoute(getListRoute.data.data.list_route);
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
      handleGetListRoute(null, null, '');
    } else {
      handleGetListRoute(null, null, value);
    }
  });
  const handleSelectRoute = (id, value) => {
    let oldError = { ...props.error };
    if (!value) {
      oldError.route = true;
    } else {
      oldError.route = false;
    }
    props.setError(oldError);
    if (props.route != id) {
      props.setLocationPickup([]);
      props.setAddressPickup([]);
      props.setLocationDropOff([]);
      props.setAddressDropOff([]);
      props.setDepartureLocationId(0);
      props.setArriveLocationId(0);
    }
    setRouteName(value);
    props.setRoute(id);
    handleOpenSelect();
  };
  const ListRouteHTML = listRoute.map((route) => {
    return (
      <li
        onClick={() =>
          handleSelectRoute(route.id, `${route.city_from.city_name} - ${route.city_to.city_name}`)
        }
      >
        {route.city_from.city_name} - {route.city_to.city_name}
      </li>
    );
  });

  const handleOpenSelect = () => {
    const wrapper = document.querySelector('.bom-bus-schedule-detail .wrapper.wrapper1');
    wrapper.classList.toggle('active');
  };

  useEffect(() => {
    if (props.state.dataUser.token) {
      handleGetListRoute();
    }
  }, [props.state]);

  useEffect(() => {
    const filterRoute = listRoute.filter((route) => {
      return route.id == props.route;
    });
    let name = `${filterRoute[0]?.city_from?.city_name} - ${filterRoute[0]?.city_to?.city_name}`;
    if (name.indexOf('undefined') != -1) {
      setRouteName('Chọn tuyến đường');
    } else {
      setRouteName(name);
    }
  }, [props.route, listRoute]);

  return (
    <div className="wrapper wrapper1">
      <div
        className="select-btn"
        onClick={handleOpenSelect}
        style={props.error?.route ? { borderColor: '#E53E3E', boxShadow: '0 0 0 1px #E53E3E' } : {}}
      >
        <p>{routeName ? routeName : 'Chọn tuyến đường'}</p>
        <IoIosArrowDown />
      </div>
      <div className="content">
        <div className="search">
          <AiOutlineSearch />
          <input onChange={handleChangeQuerySearch} value={querySearch} />
        </div>
        <ul className="options">{ListRouteHTML}</ul>
      </div>
    </div>
  );
}
