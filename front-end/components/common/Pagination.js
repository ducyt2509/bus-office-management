import { Button, ButtonGroup } from '@chakra-ui/react';

export default function Pagination(props) {
  const page_number = Math.ceil(props.list_number / 7);
  const buttonArray = new Array(page_number).fill(1);
  const pageHTML = buttonArray.map((button, index) => {
    return (
      <Button
        onClick={props.handleChangePage}
        backgroundColor="#fff"
        color={'#686868'}
        border={'1px solid'}
      >
        {index + 1}
      </Button>
    );
  });
  return (
    <div style={{ marginTop: '3%', textAlign: 'center' }}>
      <ButtonGroup>{pageHTML}</ButtonGroup>
    </div>
  );
}
