import {
  Container,
  Input,
  Button,
  Textarea,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useState } from 'react';

export default function ContactUs() {
  const [errorForm, setErrorForm] = useState({
    email: false,
    message: false,
    fullname: false,
  });
  const [userInput, setUserInput] = useState({
    email: '',
    message: '',
    fullname: '',
  });
  const handleChangeEmail = useCallback(
    (event) => {
      let email = event.target.value;
      let error = { ...errorForm };
      let pattern = '^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+$';
      if (email == '' || !email.toLowerCase().match(pattern)) {
        error.email = true;
      } else {
        error.email = false;
      }

      setUserInput({ ...userInput, email });
      setErrorForm(error);
    },
    [errorForm]
  );

  const handleChangeUserValue = useCallback(
    (event) => {
      let value = event.target.value;
      let targetProperty = event.target.name;
      let error = { ...errorForm };
      if (value == '') {
        error[targetProperty] = true;
      } else {
        error[targetProperty] = false;

      }
      let copyUserInput = { ...userInput };
      copyUserInput[targetProperty] = value;
      setUserInput(copyUserInput);
      setErrorForm(error);
    },
    [errorForm]
  );

  const handleSendEmail = async () => {
    const sendMail = await axios.post('http://localhost:5000/contact-us/send', {
      ...userInput,
    });

    if (sendMail.data.statusCode === 200) {
      console.log('send');
    } else if (sendMail.data.statusCode === 403) {
      console.log(sendMail.data.data.message);
    }
  };

  return (
    <div className="contact-us">
      <Container centerContent>
        <div className="contact-us__title">Liên Hệ Với Chúng Tôi {errorForm.fullname}</div>
        <FormControl isRequired isInvalid={errorForm.fullname}>
          <Input
            name="fullname"
            placeholder="Họ và tên"
            size="lg"
            mt={6}
            onChange={handleChangeUserValue}
            autoComplete="off"
          />
          <FormErrorMessage>{errorForm.fullname ? 'Họ và tên là bắt buộc' : ''}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errorForm.email} isRequired>
          <Input
            placeholder="email"
            size="lg"
            mt={6}
            onChange={handleChangeEmail}
            name="email"
            autoComplete="off"
          />
          <FormErrorMessage>
            {userInput.email == '' ? 'email là bắt buộc!' : 'email không đúng định dạng'}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errorForm.message} isRequired>
          <Textarea
            name="message"
            placeholder="Gửi lời nhắn của bạn . . ."
            mt={6}
            size="lg"
            onChange={handleChangeUserValue}
            autoComplete="off"
          />
          <FormErrorMessage>{errorForm.message ? 'Lời nhắn là bắt buộc' : ''}</FormErrorMessage>
        </FormControl>
        <Button
          size="lg"
          mt={6}
          px={7}
          onClick={handleSendEmail}
          isDisabled={
            errorForm.fullname == true ||
            userInput.fullname == '' ||
            errorForm.message == true ||
            userInput.message == '' ||
            errorForm.email == true ||
            userInput.email == ''
          }
        >
          Gửi ý kiến
        </Button>
      </Container>
    </div>
  );
}
