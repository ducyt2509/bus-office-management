import axios from 'axios';
// import jwtDecode from 'jwt-decode';

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(async (config) => {
  let date = new Date();
  // const decodedToken = jwtDecode(localStorage.getItem('token'));
  const getRefreshToken = await axios.post(
    'http://localhost:5000/refresh-token',
    {},
    {
      withCredentials: true,
      credentials: 'include',
    }
  );
  // if (decodedToken.exp < date.getTime()/1000) {
  //   try {
  //     if (getRefreshToken.data.statusCode == 200) {
  //       console.log(getRefreshToken.data.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
});

const convertTime = (time, plus) => {
  const result = (time + plus) % 24;
  const string = result.toString().split('.');
  let hour = string[0];
  let minute = (parseFloat('0.' + string[1]).toFixed(2) * 60).toFixed(0);
  if (hour.length == 1) {
    hour = '0' + hour;
  }
  if (minute.length == 1) {
    minute = '0' + minute;
  }
  return hour + ':' + minute;
};
const convertInt = (time) => {
  const string = time.split(':');
  const hour = parseInt(string[0]);
  const minute = parseFloat(string[1]) / 60;
  return hour + minute;
};
const formatMoney = (value) => {
  if (!value) return '0đ';
  value =
    value
      .toString()
      .split('')
      .reverse()
      .map((e, i) => {
        if (i % 3 == 0 && i != value.length - 1 && i != 0) {
          e = e + '.';
        }
        return e;
      })
      .reverse()
      .join('') + 'đ';
  return value;
};

const calcDate = (time, n) => {
  var time = new Date(time);
  var newDate = new Date(time.getTime() + n * 24 * 60 * 60 * 1000);
  var d = new Date(newDate);
  var formatDate = `${d.getFullYear()}-${d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth()
    }-${d.getDate()}`;
  return formatDate;
};

const formatDate = (time) => {
  if (!time) return;
  return new Date(time).toISOString().split('T')[0];
};
const validate = {
  min_date: new Date().toISOString().split('T')[0],
  email: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
  email_and_phone:
    /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$|^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  password: /^(?=.*?[A-Z]).{8,}$/,
  float: /^-?\d*(\.\d+)?$/,
  number: /^\d+$/,
};
export { convertInt, convertTime, formatMoney, calcDate, formatDate, validate, axiosJWT };
