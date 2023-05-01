import { IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import { Stack, Flex } from '@chakra-ui/react';
import { formatMoney } from '@/helper';

export default function ListCashier(props) {
  const listHTML = props.listRevenue
    .filter((e) => e.phone)
    .map((revenue, index) => {
      const numberTicketSold = revenue.seat ? revenue.seat.split(', ').length : 0;
      let mainPhone = revenue.phone.replace('+84', '0');
      mainPhone =
        mainPhone.substring(0, 4) + ' ' + mainPhone.substring(4, 7) + ' ' + mainPhone.substring(7);
      let role =
        revenue.role_id == 1
          ? 'Quản lí'
          : revenue.role_id == 2
          ? 'Nhân viên hỗ trợ khách hàng'
          : 'Tài xế';
      return (
        <tr onClick={() => handleGetEmployeeInformation(revenue.id)}>
          <td>{index + 1}</td>
          <td>
            <Stack>
              <Flex alignItems={'center'} justifyContent={'center'}>
                <IoPersonOutline style={{ width: '15%' }} />
                <p style={{ width: '80%' }}>{revenue.user_name}</p>
              </Flex>
              <Flex alignItems={'center'} justifyContent={'center'}>
                <IoCallOutline style={{ width: '15%' }} />
                <p style={{ width: '80%' }}>{mainPhone}</p>
              </Flex>
            </Stack>
          </td>
          <td
            style={
              revenue.role_id == 1
                ? { color: 'red' }
                : revenue.role_id == 2
                ? { color: 'green' }
                : { color: 'blue' }
            }
          >
            <p style={{ width: '95%' }}>{role}</p>
          </td>
          <td>
            <Flex alignItems={'center'} justifyContent={'center'}>
              <p style={revenue.office_name ? { width: '95%' } : { width: '95%', color: 'red' }}>
                {revenue.office_name ? revenue.office_name : 'Không thuộc văn phòng'}
              </p>
            </Flex>
          </td>
          <td>
            <Flex alignItems={'center'} justifyContent={'center'}>
              <p style={{ width: '95%' }}>{numberTicketSold}</p>
            </Flex>
          </td>
          <td>
            <Flex alignItems={'center'} justifyContent={'center'}>
              <p style={{ width: '95%' }}>{formatMoney(revenue.ticket_price)}</p>
            </Flex>
          </td>
        </tr>
      );
    });
  return (
    <table style={{ width: '100%', textAlign: 'center' }} className="bom-table-bus">
      <thead>
        <tr>
          <th>STT</th>
          <th>Nhân viên</th>
          <th>Chức vụ</th>
          <th>Văn phòng</th>
          <th>Số vé đã bán</th>
          <th>Số tiền đã thu</th>
        </tr>
      </thead>
      <tbody>{listHTML}</tbody>
    </table>
  );
}
