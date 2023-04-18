import Context from './Context';
import { useReducer } from 'react';
import reducer, { initState } from './reducer';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { actions } from '.';

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwtDecode(state.dataUser.token);
      if (decodedToken.exp < date.getTime() / 1000) {
        try {
          const getRefreshToken = await axios.post(
            'http://localhost:5000/refresh-token',
            {
              id: state.dataUser.id,
            },
            {
              withCredentials: true,
            }
          );
          if (getRefreshToken.data.statusCode == 200) {
            dispatch(
              actions.setDataUser({
                ...state.dataUser,
                token: getRefreshToken.data.data,
              })
            );
            config.headers['token'] = 'Bearer ' + getRefreshToken.data.data;
          }
        } catch (error) {
          console.log(error);
        }
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return <Context.Provider value={[state, dispatch, axiosJWT]}>{children}</Context.Provider>;
}
