const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../server')


describe('get list transport', () => {
    it('get list transport when all attribute are null ', async () => {
        const response = await request(app).post('/transport/list-transport').send({
            limit: null,
            offset: null,
            query_search: null,
            page: null,
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list transport when all attribute are null and limit is "" ', async () => {
        const response = await request(app).post('/transport/list-transport').send({
            limit: "",
            offset: null,
            query_search: null,
            page: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list transport when all attribute are null and limit is string ', async () => {
        const response = await request(app).post('/transport/list-transport').send({
            limit: "abc",
            offset: null,
            query_search: null,
            page: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list transport when all attribute are null and limit is negative number ', async () => {
        const response = await request(app).post('/transport/list-transport').send({
            limit: -1,
            offset: null,
            query_search: null,
            page: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })


    it('get list transport when all attribute are null and limit is positive number ', async () => {
        const response = await request(app).post('/transport/list-transport').send({
            limit: 3,
            offset: null,
            query_search: null,
            page: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list transport when all attribute have validated value', async () => {
        const response = await request(app).post('/transport/list-transport').send({
            limit: 3,
            offset: 0,
            query_search: "a",
            page: 1
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })
})

describe('get transport by id ', () => {
    it('get transport when transport id is null  ', async () => {
        const response = await request(app).post('/transport/transport-by-id').send({
            id: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get transport when transport id is ""  ', async () => {
        const response = await request(app).post('/transport/transport-by-id').send({
            id: ""
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get transport when transport id is string  ', async () => {
        const response = await request(app).post('/transport/transport-by-id').send({
            id: "abc"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get transport when transport id is negative number  ', async () => {
        const response = await request(app).post('/transport/transport-by-id').send({
            id: -5
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get transport when transport id is positive  number but dont exist in db  ', async () => {
        const response = await request(app).post('/transport/transport-by-id').send({
            id: 5000
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get transport when transport id is positive  number but  exist in db  ', async () => {
        const response = await request(app).post('/transport/transport-by-id').send({
            id: 1
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

})


describe('create transport', () => {
    it('create transport when all attribute are null  ', async () => {
        const response = await request(app).post('/transport/add-transport').send({
            vehicle_plate: null,
            main_driver_id: null,
            support_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create transport when  all attribute are null and vehicle_plate is "" ', async () => {
        const response = await request(app).post('/transport/add-transport').send({
            vehicle_plate: "",
            main_driver_id: null,
            support_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create transport when  all attribute are null and vehicle_plate is string ', async () => {
        const response = await request(app).post('/transport/add-transport').send({
            vehicle_plate: "abc",
            main_driver_id: null,
            support_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create transport when  all attribute are null and vehicle_plate is positive number ', async () => {
        const response = await request(app).post('/transport/add-transport').send({
            vehicle_plate: 1,
            main_driver_id: null,
            support_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create transport when  all attribute are null and vehicle_plate is negative number ', async () => {
        const response = await request(app).post('/transport/add-transport').send({
            vehicle_plate: -1,
            main_driver_id: null,
            support_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create transport when  all attribute are validated value and vehicle_plate is string and string length is not between 8 and 11 characters ', async () => {
        const response = await request(app).post('/transport/add-transport').send({
            vehicle_plate: "abc",
            main_driver_id: 1,
            support_driver_id: 2,
            vehicle_type_id: 1,
            vehicle_status: 1,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create transport when  all attribute are validated value and vehicle_plate is string and string length is between 8 and 11 characters but vehicle_plate is exist in db ', async () => {
        const response = await request(app).post('/transport/add-transport').send({
            vehicle_plate: "30y9-02372",
            main_driver_id: 1,
            support_driver_id: 2,
            vehicle_type_id: 1,
            vehicle_status: 1,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This transport is already exist in db")
    })

    it('create transport when  all attribute are validated value and vehicle_plate is string and string length is between 8 and 11 characters but vehicle_plate is not exist in db ', async () => {
        const response = await request(app).post('/transport/add-transport').send({
            vehicle_plate: "30T5-12345",
            main_driver_id: 1,
            support_driver_id: 2,
            vehicle_type_id: 1,
            vehicle_status: 1,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Add transport successfully")
    })



})

describe('update transport', () => {
    it('update transport when all attribute are null  ', async () => {
        const response = await request(app).post('/transport/update-transport').send({
            id: null,
            vehicle_plate: null,
            main_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update transport when all attribute are null and id is "" ', async () => {
        const response = await request(app).post('/transport/update-transport').send({
            id: "",
            vehicle_plate: null,
            main_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null

        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update transport when all attribute are null and id is string  ', async () => {
        const response = await request(app).post('/transport/update-transport').send({
            id: "abc",
            vehicle_plate: null,
            main_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })
    it('update transport when all attribute are null and id is negative number', async () => {
        const response = await request(app).post('/transport/update-transport').send({
            id: -1,
            vehicle_plate: null,
            main_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update transport when all attribute are null and id is positive number ', async () => {
        const response = await request(app).post('/transport/update-transport').send({
            id: 10,
            vehicle_plate: null,
            main_driver_id: null,
            vehicle_type_id: null,
            vehicle_status: null

        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update transport when all attribute have validated values and id does not exist in db ', async () => {
        const response = await request(app).post('/transport/update-transport').send({
            id: 5000,
            vehicle_plate: "30y1-02112",
            main_driver_id: 1,
            vehicle_type_id: 2,
            vehicle_status: 1
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This transport is not exist in db")
    })

    it('update transport when all attribute have validated values and id does not exist in db ', async () => {
        const response = await request(app).post('/transport/update-transport').send({
            id: 1,
            vehicle_plate: "30y1-02112",
            main_driver_id: 1,
            vehicle_type_id: 2,
            vehicle_status: 1
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This transport is not exist in db")
    })


    it('update transport when all attribute have validated values and id exist in db but vehicle_plate that want to update is exist in db ', async () => {
        const response = await request(app).post('/transport/update-transport').send({
            id: 1,
            vehicle_plate: "30y5-02372",
            main_driver_id: 1,
            vehicle_type_id: 2,
            vehicle_status: 1
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This transport is already exists in DB")
    })

    it('update transport when all attribute have validated values and id exist in db but vehicle_plate that want to update is NOT exist in db ', async () => {
        const response = await request(app).post('/transport/update-transport').send({
            id: 1,
            vehicle_plate: "30G5-11172",
            main_driver_id: 1,
            vehicle_type_id: 2,
            vehicle_status: 1
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Update transport successfully")
    })

})

describe('delete transport', () => {
    it('delete a transport when id is null ', async () => {
        const response = await request(app).post('/transport/delete-transport').send({
            id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id is required")
    })

    it('delete a transport when id is "" ', async () => {
        const response = await request(app).post('/transport/delete-transport').send({
            id: ""
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id is required")
    })

    it('delete a transport when id is string ', async () => {
        const response = await request(app).post('/transport/delete-transport').send({
            id: "abc"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })


    it('delete a transport when id is negative number ', async () => {
        const response = await request(app).post('/transport/delete-transport').send({
            id: -1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed ")
    })

    it('delete a transport when id is positive number but does not exist in db', async () => {
        const response = await request(app).post('/transport/delete-transport').send({
            id: 5000
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("this transport does not exist")
    })

    it('delete a transport when id is positive number and exist in db', async () => {
        const response = await request(app).post('/transport/delete-transport').send({
            id: 1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Delete transport successfully")
    })
})