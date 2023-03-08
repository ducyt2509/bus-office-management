import { Text, Button, Stack } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { CloseIcon, ArrowBackIcon, CheckIcon } from '@chakra-ui/icons';

export default function StepForgetPassword(props) {
  return (
    <div className="bom-return-login-form">
      <Text fontSize="md" onClick={props.handleShowForgetPassWord}>
        <ArrowBackIcon /> Quay lại đăng nhập
      </Text>
      <Stack direction="row" spacing={4} align="center">
        <Button
          colorScheme="teal"
          variant="outline"
          className={props.stepForgetPassword == 1 && 'bom-button-selected'}
        >
          1
        </Button>
        <Button
          colorScheme="teal"
          variant="outline"
          className={props.stepForgetPassword == 2 && 'bom-button-selected'}
        >
          2
        </Button>
        <Button
          colorScheme="teal"
          variant="outline"
          className={props.stepForgetPassword == 3 && 'bom-button-selected'}
        >
          3
        </Button>
        <Button
          colorScheme="teal"
          variant="outline"
          className={props.stepForgetPassword == 4 && 'bom-button-selected'}
        >
          <CheckIcon boxSize={3} />
        </Button>
      </Stack>
    </div>
  );
}
