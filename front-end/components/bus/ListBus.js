import { SlPencil } from 'react-icons/sl';
import { IoTrashBinOutline, IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import { Stack, IconButton, Flex } from '@chakra-ui/react';
import axios from 'axios';
export default function ListBus(props) {
  const handleActiveModal = (busId, bus) => {
    props.setVehicle(bus);
    props.setVehicleId(busId);
    props.onOpen();
  };
  const handleDeleteBus = async (busId) => {
    const deleteVehicle = await axios.delete(
      `http://localhost:${props.port}/bus/delete-bus`,
      { data: { id: busId } },
      {
        headers: { token: props.token },
      }
    );
    if (deleteVehicle.data.statusCode == 200) {
      props.handleGetListBus();
    }
  };
  const ListBusHTML = props.list.map((bus, index) => {
    let mainPhone = bus.driverMain.phone.replace('+84', '0');
    mainPhone =
      mainPhone.substring(0, 4) + ' ' + mainPhone.substring(4, 7) + ' ' + mainPhone.substring(7);
    let supportPhone = bus.driverSupport.phone.replace('+84', '0');
    supportPhone =
      supportPhone.substring(0, 4) +
      ' ' +
      supportPhone.substring(4, 7) +
      ' ' +
      supportPhone.substring(7);
    const busStatusHTML =
      bus.vehicle_status == 1 ? (
        <div className="bom-bus-status active">Đang hoạt động</div>
      ) : (
        <div className="bom-bus-status no-active">Ngừng hoạt động</div>
      );
    return (
      <tr>
        <td>{index + 1}</td>
        <td>{bus.vehicle_plate}</td>
        <td>{bus.vehicle.vehicle_name}</td>
        <td>
          <Stack>
            <Flex alignItems={'center'} justifyContent={'center'}>
              <IoPersonOutline style={{ width: '15%' }} />
              <p style={{ width: '56%' }}>{bus.driverMain.user_name}</p>
            </Flex>
            <Flex alignItems={'center'} justifyContent={'center'}>
              <IoCallOutline style={{ width: '15%' }} />
              <p style={{ width: '56%' }}>{mainPhone}</p>
            </Flex>
          </Stack>
        </td>
        <td>
          <Stack>
            <Flex alignItems={'center'} justifyContent={'center'}>
              <IoPersonOutline style={{ width: '15%' }} />
              <p style={{ width: '56%' }}>{bus.driverSupport.user_name}</p>
            </Flex>
            <Flex alignItems={'center'} justifyContent={'center'}>
              <IoCallOutline style={{ width: '15%' }} />
              <p style={{ width: '56%' }}>{supportPhone}</p>
            </Flex>
          </Stack>
        </td>
        <td>{busStatusHTML}</td>
        <td>
          <Stack spacing={2} direction="row" align="center" justifyContent={'center'}>
            <IconButton icon={<SlPencil />} onClick={() => handleActiveModal(bus?.id, bus)} />
            <IconButton icon={<IoTrashBinOutline />} onClick={() => handleDeleteBus(bus?.id)} />
          </Stack>
        </td>
      </tr>
    );
  });
  return (
    <table style={{ width: '100%', textAlign: 'center' }} className="bom-table-bus">
      <thead>
        <tr>
          <td>STT</td>
          <td>Biển số xe</td>
          <td>Loại xe</td>
          <td>Tài xế chính</td>
          <td>Tài xế phụ</td>
          <td>Tình trạng</td>
          <td>Thao tác</td>
        </tr>
      </thead>
      <tbody>{ListBusHTML}</tbody>
    </table>
  );
}
