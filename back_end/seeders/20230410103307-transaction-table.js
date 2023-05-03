"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('transaction', [
      {
        passenger_name: "Lương Việt Thắng",
        passenger_phone: "+84377272595",
        passenger_email: "Customer1@gmail.com",
        note: "Có người già đi cùng",
        cashier: 0,
        pickup_location: "07:30 - Văn Phòng Mỹ Đình",
        drop_off_location: "10:00 - Văn Phòng Nghĩa Hưng",
        date_detail: "2023-05-04  07:30-11:00",
        ticket_price: 60000,
        created_at: "2023-04-17",
        created_by: 0,
        payment_status: 0,
        seat: "A1",
        transport_id: 1
      },

      {
        passenger_name: "Nguyễn Ngọc Anh",
        passenger_phone: "+84373854710",
        passenger_email: "Customer2@gmail.com",
        note: "",
        cashier: 0,
        pickup_location: "07:30 - Văn Phòng Nghĩa Hưng",
        drop_off_location: "09:45 - Công Viên Cầu Giấy",
        date_detail: "2023-04-17  07:30-11:00",
        ticket_price: 60000,
        created_at: "2023-04-17",
        created_by: 0,
        payment_status: 3,
        seat: "A2",
        transport_id: 1
      },

      {
        passenger_name: "Đinh Tri Kiến",
        passenger_phone: "+84846530079",
        passenger_email: "Customer3@gmail.com",
        note: "",
        cashier: 0,
        pickup_location: "07:50 - Văn Phòng Lê Hồng Phong",
        drop_off_location: "09:20 - Nghĩa Trang Mai Dịch",
        date_detail: "2023-04-17  07:30-11:00",
        ticket_price: 60000,
        created_at: "2023-04-17",
        created_by: 0,
        payment_status: 1,
        seat: "B1, B2",
        transport_id: 1
      },

      {
        passenger_name: "Trần Huy Hoàng",
        passenger_phone: "+84986092375",
        passenger_email: "Customer4@gmail.com",
        note: "Có người già đi cùng",
        cashier: 0,
        pickup_location: "08:10 - Văn Phòng Nam Định",
        drop_off_location: "09:20 - Nghĩa Trang Mai Dịch",
        date_detail: "2023-04-17  07:30-11:00",
        ticket_price: 60000,
        created_at: "2023-04-17",
        created_by: 0,
        payment_status: 2,
        seat: "C1, C2,C3",
        transport_id: 1
      },

      {
        passenger_name: "Nguyễn Thái Hòa",
        passenger_phone: "+84917879189",
        passenger_email: "Customer5@gmail.com",
        note: "",
        cashier: 0,
        pickup_location: "08:10 - Văn Phòng Nam Định",
        drop_off_location: "09:20 - Nghĩa Trang Mai Dịch",
        date_detail: "2023-04-17  07:30-11:00",
        ticket_price: 60000,
        created_at: "2023-04-17",
        created_by: 0,
        payment_status: 2,
        seat: "B3",
        transport_id: 1
      },

      {
        passenger_name: "Nguyễn Trung Đức",
        passenger_phone: "+84914368311",
        passenger_email: "Customer6@gmail.com",
        note: "",
        cashier: 0,
        pickup_location: "08:10 - Văn Phòng Nam Định",
        drop_off_location: "10:08 - Văn Phòng Trần Vỹ",
        date_detail: "2023-04-17  07:30-11:00",
        ticket_price: 60000,
        created_at: "2023-04-17",
        created_by: 0,
        payment_status: 2,
        seat: "B3",
        transport_id: 1
      },

      {
        passenger_name: "Nguyễn Thái Hòa",
        passenger_phone: "+84988264622",
        passenger_email: "Customer6@gmail.com",
        note: "",
        cashier: 0,
        pickup_location: "08:10 - Văn Phòng Nam Định",
        drop_off_location: "10:08 - Văn Phòng Trần Vỹ",
        date_detail: "2023-04-17  07:30-11:00",
        ticket_price: 60000,
        created_at: "2023-04-18",
        created_by: 0,
        payment_status: 2,
        seat: "C1",
        transport_id: 1
      },



    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};