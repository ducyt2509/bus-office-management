import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
export default function TestPage(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const submitForm = useCallback(() => {
    const data = {
      email: email,
      password: password,
    };
    axios
      .post(`http://localhost:${props.BACK_END_PORT}/register`, data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [email, password]);
  return <div></div>;
}
export async function getStaticProps() {
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
    },
  };
}
