import { validate } from '@/helper';
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
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRef } from 'react';
import { useCallback, useEffect, useState } from 'react';

export default function AddEmployee(props) {
  const toast = useToast();
  const toastIdRef = useRef();
  const [listOffice, setListOffice] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePhone, setEmployeePhone] = useState();
  const [employeeRole, setEmployeeRole] = useState();
  const [employeeOffice, setEmployeeOffice] = useState();
  const [employeePassword, setEmployeePassword] = useState();

  const [error, setError] = useState({
    employeeName: false,
    employeePhone: false,
    employeeRole: false,
    employeePassword: false,
    employeeMail: false,
  });

  const handleChangeEmployeeName = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value) {
        oldError.employeeName = true;
      } else {
        oldError.employeeName = false;
      }
      setError(oldError);
      setEmployeeName(value);
    },
    [error]
  );
  const handleChangeEmployeeEmail = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (value) {
        if (!value.match(validate.email)) {
          oldError.employeeMail = true;
        } else {
          oldError.employeeMail = false;
        }
      } else {
        oldError.employeeMail = false;
      }
      setError(oldError);
      setEmployeeEmail(value);
    },
    [error]
  );
  const handleChangeEmployeePhone = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value || !value.match(validate.phone)) {
        oldError.employeePhone = true;
      } else {
        oldError.employeePhone = false;
      }
      setError(oldError);
      setEmployeePhone(value);
    },
    [error]
  );
  const handleChangeEmployeePassword = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (value && !value.match(validate.password)) {
        oldError.employeePassword = true;
      } else {
        oldError.employeePassword = false;
      }
      setError(oldError);
      setEmployeePassword(value);
    },
    [error]
  );
  const handleChangeEmployeeRole = useCallback(
    (e) => {
      let value = e.target.value;
      let oldError = { ...error };
      if (!value) {
        oldError.employeePassword = true;
      } else {
        oldError.employeePassword = false;
      }
      setError(oldError);
      setEmployeeRole(value);
    },
    [error]
  );
  const handleChangeEmployeeOffice = useCallback(
    (e) => {
      setEmployeeOffice(e.target.value);
    },
    [error]
  );

  const handleAddEmployee = useCallback(async () => {
    let oldError = { ...error };

    if (!employeeName) {
      oldError.employeeName = true;
    }
    if (!employeePhone) {
      oldError.employeePhone = true;
    }
    if (!employeeRole) {
      oldError.employeeRole = true;
    }
    let condition =
      oldError.employeeName ||
      oldError.employeePhone ||
      oldError.employeeRole ||
      oldError.employeeMail;
    if (!props.userId) {
      if (!employeePassword) {
        oldError.employeePassword = true;
      }
      condition =
        oldError.employeeName ||
        oldError.employeePhone ||
        oldError.employeeRole ||
        oldError.employeePassword;
    }
    if (condition) {
      setError(oldError);
      return;
    }

    let phone = employeePhone;
    if (employeePhone && employeePhone[0] == 0) {
      phone = '+84' + employeePhone.substring(1);
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
      try {
        const updateEmployee = await props.axiosJWT.put(
          `http://localhost:${props.port}/user/update-user`,
          submitData,
          {
            headers: { token: props.token },
          }
        );
        if (updateEmployee.data.statusCode == 200) {
          toastIdRef.current = toast({
            title: 'Thông tin nhân viên đã được cập nhật.',
            description: 'Chúng tôi đã cập nhật thông tin nhân viên cho bạn.',
            status: 'success',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
          props.handleGetListUser();
          props.onClose();
        }
      } catch (err) {
        if (err.response.data.statusCode == 401) {
          toastIdRef.current = toast({
            title: 'Phiên của bạn đã hết hạn.',
            description: 'Phiên đã hết hạn vui lòng đăng nhập lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        } else {
          toastIdRef.current = toast({
            title: err.response.data.data.message,
            description: 'Xảy ra lỗi khi cập nhật thông tin nhân viên. Làm ơn hãy thử lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        }
      }
    } else {
      try {
        const addEmployee = await props.axiosJWT.post(
          `http://localhost:${props.port}/user/add-user`,
          submitData,
          {
            headers: { token: props.token },
          }
        );
        if (addEmployee.data.statusCode == 200) {
          toastIdRef.current = toast({
            title: 'Thông tin nhân viên đã được thêm.',
            description: 'Chúng tôi đã thêm thông tin nhân viên cho bạn.',
            status: 'success',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
          props.handleGetListUser();
          props.onClose();
        }
      } catch (err) {
        if (err.response.data.statusCode == 401) {
          toastIdRef.current = toast({
            title: 'Phiên của bạn đã hết hạn.',
            description: 'Phiên đã hết hạn vui lòng đăng nhập lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        } else {
          toastIdRef.current = toast({
            title: err.response.data.data.message,
            description: 'Xảy ra lỗi khi thêm thông tin nhân viên. Làm ơn hãy thử lại.',
            status: 'error',
            isClosable: true,
            position: 'top',
            duration: 2000,
          });
        }
      }
    }
  }, [
    employeeEmail,
    employeePhone,
    employeePassword,
    employeeRole,
    employeeOffice,
    employeeName,
    error,
    props.userId,
  ]);
  const handleGetListOffice = async () => {
    try {
      const getListOffice = await props.axiosJWT.post(
        `http://localhost:${props.port}/office/list-office`,
        {
          limit: 1000,
          offset: 0,
        },
        {
          headers: { token: props.token },
        }
      );
      if (getListOffice.data.statusCode == 200) {
        setListOffice(getListOffice.data.data.list_office);
      }
    } catch (err) {
      if (err.response.data.statusCode == 401) {
        toastIdRef.current = toast({
          title: 'Phiên của bạn đã hết hạn.',
          description: 'Phiên đã hết hạn vui lòng đăng nhập lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      } else {
        toastIdRef.current = toast({
          title: err.response.data.data.message,
          description: 'Không thể lấy danh sách văn phòng. Làm ơn hãy thử lại.',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 2000,
        });
      }
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
      setError({
        employeeName: false,
        employeePhone: false,
        employeeRole: false,
        employeePassword: false,
        setError: false,
      });
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
      Promise.all([handleGetListOffice()]);
    }
  }, [props.isOpen]);

  console.log(props.userId);
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize={'3xl'} textAlign="center">
              {!props.userId ? 'Thêm nhân viên' : 'Chỉnh sửa thông tin nhân viên'}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl marginBottom="5%" isRequired isInvalid={error.employeeName}>
              <Flex>
                <FormLabel width={'51.5%'} fontWeight={'500'} mt={'2'}>
                  Tên nhân viên
                </FormLabel>
                <Input value={employeeName} onChange={handleChangeEmployeeName} />
              </Flex>
              <FormErrorMessage justifyContent={'flex-end'}>
                Tên nhân viên là bắt buộc
              </FormErrorMessage>
            </FormControl>

            <FormControl marginBottom="5%" isInvalid={error.employeeMail}>
              <Flex>
                <Text width={'51.5%'} fontWeight={'500'} mt="2">
                  Email
                </Text>
                <Input value={employeeEmail} onChange={handleChangeEmployeeEmail} />
              </Flex>
              <FormErrorMessage justifyContent={'flex-end'}>Email sai định dạng</FormErrorMessage>
            </FormControl>

            <FormControl marginBottom="5%" isRequired isInvalid={error.employeePhone}>
              <Flex>
                <FormLabel width={'51.5%'} fontWeight={'500'} mt={'2'}>
                  Số điện thoại
                </FormLabel>
                <Input value={employeePhone} onChange={handleChangeEmployeePhone} />
              </Flex>
              <FormErrorMessage justifyContent={'flex-end'}>
                {employeePhone == '' ? 'Số điện thoại là bắt buộc' : 'Số điện thoại sai định dạng'}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired={!props.userId ? true : false}
              isInvalid={props.userId && error.employeePassword}
              marginBottom={'5%'}
            >
              <Flex>
                <FormLabel width={'51.5%'} fontWeight={'500'} mt="2">
                  Mật khẩu
                </FormLabel>
                <Input
                  value={employeePassword}
                  onChange={handleChangeEmployeePassword}
                  type={showPassword ? 'text' : 'password'}
                />
              </Flex>
              <FormErrorMessage justifyContent={'flex-end'}>
                {!employeePassword ? 'Mật khẩu là bắt buộc' : 'Mật khẩu sai định dạng'}
              </FormErrorMessage>
            </FormControl>

            <FormControl marginBottom="5%" isRequired isInvalid={error.employeeRole}>
              <Flex>
                <FormLabel width={'50%'} fontWeight={'500'} mt={'2'}>
                  Chức vụ
                </FormLabel>
                <Select
                  placeholder="Chọn chức vụ"
                  value={employeeRole}
                  onChange={handleChangeEmployeeRole}
                >
                  <option value="1">Quản lý</option>
                  <option value="2">Nhân viên hỗ trợ khách hàng</option>
                  <option value="3">Tài xế</option>
                </Select>
              </Flex>
              <FormErrorMessage justifyContent={'flex-end'}>Chức vụ là bắt buộc</FormErrorMessage>
            </FormControl>

            <Flex marginBottom={'5%'}>
              <Text width={'50%'} fontWeight={'500'} mt={'2'}>
                Văn phòng
              </Text>
              <Select
                placeholder="Chọn văn phòng"
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
            <Button backgroundColor="#F26A4C" color="#fff" onClick={handleAddEmployee}>
              {!props.userId ? 'Thêm' : 'Chỉnh sửa'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
