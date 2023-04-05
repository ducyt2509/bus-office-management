const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../server')



const request = require('supertest');
const app = require('../server')

describe('get list location', () => {
    it('get list location when all attribute are null ', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: null,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list location when all attribute are null and limit is "" ', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: "",
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list location when all attribute are null and limit is string ', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: "abc",
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list location when all attribute are null and limit is negative number ', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: -1,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })


    it('get list location when all attribute are null and limit is positive number ', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: 3,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list location when all attribute have validated value', async () => {
        const response = await request(app).post('/location/list-location').send({
            limit: 3,
            offset: 0,
            query_search: "a"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })
})

describe('get location by id ', () => {
    it('get location when location id is null  ', async () => {
        const response = await request(app).post('/location/location-by-id').send({
            id: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get location when location id is ""  ', async () => {
        const response = await request(app).post('/location/location-by-id').send({
            id: ""
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get location when location id is string  ', async () => {
        const response = await request(app).post('/location/location-by-id').send({
            id: "abc"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get location when location id is negative number  ', async () => {
        const response = await request(app).post('/location/location-by-id').send({
            id: -5
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get location when location id is positive  number but dont exist in db  ', async () => {
        const response = await request(app).post('/location/location-by-id').send({
            id: 5000
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get location when location id is positive  number but  exist in db  ', async () => {
        const response = await request(app).post('/location/location-by-id').send({
            id: 1
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

})


describe('create location', () => {
    it('create location when all attribute are null  ', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: null,
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("city_from_id and city_to_id are required")
    })

    it('create location when  all attribute are null and location name is "" ', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: "",
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("city_from_id and city_to_id are required")
    })

    it('create location when  all attribute are null and location name is string ', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: "abc",
            address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("city_from_id and city_to_id are required")
    })


    it('create location when  all attribute have validated values but exist one location in datebase has the same info ', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: "Số 1 Lê Hồng Phong Nam Định",
            address: "Số 1 Lê Hồng Phong Nam Định",
            city_id: 14,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This location  is already exists  in the database")
    })


    it('create location when  all attribute have validated values but dont exist in datebase  ', async () => {
        const response = await request(app).post('/location/add-location').send({
            location_name: "Số 15 Lê Hồng Phong Nam Định",
            address: "Số 15 Lê Hồng Phong Nam Định",
            city_id: 14,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Create location ")
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

describe('delete location', () => {
    it('delete a location when id is null ', async () => {
        const response = await request(app).post('/location/delete-location').send({
            id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id is required")
    })

    it('delete a location when id is "" ', async () => {
        const response = await request(app).post('/location/delete-location').send({
            id: ""
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id is required")
    })

    it('delete a location when id is string ', async () => {
        const response = await request(app).post('/location/delete-location').send({
            id: "abc"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })


    it('delete a location when id is negative number ', async () => {
        const response = await request(app).post('/location/delete-location').send({
            id: -1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed ")
    })

    it('delete a location when id is positive number but does not exist in db', async () => {
        const response = await request(app).post('/location/delete-location').send({
            id: 5000
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("this location does not exist")
    })

    it('delete a location when id is positive number and exist in db', async () => {
        const response = await request(app).post('/location/delete-location').send({
            id: 1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Delete location successfully")
    })
})