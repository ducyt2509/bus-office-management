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
  return (
    <Flex marginTop={'2%'} marginBottom={'3%'} justifyContent={'space-between'}>
      <Flex width={'40%'}>
        <InputGroup
          backgroundColor={'#D6D6D6'}
          color={'#686868'}
          borderRadius="8px"
          marginRight={'5%'}
        >
          <InputLeftElement pointerEvents="none" children={<CiSearch />} />
          <Input
            type="tel"
            placeholder="Tìm kiếm"
            value={props.querySearch}
            onChange={props.handleChangeQuerySearch}
          />
        </InputGroup>
        <IconButton
          icon={<CiFilter />}
          backgroundColor={'#D6D6D6'}
          color={'#686868'}
          onClick={props.handleGetListBusSchedule}
        />
      </Flex>
      <ButtonGroup>
        <IconButton
          icon={<AiOutlinePlus />}
          backgroundColor={'#D6D6D6'}
          color={'#686868'}
          onClick={() => props.handleGetBusScheduleInformation('add')}
        />
        {/* <IconButton icon={<CiExport />} backgroundColor={'#D6D6D6'} color={'#686868'} />
        <IconButton icon={<CiImport />} backgroundColor={'#D6D6D6'} color={'#686868'} /> */}
      </ButtonGroup>
    </Flex>
  );
}
