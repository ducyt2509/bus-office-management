const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../server')



const request = require('supertest');
const app = require('../server')

describe('get list office', () => {
    it('get list office when all attribute are null ', async () => {
        const response = await request(app).post('/office/list-office').send({
            limit: null,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list office when all attribute are null and limit is "" ', async () => {
        const response = await request(app).post('/office/list-office').send({
            limit: "",
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list office when all attribute are null and limit is string ', async () => {
        const response = await request(app).post('/office/list-office').send({
            limit: "abc",
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list office when all attribute are null and limit is negative number ', async () => {
        const response = await request(app).post('/office/list-office').send({
            limit: -1,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })


    it('get list office when all attribute are null and limit is positive number ', async () => {
        const response = await request(app).post('/office/list-office').send({
            limit: 3,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list office when all attribute have validated value', async () => {
        const response = await request(app).post('/office/list-office').send({
            limit: 3,
            offset: 0,
            query_search: "a"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })
})

describe('get office by id ', () => {
    it('get office when office id is null  ', async () => {
        const response = await request(app).post('/office/office-by-id').send({
            id: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get office when office id is ""  ', async () => {
        const response = await request(app).post('/office/office-by-id').send({
            id: ""
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get office when office id is string  ', async () => {
        const response = await request(app).post('/office/office-by-id').send({
            id: "abc"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get office when office id is negative number  ', async () => {
        const response = await request(app).post('/office/office-by-id').send({
            id: -5
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get office when office id is positive  number but dont exist in db  ', async () => {
        const response = await request(app).post('/office/office-by-id').send({
            id: 5000
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get office when office id is positive  number but  exist in db  ', async () => {
        const response = await request(app).post('/office/office-by-id').send({
            id: 1
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

})


describe('create office', () => {
    it('create office when all attribute are null  ', async () => {
        const response = await request(app).post('/office/add-office').send({
            office_name: null,
            office_address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("city_from_id and city_to_id are required")
    })

    it('create office when  all attribute are null and office name is "" ', async () => {
        const response = await request(app).post('/office/add-office').send({
            office_name: "",
            office_address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("city_from_id and city_to_id are required")
    })

    it('create office when  all attribute are null and office name is string ', async () => {
        const response = await request(app).post('/office/add-office').send({
            office_name: "abc",
            office_address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("city_from_id and city_to_id are required")
    })


    it('create office when  all attribute have validated values but exist one office in datebase has the same info ', async () => {
        const response = await request(app).post('/office/add-office').send({
            office_name: "Số 1 Lê Hồng Phong Nam Định",
            office_address: "Số 1 Lê Hồng Phong Nam Định",
            city_id: 14,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This office  is already exists  in the database")
    })


    it('create office when  all attribute have validated values but dont exist in datebase  ', async () => {
        const response = await request(app).post('/office/add-office').send({
            office_name: "Số 15 Lê Hồng Phong Nam Định",
            office_address: "Số 15 Lê Hồng Phong Nam Định",
            city_id: 14,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Create office ")
    })

})

describe('update office', () => {
    it('update office when all attribute are null  ', async () => {
        const response = await request(app).post('/office/update-office').send({
            id: null,
            office_name: null,
            office_address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update office when all attribute are null and id is ""', async () => {
        const response = await request(app).post('/office/update-office').send({
            id: "",
            office_name: null,
            office_address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update office when all attribute are null and id is string', async () => {
        const response = await request(app).post('/office/update-office').send({
            id: "ab",
            office_name: null,
            office_address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })
    it('update office when all attribute are null and id is negative number ', async () => {
        const response = await request(app).post('/office/update-office').send({
            id: -10,
            office_name: null,
            office_address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update office when all attribute are null and id is positive number', async () => {
        const response = await request(app).post('/office/update-office').send({
            id: 1,
            office_name: null,
            office_address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('update office when all attribute have validated values and id is not exist in db', async () => {
        const response = await request(app).post('/office/update-office').send({
            id: 1000,
            office_name: null,
            office_address: null,
            city_id: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This office is not exist in db")
    })

    it('update office when all attribute have validated values and id is  exist but input office info that want update is exist in db  ', async () => {
        const response = await request(app).post('/office/update-office').send({
            id: 1,
            office_name: "Số 1 Lê Hồng Phong Nam Định",
            office_address: "Số 1 Lê Hồng Phong Nam Định",
            city_id: 14,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed !")
    })

    it('update office when all attribute have validated values and id is  exist but input office info that want update is not exist in db ', async () => {
        const response = await request(app).post('/office/update-office').send({
            id: 1,
            office_name: "Số 12 Điện Biên Phủ Nam Định",
            office_address: "Số 12 Điện Biên Phủ Nam Định",
            city_id: 14,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Update successfully !")
    })



})

describe('delete office', () => {
    it('delete a office when id is null ', async () => {
        const response = await request(app).post('/office/delete-office').send({
            id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id is required")
    })

    it('delete a office when id is "" ', async () => {
        const response = await request(app).post('/office/delete-office').send({
            id: ""
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id is required")
    })

    it('delete a office when id is string ', async () => {
        const response = await request(app).post('/office/delete-office').send({
            id: "abc"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })


    it('delete a office when id is negative number ', async () => {
        const response = await request(app).post('/office/delete-office').send({
            id: -1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed ")
    })

    it('delete a office when id is positive number but does not exist in db', async () => {
        const response = await request(app).post('/office/delete-office').send({
            id: 5000
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("this office does not exist")
    })

    it('delete a office when id is positive number and exist in db', async () => {
        const response = await request(app).post('/office/delete-office').send({
            id: 1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Delete office successfully")
    })
})