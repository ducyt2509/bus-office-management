import { Input, Text, InputGroup, Button, InputRightElement, Checkbox } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { ViewIcon, ViewOffIcon, CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function HomePage(props) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [user, setUser] = useState('');
  const handleChangeUserValue = (event) => setUser(event.target.value);

  const [password, setPassword] = useState('');
  const handleChangePasswordValue = (event) => setPassword(event.target.value);

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleForgotPassword = useCallback(() => {
    console.log('Hi');
  });
  const handleShowLoginForm = useCallback(() => {
    if (!showLoginForm == true) {
      setShowLoginForm(!showLoginForm);
      setTimeout(() => {
        document.querySelector('.bom-login').style.opacity = 1;
      }, 200);
    } else {
      document.querySelector('.bom-login').style.opacity = 0;
      setTimeout(() => {
        setShowLoginForm(!showLoginForm);
      }, 100);
    }
  }, [showLoginForm]);

  const handleLogin = useCallback(async () => {
    if (user && password) {
      const submitData = {
        user,
        password,
      };
      const loginAccount = await axios.post(
        `http://localhost:${props.BACK_END_PORT}/login`,
        submitData
      );
      if (loginAccount.data.statusCode === 200) {
        console.log('login success');
      }
    }
  }, [user, password]);

  const NavBar = (
    <div className="bom-navbar">
      <div className="bom-navbar-bom-logo">
        <h1>BOM</h1>
      </div>
      <ul className="bom-navbar-component">
        <li>
          <div>Trang chủ</div>
        </li>
        <li>
          <div>Tra cứu vé</div>
        </li>
        <li>
          <div>Về chúng tôi</div>
        </li>
        <li>
          <div>Liên hệ</div>
        </li>
        <li>
          <div onClick={handleShowLoginForm}>Đăng nhập</div>
        </li>
      </ul>
    </div>
  );
  const LoginForm = (
    <>
      <div id="bom-login"></div>
      <div className="bom-login">
        <CloseIcon onClick={handleShowLoginForm} />
        <div className="bom-login-left">
          <div style={{ margin: '11% 10%' }}>
            <h1>Đăng nhập</h1>
            <div className="bom-login-form">
              <p>Số Điện Thoại/Email</p>
              <Input
                value={user}
                onChange={handleChangeUserValue}
                placeholder="Số Điện Thoại/Email"
                size="md"
              />
              <p>Mật khẩu</p>
              <InputGroup size="md">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handleChangePasswordValue}
                  placeholder="Mật khẩu"
                />
                <InputRightElement width="3.5rem" onClick={handleShowPassword}>
                  {!showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </InputRightElement>
              </InputGroup>
              <Button variant="solid" onClick={handleLogin}>
                Đăng nhập
              </Button>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5%' }}>
                <Checkbox defaultChecked>Nhớ Mật Khẩu</Checkbox>
                <Text fontSize="md" onClick={handleForgotPassword}>
                  Quên mật khẩu
                </Text>
              </div>
            </div>
          </div>
        </div>
        <div className="bom-login-right"></div>
      </div>
    </>
  );
  return (
    <>
      {NavBar}
      {showLoginForm && LoginForm}
    </>
  );
}
export async function getStaticProps() {
  return {
    props: {
      BACK_END_PORT: process.env.BACK_END_PORT,
    },
  };
}
