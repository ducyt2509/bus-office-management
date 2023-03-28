import { validate } from '@/helper';
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
    fullName: false,
  });
  const [userInput, setUserInput] = useState({
    email: '',
    message: '',
    fullName: '',
  });
  const handleChangeEmail = useCallback(
    (event) => {
      let email = event.target.value;
      let error = { ...errorForm };
      let pattern = validate.email;
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
        <div className="contact-us__title">Liên Hệ Với Chúng Tôi {errorForm.fullName}</div>
        <FormControl isRequired isInvalid={errorForm.fullName}>
          <Input
            name="fullName"
            placeholder="Họ và tên"
            size="lg"
            mt={6}
            onChange={handleChangeUserValue}
            autoComplete="off"
          />
          <FormErrorMessage>{errorForm.fullName ? 'Họ và tên là bắt buộc' : ''}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errorForm.email} isRequired>
          <Input
            placeholder="Email"
            size="lg"
            mt={6}
            onChange={handleChangeEmail}
            name="Email"
            autoComplete="off"
          />
          <FormErrorMessage>
            {userInput.email == '' ? 'Email là bắt buộc!' : 'Email không đúng định dạng'}
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
          color="#fff"
          backgroundColor={"#"}
          isDisabled={
            errorForm.fullName == true ||
            userInput.fullName == '' ||
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
