const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../server')
const messageHandler = require('../handlers/message.handler')


describe('get list location', () => {
    //1
    it('get list location when all attribute are null ', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: null,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        // expect(response.body.data.message).toBe(messageHandler.messageValidateFailed)
    })

    //2
    it('get list location when all attribute are null and limit is "" ', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: "",
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        // expect(response.body.data.message).toBe(messageHandler.messageValidateFailed)
    })

    //3
    it('get list location when all attribute are null and limit is string ', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: "abc",
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        // expect(response.body.data.message).toBe(messageHandler.messageValidateFailed)
    })

    //4
    it('get list location when all attribute are null and limit is negative number ', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: -1,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        // expect(response.body.data.message).toBe(messageHandler.messageValidateFailed)
    })

    //5
    it('get list location when all attribute are null and limit is positive number ', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: 3,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        // expect(response.body.data.message).toBe(messageHandler.messageValidateFailed)
    })


    //6
    it('get list location when all attribute have validated value', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: 10,
            offset: 2,
            query_search: "văn phòng"
        })
        expect(response.statusCode).toBe(200)
    })

    it('get list location when all attribute have validated value', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: 1,
            offset: 2,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
    })
    //8
    it('get list location when all attribute have validated value', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: 1,
            offset: 0,
            query_search: "văn phòng"
        })
        expect(response.statusCode).toBe(200)
    })

})
//DONE
describe('create location', () => {
    //1
    it('create location when all attribute are null  ', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: null,
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe(messageHandler.messageValidateFailed)
    })

    //2

    it('create location when  all attribute are null and location name is "" ', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: "",
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe(messageHandler.messageValidateFailed)
    })

    //3
    it('create location when  all attribute are null and location name is number', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: -5,
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe(messageHandler.messageValidateFailed)
    })

    //4
    it('create location when  all attribute are null and location name is number', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: 3,
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe(messageHandler.messageValidateFailed)
    })

    //5
    it('create location when  all attribute have validated values but exist one location in database has the same info ', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: "Văn phòng Mĩ Đình",
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe(messageHandler.messageValidateFailed)
    })

    //6
    it('create location when  all attribute have validated values but exist one location in datebase has the same info ', async () => {
        const response = await request(app).post('/location/add-location').send({
            "location_name": "Văn phòng Mĩ Đình",
            "address": "108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội",
            "city_id": 5000,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("City not found")
    })
    //7
    it('create location when  all attribute have validated values but exist one location in datebase has the same info ', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: "Văn phòng Mĩ Đình",
            address: "108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội",
            city_id: 14,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Location is already exist")
    })

    //8
    it('create location when  all attribute have validated values but exist one location in datebase has the same info ', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: "Văn phòng Mĩ Đình",
            address: "km29 Thạch Hòa, Thạch Thất, Hà Nội",
            city_id: 14,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Location is already exist")
    })


    //9
    it('create location when  all attribute have validated values but exist one location in datebase has the same info ', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: "Gốc cây xà cừ",
            address: "km29 Thạch Hòa, Thạch Thất, Hà Nội",
            city_id: 5000,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("City not found")
    })

    //10
    it('create location when  all attribute have validated values but exist one location in datebase has the same info ', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: "Gốc cây xà cừAAAA1",
            address: "km29AAA1 Thạch Hòa, Thạch Thất, Hà Nội",
            city_id: 14,
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("Add new location successful")
    })


})

describe('update location', () => {
    it('update location when all attribute are null  ', async () => {
        const response = await request(app).post('/location/update-location').send({
            id: null,
            location_name: null,
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update location when all attribute are null and id is ""', async () => {
        const response = await request(app).post('/location/update-location').send({
            id: "",
            location_name: null,
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update location when all attribute are null and id is string', async () => {
        const response = await request(app).post('/location/update-location').send({
            id: "ab",
            location_name: null,
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })
    it('update location when all attribute are null and id is negative number ', async () => {
        const response = await request(app).post('/location/update-location').send({
            id: -10,
            location_name: null,
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update location when all attribute are null and id is positive number', async () => {
        const response = await request(app).post('/location/update-location').send({
            id: 1,
            location_name: null,
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update location when all attribute have validated values and id is not exist in db', async () => {
        const response = await request(app).post('/location/update-location').send({
            id: 1000,
            location_name: null,
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This location is not exist in db")
    })

    it('update location when all attribute have validated values and id is  exist but input location info that want update is exist in db  ', async () => {
        const response = await request(app).post('/location/update-location').send({
            id: 1,
            location_name: "Số 1 Lê Hồng Phong Nam Định",
            address: "Số 1 Lê Hồng Phong Nam Định",
            city_id: 14,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed !")
    })

    it('update location when all attribute have validated values and id is  exist but input location info that want update is not exist in db ', async () => {
        const response = await request(app).post('/location/update-location').send({
            id: 1,
            location_name: "Số 12 Điện Biên Phủ Nam Định",
            address: "Số 12 Điện Biên Phủ Nam Định",
            city_id: 14,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Update successfully !")
    })



})

// describe('delete location', () => {
//     it('delete a location when id is null ', async () => {
//         const response = await request(app).post('/location/delete-location').send({
//             id: null
//         })
//         expect(response.statusCode).toBe(400)
//         expect(response.body.data.message).toBe("id is required")
//     })

//     it('delete a location when id is "" ', async () => {
//         const response = await request(app).post('/location/delete-location').send({
//             id: ""
//         })
//         expect(response.statusCode).toBe(400)
//         expect(response.body.data.message).toBe("id is required")
//     })

//     it('delete a location when id is string ', async () => {
//         const response = await request(app).post('/location/delete-location').send({
//             id: "abc"
//         })
//         expect(response.statusCode).toBe(400)
//         expect(response.body.data.message).toBe("Validate failed")
//     })


//     it('delete a location when id is negative number ', async () => {
//         const response = await request(app).post('/location/delete-location').send({
//             id: -1
//         })
//         expect(response.statusCode).toBe(400)
//         expect(response.body.data.message).toBe("Validate failed ")
//     })

//     it('delete a location when id is positive number but does not exist in db', async () => {
//         const response = await request(app).post('/location/delete-location').send({
//             id: 5000
//         })
//         expect(response.statusCode).toBe(400)
//         expect(response.body.data.message).toBe("this location does not exist")
//     })

//     it('delete a location when id is positive number and exist in db', async () => {
//         const response = await request(app).post('/location/delete-location').send({
//             id: 1
//         })
//         expect(response.statusCode).toBe(400)
//         expect(response.body.data.message).toBe("Delete location successfully")
//     })
// })