import {
  IconButton,
  Input,
  InputGroup,
  ButtonGroup,
  InputLeftElement,
  Flex,
} from '@chakra-ui/react';
import { CiSearch, CiFilter, CiImport, CiExport } from 'react-icons/ci';
import { AiOutlinePlus } from 'react-icons/ai';
export default function ActionBar(props) {
  const handleActiveModal = () => {
    props.setVehicleId(0);
    props.onOpen();
  };
  return (
    <Flex marginTop={'2%'} marginBottom={'3%'} justifyContent={'space-between'}>
      <Flex width={'40%'}>
        <InputGroup
          backgroundColor={'#C2C2C2'}
          color={'#686868'}
          borderRadius="8px"
          marginRight={'5%'}
        >
          <InputLeftElement pointerEvents="none" children={<CiSearch />} />
          <Input type="tel" placeholder="Tìm kiếm" />
        </InputGroup>
        <IconButton icon={<CiFilter />} backgroundColor={'#C2C2C2'} color={'#686868'} />
      </Flex>
      <ButtonGroup>
        <IconButton
          icon={<AiOutlinePlus />}
          backgroundColor={'#C2C2C2'}
          color={'#686868'}
          onClick={handleActiveModal}
        />
        <IconButton icon={<CiExport />} backgroundColor={'#C2C2C2'} color={'#686868'} />
        <IconButton icon={<CiImport />} backgroundColor={'#C2C2C2'} color={'#686868'} />
      </ButtonGroup>
    </Flex>
  );
}
