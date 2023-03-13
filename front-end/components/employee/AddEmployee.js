import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Input,
  Select,
  Text,
  Switch,
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export default function AddEmployee(props) {
  const [listRole, setListRole] = useState([]);
  const [listOffice, setListOffice] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePhone, setEmployeePhone] = useState();
  const [employeeRole, setEmployeeRole] = useState();
  const [employeeOffice, setEmployeeOffice] = useState();
  const [employeePassword, setEmployeePassword] = useState();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleChangeEmployeeName = (e) => {
    setEmployeeName(e.target.value);
  };
  const handleChangeEmployeeEmail = (e) => {
    setEmployeeEmail(e.target.value);
  };
  const handleChangeEmployeePhone = (e) => {
    setEmployeePhone(e.target.value);
  };
  const handleChangeEmployeePassword = (e) => {
    setEmployeePassword(e.target.value);
  };
  const handleChangeEmployeeRole = (e) => {
    setEmployeeRole(e.target.value);
  };
  const handleChangeEmployeeOffice = (e) => {
    setEmployeeOffice(e.target.value);
  };

  const handleAddEmployee = useCallback(async () => {
    let phone = employeePhone;
    if (employeePhone && employeePhone[0] == 0) {
      phone = '+841' + employeePhone.substring(1);
    }
    const submitData = {
      user_name: employeeName,
      email: employeeEmail,
      phone: phone,
      password: employeePassword,
      role_id: employeeRole,
      office_id: employeeOffice,
    };
    if (employeePassword && employeePassword.lenth > 7) {
      submitData.password = employeePassword;
    }
    if (props.userId) {
      submitData.id = props.userId;
      const updateEmployee = await axios.put(
        `http://localhost:${props.port}/user/update-user`,
        submitData,
        {
          headers: { token: props.token },
        }
      );
      if (updateEmployee.data.statusCode == 200) {
        props.handleGetListUser();
        props.onClose();
      }
    } else {
      const addEmployee = await axios.post(
        `http://localhost:${props.port}/user/add-user`,
        submitData,
        {
          headers: { token: props.token },
        }
      );
      if (addEmployee.data.statusCode == 200) {
        props.handleGetListUser();
        props.onClose();
      }
    }
  }, [employeeEmail, employeePhone, employeePassword, employeeRole, employeeOffice, employeeName]);

  const handleGetListOffice = async () => {
    const getListOffice = await axios.post(`http://localhost:${props.port}/office/list-office`, {
      headers: { token: props.token },
    });
    if (getListOffice.data.statusCode == 200) {
      setListOffice(getListOffice.data.data.list_office);
    }
  };
  const handleGetListRole = async () => {
    const getListRole = await axios.get(`http://localhost:${props.port}/role/list-role`);
    if (getListRole.data.statusCode == 200) {
      setListRole(getListRole.data.data.list_role);
    }
  };

  useEffect(() => {
    if (props.userId) {
      setEmployeeName(props.user.user_name);
      setEmployeeEmail(props.user.email);
      setEmployeePhone(props.user.phone);
      setEmployeePassword();
      setEmployeeOffice(props.user.office_id);
      setEmployeeRole(props.user.role_id);
    } else {
      setEmployeeName('');
      setEmployeeEmail('');
      setEmployeePhone('');
      setEmployeePassword('');
      setEmployeeOffice(0);
      setEmployeeRole(0);
    }
  }, [props.userId]);

  useEffect(() => {
    if (props.isOpen) {
      Promise.all([handleGetListOffice(), handleGetListRole()]);
    }
  }, [props.isOpen]);
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize={'3xl'} textAlign="center">
              {!props.userId ? 'Thêm nhân viên' : 'Chỉnh sửa thông tin nhân viên'}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex marginBottom={'5%'}>
              <Text width={'51.5%'} fontWeight={'500'}>
                Tên nhân viên
              </Text>
              <Input value={employeeName} onChange={handleChangeEmployeeName} />
            </Flex>
            <Flex marginBottom={'5%'}>
              <Text width={'51.5%'} fontWeight={'500'}>
                Email
              </Text>
              <Input value={employeeEmail} onChange={handleChangeEmployeeEmail} />
            </Flex>
            <Flex marginBottom={'5%'}>
              <Text width={'51.5%'} fontWeight={'500'}>
                Phone
              </Text>
              <Input value={employeePhone} onChange={handleChangeEmployeePhone} />
            </Flex>
            <Flex marginBottom={'5%'}>
              <Text width={'51.5%'} fontWeight={'500'}>
                Mật khẩu
              </Text>
              <Input
                value={employeePassword}
                onChange={handleChangeEmployeePassword}
                type={showPassword ? 'text' : 'password'}
              />
            </Flex>
            <Flex marginBottom={'5%'}>
              <Text width={'50%'} fontWeight={'500'}>
                Chức vụ
              </Text>
              <Select
                placeholder="Select option"
                value={employeeRole}
                onChange={handleChangeEmployeeRole}
              >
                {listRole.map((role) => {
                  return <option value={role?.id}>{role?.role_name}</option>;
                })}
              </Select>
            </Flex>
            <Flex marginBottom={'5%'}>
              <Text width={'50%'} fontWeight={'500'}>
                Văn phòng
              </Text>
              <Select
                placeholder="Select option"
                value={employeeOffice}
                onChange={handleChangeEmployeeOffice}
              >
                {listOffice.map((office) => {
                  return <option value={office?.id}>{office?.office_name}</option>;
                })}
              </Select>
            </Flex>
          </ModalBody>

          <ModalFooter justifyContent={'space-around'}>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={props.onClose}
              backgroundColor="#fff"
              color="#686868"
              border={'1px solid #686868'}
            >
              Huỷ
            </Button>
            <Button backgroundColor="#686868" color="#fff" onClick={handleAddEmployee}>
              {!props.userId ? 'Thêm nhân viên' : 'Chỉnh sửa'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
