import Context from './Context';
import { useReducer } from 'react';
import reducer, { initState } from './reducer';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { actions } from '.';
import Cookies from 'js-cookie';

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const dataUser = Cookies.get('dataUser');
      const cloneData = { ...JSON.parse(dataUser) };
      try {
        const decodedToken = jwtDecode(cloneData.token);
        if (decodedToken.exp < date.getTime() / 1000) {
          const getRefreshToken = await axios.post(
            'http://localhost:5000/refresh-token',
            {
              id: cloneData.id,
            },
            {
              withCredentials: true,
            }
          );
          if (getRefreshToken.data.statusCode == 200) {
            dispatch(
              actions.setDataUser({
                ...cloneData,
                token: getRefreshToken.data.data,
              })
            );
            Cookies.set(
              'dataUser',
              JSON.stringify({
                ...cloneData,
                token: getRefreshToken.data.data,
              })
            );
            config.headers['token'] = 'Bearer ' + getRefreshToken.data.data;
          }
        }
      } catch (error) {
        console.log(error);
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return <Context.Provider value={[state, dispatch, axiosJWT]}>{children}</Context.Provider>;
}
