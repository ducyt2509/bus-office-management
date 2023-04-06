const request = require('supertest');
const app = require('../server')

describe('get list route', () => {
    it('get list route when all attribute are null ', async () => {
        const response = await request(app).post('/route/list-route').send({
            limit: null,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list route when all attribute are null and limit is "" ', async () => {
        const response = await request(app).post('/route/list-route').send({
            limit: "",
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list route when all attribute are null and limit is string ', async () => {
        const response = await request(app).post('/route/list-route').send({
            limit: "abc",
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list route when all attribute are null and limit is negative number ', async () => {
        const response = await request(app).post('/route/list-route').send({
            limit: -1,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })


    it('get list route when all attribute are null and limit is positive number ', async () => {
        const response = await request(app).post('/route/list-route').send({
            limit: 3,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list route when all attribute have validated value', async () => {
        const response = await request(app).post('/route/list-route').send({
            limit: 3,
            offset: 0,
            query_search: "a"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })
})

describe('get route by id ', () => {
    it('get route when route id is null  ', async () => {
        const response = await request(app).post('/route/route-by-id').send({
            id: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get route when route id is ""  ', async () => {
        const response = await request(app).post('/route/route-by-id').send({
            id: ""
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get route when route id is string  ', async () => {
        const response = await request(app).post('/route/route-by-id').send({
            id: "abc"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get route when route id is negative number  ', async () => {
        const response = await request(app).post('/route/route-by-id').send({
            id: -5
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get route when route id is positive  number but dont exist in db  ', async () => {
        const response = await request(app).post('/route/route-by-id').send({
            id: 5000
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get route when route id is positive  number but  exist in db  ', async () => {
        const response = await request(app).post('/route/route-by-id').send({
            id: 1
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

})


describe('create route', () => {
    it('create route when all attribute are null  ', async () => {
        const response = await request(app).post('/route/add-route').send({
            city_from_id: null,
            city_to_id: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("city_from_id and city_to_id are required")
    })

    it('create route when  city_from_id is "" and city_to_id  is null ', async () => {
        const response = await request(app).post('/route/add-route').send({
            city_from_id: "",
            city_to_id: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("city_from_id and city_to_id are required")
    })

    it('create route when city_from_id is string and city_to_id  is null ', async () => {
        const response = await request(app).post('/route/add-route').send({
            city_from_id: "abc",
            city_to_id: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("city_from_id and city_to_id are required")
    })
    it('create route when city_from_id is negative number and city_to_id  is null ', async () => {
        const response = await request(app).post('/route/add-route').send({
            city_from_id: -1,
            city_to_id: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("city_from_id and city_to_id are required")
    })

    it('create route when city_from_id is positive number but dont exist in db and city_to_id  is null ', async () => {
        const response = await request(app).post('/route/add-route').send({
            city_from_id: 5000,
            city_to_id: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("city_from_id and city_to_id are required")
    })

    it('create route when city_from_id is positive number exist in db and city_to_id  is null ', async () => {
        const response = await request(app).post('/route/add-route').send({
            city_from_id: 1,
            city_to_id: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("city_from_id and city_to_id are required")
    })

    it('create route when city_from_id   and city_to_id have validated data and route exist in db ', async () => {
        const response = await request(app).post('/route/add-route').send({
            city_from_id: 1,
            city_to_id: 14
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("this route is already existing in db")
    })


    it('create route when city_from_id   and city_to_id have validated data and route exist in db ', async () => {
        const response = await request(app).post('/route/add-route').send({
            city_from_id: 1,
            city_to_id: 14
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Create route successful!")
    })
})

describe('update route', () => {
    it('update route when all attribute are null  ', async () => {
        const response = await request(app).post('/route/update-route').send({
            id: null,
            city_from_id: null,
            city_to_id: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id , city_from_id and city_to_id are required")
    })

    it('update route when  id is "" , city_from_id and city_to_id  are null ', async () => {
        const response = await request(app).post('/route/update-route').send({
            id: "",
            city_from_id: null,
            city_to_id: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id , city_from_id and city_to_id are required")
    })

    it('update route when id is string , city_from_id and city_to_id  are null ', async () => {
        const response = await request(app).post('/route/update-route').send({
            id: "abc",
            city_from_id: null,
            city_to_id: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id , city_from_id and city_to_id are required")
    })
    it('update route when id is negative number , city_from_id and city_to_id  are null', async () => {
        const response = await request(app).post('/route/update-route').send({
            id: -1,
            city_from_id: null,
            city_to_id: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id , city_from_id and city_to_id are required")
    })

    it('update route when id is positive number, city_from_id and city_to_id  are null ', async () => {
        const response = await request(app).post('/route/update-route').send({
            id: 10,
            city_from_id: null,
            city_to_id: null
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id , city_from_id and city_to_id are required")
    })

    it('create route when city_from_id and city_to_id  have validated values and id is positive number but does not exist in db ', async () => {
        const response = await request(app).post('/route/update-route').send({
            id: 5000,
            city_from_id: 1,
            city_to_id: 14
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This route is not exist in db")
    })

    it('create route when city_from_id and city_to_id  have validated values and id is negative number ', async () => {
        const response = await request(app).post('/route/update-route').send({
            id: -1,
            city_from_id: 1,
            city_to_id: 14
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed !")
    })

    it('create route when city_from_id and city_to_id  have validated values and id is "" ', async () => {
        const response = await request(app).post('/route/update-route').send({
            id: "",
            city_from_id: 1,
            city_to_id: 14
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed !")
    })



    it('update a route when city_from_id and city_to_id have validated values and id is positive and exists in DB but a route like this exists ', async () => {
        const response = await request(app).post('/route/update-route').send({
            id: 1,
            city_from_id: 1,
            city_to_id: 14
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This route is already exists in DB")
    })

    it('update a route when city_from_id and city_to_id have validated values and id is positive and id exists in DB but there is no route like this in db', async () => {
        const response = await request(app).post('/route/update-route').send({
            id: 1,
            city_from_id: 20,
            city_to_id: 14
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Update route successful")
    })

})

describe('delete route', () => {
    it('delete a route when id is null ', async () => {
        const response = await request(app).post('/route/delete-route').send({
            id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id is required")
    })

    it('delete a route when id is "" ', async () => {
        const response = await request(app).post('/route/delete-route').send({
            id: ""
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id is required")
    })

    it('delete a route when id is string ', async () => {
        const response = await request(app).post('/route/delete-route').send({
            id: "abc"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })


    it('delete a route when id is negative number ', async () => {
        const response = await request(app).post('/route/delete-route').send({
            id: -1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed ")
    })

    it('delete a route when id is positive number but does not exist in db', async () => {
        const response = await request(app).post('/route/delete-route').send({
            id: 5000
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("this route does not exist")
    })

    it('delete a route when id is positive number and exist in db', async () => {
        const response = await request(app).post('/route/delete-route').send({
            id: 1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Delete route successfully")
    })
})