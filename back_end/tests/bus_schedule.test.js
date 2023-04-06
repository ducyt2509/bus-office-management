const request = require('supertest');
const app = require('../server')

describe('get list bus-schedule', () => {
    it('get list bus-schedule when all attribute are null ', async () => {
        const response = await request(app).post('/bus-schedule/list-bus-schedule').send({
            limit: null,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list bus-schedule when all attribute are null and limit is "" ', async () => {
        const response = await request(app).post('/bus-schedule/list-bus-schedule').send({
            limit: "",
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list bus-schedule when all attribute are null and limit is string ', async () => {
        const response = await request(app).post('/bus-schedule/list-bus-schedule').send({
            limit: "abc",
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list bus-schedule when all attribute are null and limit is negative number ', async () => {
        const response = await request(app).post('/bus-schedule/list-bus-schedule').send({
            limit: -1,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })


    it('get list bus-schedule when all attribute are null and limit is positive number ', async () => {
        const response = await request(app).post('/bus-schedule/list-bus-schedule').send({
            limit: 3,
            offset: null,
            query_search: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get list bus-schedule when all attribute have validated value', async () => {
        const response = await request(app).post('/bus-schedule/list-bus-schedule').send({
            limit: 3,
            offset: 0,
            query_search: "a"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })
})

describe('get bus-schedule by id ', () => {
    it('get bus-schedule when bus-schedule id is null  ', async () => {
        const response = await request(app).post('/bus-schedule/bus-schedule-by-id').send({
            id: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get bus-schedule when bus-schedule id is ""  ', async () => {
        const response = await request(app).post('/bus-schedule/bus-schedule-by-id').send({
            id: ""
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get bus-schedule when bus-schedule id is string  ', async () => {
        const response = await request(app).post('/bus-schedule/bus-schedule-by-id').send({
            id: "abc"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get bus-schedule when bus-schedule id is negative number  ', async () => {
        const response = await request(app).post('/bus-schedule/bus-schedule-by-id').send({
            id: -5
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get bus-schedule when bus-schedule id is positive  number but dont exist in db  ', async () => {
        const response = await request(app).post('/bus-schedule/bus-schedule-by-id').send({
            id: 5000
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

    it('get bus-schedule when bus-schedule id is positive  number but  exist in db  ', async () => {
        const response = await request(app).post('/bus-schedule/bus-schedule-by-id').send({
            id: 1
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("")
    })

})


describe('create bus-schedule', () => {
    it('create bus-schedule when all attribute are null  ', async () => {
        const response = await request(app).post('/bus-schedule/add-bus-schedule').send({
            route_id: null,
            price: null,
            time_from: null,
            travel_time: null,
            departure_location_id: null,
            arrive_location_id: null,
            effective_date: null,
            refresh_date: null,
            bus_schedule_status: null,
            schedule_frequency: null,
            bus_schedule_expire: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create bus-schedule when  all attribute are null and route id is "" ', async () => {
        const response = await request(app).post('/bus-schedule/add-bus-schedule').send({
            route_id: "",
            price: null,
            time_from: null,
            travel_time: null,
            departure_location_id: null,
            arrive_location_id: null,
            effective_date: null,
            refresh_date: null,
            bus_schedule_status: null,
            schedule_frequency: null,
            bus_schedule_expire: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create bus-schedule when  all attribute are null and route id is string ', async () => {
        const response = await request(app).post('/bus-schedule/add-bus-schedule').send({
            route_id: "abc",
            price: null,
            time_from: null,
            travel_time: null,
            departure_location_id: null,
            arrive_location_id: null,
            effective_date: null,
            refresh_date: null,
            bus_schedule_status: null,
            schedule_frequency: null,
            bus_schedule_expire: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })
    it('create bus-schedule when  all attribute are null and route id is number ', async () => {
        const response = await request(app).post('/bus-schedule/add-bus-schedule').send({
            route_id: -1,
            price: null,
            time_from: null,
            travel_time: null,
            departure_location_id: null,
            arrive_location_id: null,
            effective_date: null,
            refresh_date: null,
            bus_schedule_status: null,
            schedule_frequency: null,
            bus_schedule_expire: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create bus-schedule when  all attribute are have validated value  and route id is negative number ', async () => {
        const response = await request(app).post('/bus-schedule/add-bus-schedule').send({
            route_id: -1,
            price: 30000,
            time_from: 7.5,
            travel_time: 3.5,
            departure_location_id: 1,
            arrive_location_id: 9,
            effective_date: '2023-03-23',
            refresh_date: '2023-03-23',
            bus_schedule_status: 1,
            schedule_frequency: 1,
            bus_schedule_expire: 7,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })

    it('create bus-schedule when  all attribute are have validated value  and route id is positive number and  route id is  exist in db but there is one bus schedule has the same information (route_id , time_from , refresh_date , freq) ', async () => {
        const response = await request(app).post('/bus-schedule/add-bus-schedule').send({
            route_id: 5000,
            price: 30000,
            time_from: 7.5,
            travel_time: 3.5,
            departure_location_id: 1,
            arrive_location_id: 9,
            effective_date: '2023-03-23',
            refresh_date: '2023-03-23',
            bus_schedule_status: 1,
            schedule_frequency: 1,
            bus_schedule_expire: 7,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This bus schedule is already exist in db")
    })

    it('create bus-schedule when  all attribute are have validated value and dont exist in db ', async () => {
        const response = await request(app).post('/bus-schedule/add-bus-schedule').send({
            route_id: 1,
            price: 30000,
            time_from: 7.5,
            travel_time: 3.5,
            departure_location_id: 1,
            arrive_location_id: 9,
            effective_date: '2023-03-27',
            refresh_date: '2023-03-27',
            bus_schedule_status: 1,
            schedule_frequency: 1,
            bus_schedule_expire: 7,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("this bus-schedule is already existing in db")
    })



})

describe('update bus-schedule', () => {
    it('update bus-schedule when all attribute are null  ', async () => {
        const response = await request(app).post('/bus-schedule/update-bus-schedule').send({
            route_id: null,
            price: null,
            time_from: null,
            travel_time: null,
            departure_location_id: null,
            arrive_location_id: null,
            effective_date: null,
            refresh_date: null,
            bus_schedule_status: null,
            schedule_frequency: null,
            bus_schedule_expire: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id , Validate failed")
    })

    it('update bus-schedule when  id is "" , city_from_id and city_to_id  are null ', async () => {
        const response = await request(app).post('/bus-schedule/update-bus-schedule').send({
            route_id: "",
            price: null,
            time_from: null,
            travel_time: null,
            departure_location_id: null,
            arrive_location_id: null,
            effective_date: null,
            refresh_date: null,
            bus_schedule_status: null,
            schedule_frequency: null,
            bus_schedule_expire: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id , Validate failed")
    })

    it('update bus-schedule when id is string , city_from_id and city_to_id  are null ', async () => {
        const response = await request(app).post('/bus-schedule/update-bus-schedule').send({
            route_id: "abc",
            price: null,
            time_from: null,
            travel_time: null,
            departure_location_id: null,
            arrive_location_id: null,
            effective_date: null,
            refresh_date: null,
            bus_schedule_status: null,
            schedule_frequency: null,
            bus_schedule_expire: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id , Validate failed")
    })
    it('update bus-schedule when id is negative number , city_from_id and city_to_id  are null', async () => {
        const response = await request(app).post('/bus-schedule/update-bus-schedule').send({
            route_id: -1,
            price: null,
            time_from: null,
            travel_time: null,
            departure_location_id: null,
            arrive_location_id: null,
            effective_date: null,
            refresh_date: null,
            bus_schedule_status: null,
            schedule_frequency: null,
            bus_schedule_expire: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id , Validate failed")
    })

    it('update bus-schedule when id is positive number, city_from_id and city_to_id  are null ', async () => {
        const response = await request(app).post('/bus-schedule/update-bus-schedule').send({
            route_id: 10,
            price: null,
            time_from: null,
            travel_time: null,
            departure_location_id: null,
            arrive_location_id: null,
            effective_date: null,
            refresh_date: null,
            bus_schedule_status: null,
            schedule_frequency: null,
            bus_schedule_expire: null,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id , Validate failed")
    })

    it('create bus-schedule when city_from_id and city_to_id  have validated values and id is positive number but does not exist in db ', async () => {
        const response = await request(app).post('/bus-schedule/update-bus-schedule').send({
            route_id: 10000,
            price: 30000,
            time_from: 7.5,
            travel_time: 3.5,
            departure_location_id: 1,
            arrive_location_id: 9,
            effective_date: '2023-03-27',
            refresh_date: '2023-03-27',
            bus_schedule_status: 1,
            schedule_frequency: 1,
            bus_schedule_expire: 7,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This bus-schedule is not exist in db")
    })

    it('create bus-schedule when city_from_id and city_to_id  have validated values and id is negative number ', async () => {
        const response = await request(app).post('/bus-schedule/update-bus-schedule').send({
            route_id: -1,
            price: 30000,
            time_from: 7.5,
            travel_time: 3.5,
            departure_location_id: 1,
            arrive_location_id: 9,
            effective_date: '2023-03-27',
            refresh_date: '2023-03-27',
            bus_schedule_status: 1,
            schedule_frequency: 1,
            bus_schedule_expire: 7,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed !")
    })

    it('update a bus-schedule when city_from_id and city_to_id have validated values and id is positive and exists in DB but a bus-schedule like this exists ', async () => {
        const response = await request(app).post('/bus-schedule/update-bus-schedule').send({
            route_id: 1,
            price: 30000,
            time_from: 7.5,
            travel_time: 3.5,
            departure_location_id: 1,
            arrive_location_id: 9,
            effective_date: '2023-03-27',
            refresh_date: '2023-03-27',
            bus_schedule_status: 1,
            schedule_frequency: 1,
            bus_schedule_expire: 7,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("This bus-schedule is already exists in DB")
    })

    it('update a bus-schedule when city_from_id and city_to_id have validated values and id is positive and id exists in DB but there is no bus-schedule like this in db', async () => {
        const response = await request(app).post('/bus-schedule/update-bus-schedule').send({
            route_id: 1,
            price: 30000,
            time_from: 7.5,
            travel_time: 3.5,
            departure_location_id: 1,
            arrive_location_id: 9,
            effective_date: '2023-05-25',
            refresh_date: '2023-05-25',
            bus_schedule_status: 1,
            schedule_frequency: 1,
            bus_schedule_expire: 7,
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Update bus-schedule successful")
    })

})

describe('delete bus-schedule', () => {
    it('delete a bus-schedule when id is null ', async () => {
        const response = await request(app).post('/bus-schedule/delete-bus-schedule').send({
            id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id is required")
    })

    it('delete a bus-schedule when id is "" ', async () => {
        const response = await request(app).post('/bus-schedule/delete-bus-schedule').send({
            id: ""
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("id is required")
    })

    it('delete a bus-schedule when id is string ', async () => {
        const response = await request(app).post('/bus-schedule/delete-bus-schedule').send({
            id: "abc"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed")
    })


    it('delete a bus-schedule when id is negative number ', async () => {
        const response = await request(app).post('/bus-schedule/delete-bus-schedule').send({
            id: -1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validate failed ")
    })

    it('delete a bus-schedule when id is positive number but does not exist in db', async () => {
        const response = await request(app).post('/bus-schedule/delete-bus-schedule').send({
            id: 5000
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("this bus-schedule does not exist")
    })

    it('delete a bus-schedule when id is positive number and exist in db', async () => {
        const response = await request(app).post('/bus-schedule/delete-bus-schedule').send({
            id: 1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Delete bus-schedule successfully")
    })
})