import {
  Button,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { CheckIcon } from '@chakra-ui/icons';

export default function ForgetPasswordStep4(props) {
  return (
    <div>
      <h1 className="bom-forget-password-complete-title">Hoàn thành</h1>
      <div className="bom-login-form" style={{ textAlign: 'center' }}>
        <Button
          colorScheme="teal"
          variant="outline"
          className={props.stepForgetPassword == 4 && 'bom-button-selected'}
          onClick={props.handleForgetPassword}
        >
          <CheckIcon boxSize={3} />
        </Button>
        {props.stepForgetPasswordHTML}
      </div>
    </div>
  );
}
