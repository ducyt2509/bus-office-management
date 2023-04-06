const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../server')


describe('get list bus', () => {
    it('get list bus when all attribute are null ', async () => {
        const response = await request(app).post('/bus/list-bus').send({
            limit: null,
            offset: null,
            query_search: null,
            page: null,
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list bus when all attribute are null and limit is "" ', async () => {
        const response = await request(app).post('/bus/list-bus').send({
            limit: "",
            offset: null,
            query_search: null,
            page: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list bus when all attribute are null and limit is string ', async () => {
        const response = await request(app).post('/bus/list-bus').send({
            limit: "abc",
            offset: null,
            query_search: null,
            page: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list bus when all attribute are null and limit is negative number ', async () => {
        const response = await request(app).post('/bus/list-bus').send({
            limit: -1,
            offset: null,
            query_search: null,
            page: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })


    it('get list bus when all attribute are null and limit is positive number ', async () => {
        const response = await request(app).post('/bus/list-bus').send({
            limit: 3,
            offset: null,
            query_search: null,
            page: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list bus when all attribute have validated value', async () => {
        const response = await request(app).post('/bus/list-bus').send({
            limit: 3,
            offset: 0,
            query_search: "a",
            page: 1
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })
})

describe('get bus by id ', () => {
    it('get bus when bus id is null  ', async () => {
        const response = await request(app).post('/bus/bus-by-id').send({
            id: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get bus when bus id is ""  ', async () => {
        const response = await request(app).post('/bus/bus-by-id').send({
            id: ""
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get bus when bus id is string  ', async () => {
        const response = await request(app).post('/bus/bus-by-id').send({
            id: "abc"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get bus when bus id is negative number  ', async () => {
        const response = await request(app).post('/bus/bus-by-id').send({
            id: -5
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get bus when bus id is positive  number but dont exist in db  ', async () => {
        const response = await request(app).post('/bus/bus-by-id').send({
            id: 5000
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get bus when bus id is positive  number but  exist in db  ', async () => {
        const response = await request(app).post('/bus/bus-by-id').send({
            id: 1
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

})


describe('create bus', () => {
    it('create bus when all attribute are null  ', async () => {
        const response = await request(app).post('/bus/add-bus').send({
            vehicle_plate: null,
            main_driver_id: null,
            support_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create bus when  all attribute are null and vehicle_plate is "" ', async () => {
        const response = await request(app).post('/bus/add-bus').send({
            vehicle_plate: "",
            main_driver_id: null,
            support_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create bus when  all attribute are null and vehicle_plate is string ', async () => {
        const response = await request(app).post('/bus/add-bus').send({
            vehicle_plate: "abc",
            main_driver_id: null,
            support_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create bus when  all attribute are null and vehicle_plate is positive number ', async () => {
        const response = await request(app).post('/bus/add-bus').send({
            vehicle_plate: 1,
            main_driver_id: null,
            support_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create bus when  all attribute are null and vehicle_plate is negative number ', async () => {
        const response = await request(app).post('/bus/add-bus').send({
            vehicle_plate: -1,
            main_driver_id: null,
            support_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create bus when  all attribute are validated value and vehicle_plate is string and string length is not between 8 and 11 characters ', async () => {
        const response = await request(app).post('/bus/add-bus').send({
            vehicle_plate: "abc",
            main_driver_id: 1,
            support_driver_id: 2,
            vehicle_type_id: 1,
            vehicle_status: 1,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create bus when  all attribute are validated value and vehicle_plate is string and string length is between 8 and 11 characters but vehicle_plate is exist in db ', async () => {
        const response = await request(app).post('/bus/add-bus').send({
            vehicle_plate: "30y9-02372",
            main_driver_id: 1,
            support_driver_id: 2,
            vehicle_type_id: 1,
            vehicle_status: 1,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This bus is already exist in db")
    })

    it('create bus when  all attribute are validated value and vehicle_plate is string and string length is between 8 and 11 characters but vehicle_plate is not exist in db ', async () => {
        const response = await request(app).post('/bus/add-bus').send({
            vehicle_plate: "30T5-12345",
            main_driver_id: 1,
            support_driver_id: 2,
            vehicle_type_id: 1,
            vehicle_status: 1,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Add bus successfully")
    })



})

describe('update bus', () => {
    it('update bus when all attribute are null  ', async () => {
        const response = await request(app).post('/bus/update-bus').send({
            id: null,
            vehicle_plate: null,
            main_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update bus when all attribute are null and id is "" ', async () => {
        const response = await request(app).post('/bus/update-bus').send({
            id: "",
            vehicle_plate: null,
            main_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null

        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update bus when all attribute are null and id is string  ', async () => {
        const response = await request(app).post('/bus/update-bus').send({
            id: "abc",
            vehicle_plate: null,
            main_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })
    it('update bus when all attribute are null and id is negative number', async () => {
        const response = await request(app).post('/bus/update-bus').send({
            id: -1,
            vehicle_plate: null,
            main_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update bus when all attribute are null and id is positive number ', async () => {
        const response = await request(app).post('/bus/update-bus').send({
            id: 10,
            vehicle_plate: null,
            main_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null

        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update bus when all attribute have validated values and id does not exist in db ', async () => {
        const response = await request(app).post('/bus/update-bus').send({
            id: 5000,
            vehicle_plate: "30y1-02112",
            main_driver_id: 1,
            vehicle_type_id: 2,
            vehicle_status: 1
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This bus is not exist in db")
    })

    it('update bus when all attribute have validated values and id does not exist in db ', async () => {
        const response = await request(app).post('/bus/update-bus').send({
            id: 1,
            vehicle_plate: "30y1-02112",
            main_driver_id: 1,
            vehicle_type_id: 2,
            vehicle_status: 1
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This bus is not exist in db")
    })


    it('update bus when all attribute have validated values and id exist in db but vehicle_plate that want to update is exist in db ', async () => {
        const response = await request(app).post('/bus/update-bus').send({
            id: 1,
            vehicle_plate: "30y5-02372",
            main_driver_id: 1,
            vehicle_type_id: 2,
            vehicle_status: 1
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This bus is already exists in DB")
    })

    it('update bus when all attribute have validated values and id exist in db but vehicle_plate that want to update is NOT exist in db ', async () => {
        const response = await request(app).post('/bus/update-bus').send({
            id: 1,
            vehicle_plate: "30G5-11172",
            main_driver_id: 1,
            vehicle_type_id: 2,
            vehicle_status: 1
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Update bus successfully")
    })

})

describe('delete bus', () => {
    it('delete a bus when id is null ', async () => {
        const response = await request(app).post('/bus/delete-bus').send({
            id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id is required")
    })

    it('delete a bus when id is "" ', async () => {
        const response = await request(app).post('/bus/delete-bus').send({
            id: ""
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id is required")
    })

    it('delete a bus when id is string ', async () => {
        const response = await request(app).post('/bus/delete-bus').send({
            id: "abc"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })


    it('delete a bus when id is negative number ', async () => {
        const response = await request(app).post('/bus/delete-bus').send({
            id: -1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed ")
    })

    it('delete a bus when id is positive number but does not exist in db', async () => {
        const response = await request(app).post('/bus/delete-bus').send({
            id: 5000
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("this bus does not exist")
    })

    it('delete a bus when id is positive number and exist in db', async () => {
        const response = await request(app).post('/bus/delete-bus').send({
            id: 1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Delete bus successfully")
    })
})