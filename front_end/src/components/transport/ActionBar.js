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
    props.setTransportId(0);
    props.onOpen();
  };
  return (
    <Flex marginBottom={'3%'} marginTop={'2%'} justifyContent={'space-between'}>
      <Flex width={'40%'}>
      <InputGroup borderRadius="8px" marginRight={'5%'} border="1px solid #ffbea8">
          <InputLeftElement
            pointerEvents="none"
            children={<CiSearch fill="#F26A4C" />}
            color="#F26A4C"
          />
          <Input
            type="tel"
            placeholder="Tìm kiếm"
            value={props.querySearch}
            onChange={props.handleChangeQuerySearch}
          />
        </InputGroup>
        <IconButton
          icon={<CiFilter />}
          backgroundColor={'#fff'}
          color="#F26A4C"
          border="2px solid #ffbea8"
          _hover={{
            backgroundColor: '#ffbea8',
            color: '#fff',
          }}
          onClick={props.handleGetListTransport}
        />
      </Flex>
      <ButtonGroup>
        <IconButton
          icon={<AiOutlinePlus />}
          backgroundColor={'#fff'}
          color="#F26A4C"
          border="2px solid #ffbea8"
          _hover={{
            backgroundColor: '#ffbea8',
            color: '#fff',
          }}
          onClick={handleActiveModal}
        />
        {/* <IconButton icon={<CiExport />} backgroundColor={'#D6D6D6'} color={'#686868'} />
        <IconButton icon={<CiImport />} backgroundColor={'#D6D6D6'} color={'#686868'} /> */}
      </ButtonGroup>
    </Flex>
  );
}
