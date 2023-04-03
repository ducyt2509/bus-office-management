const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../server')

// describe('Get List User', () => {
//     it('get user data when missing all attributes', async () => {
//         const response = await request(app).post('/user/list-user').send({})
//         console.log(response.body.data.number_user)
//         expect(response.statusCode).toBe(200)
//         expect(response.body.data.list_user.length).toBe(7)
//         expect(response.body.data.number_user).toBe(9)
//     })


//     it('get user data with an attribute limit', async () => {
//         const response = await request(app).post('/user/list-user').send({
//             limit: 10
//         })
//         expect(response.statusCode).toBe(200)
//         expect(response.body.data.list_user.length).toBe(9)
//         expect(response.body.data.number_user).toBe(9)
//     })
//     it('get user data with wrong value of attribute limit', async () => {
//         const response = await request(app).post('/user/list-user').send({
//             limit: -10
//         })
//         expect(response.statusCode).toBe(400)
//         expect(response.body.message).toBe('')
//         expect(response.body.data.number_user).toBe(9)
//     })
//     it('get user data with an attribute offset', async () => {
//         const response = await request(app).post('/user/list-user').send({
//             "offset": 0
//         })
//         console.log(response.body.data)
//         expect(response.statusCode).toBe(200)
//         expect(response.body.data.list_user.length).toBe(9)
//         expect(response.body.data.number_user).toBe(9)
//     })

//     it('get user data with wrong value of attribute offset', async () => {
//         const response = await request(app).post('/user/list-user').send({
//             "offset": 0
//         })
//         console.log(response.body.data)
//         expect(response.statusCode).toBe(200)
//         expect(response.body.data.list_user.length).toBe(9)
//         expect(response.body.data.number_user).toBe(9)
//     })



//     it('get user data with search query', async () => {
//         const response = await request(app).post('/user/list-user').send({
//             query_search: "duc"
//         })
//         expect(response.statusCode).toBe(200)
//         expect(response.body.data.list_user.length).toBe(1)
//         expect(response.body.data.number_user).toBe(1)
//     })


//     it('get user data with all attributes', async () => {
//         const response = await request(app).post('/user/list-user').send({
//             limit: 10,
//             offset: 0,
//             query_search: "duc"
//         })
//         expect(response.statusCode).toBe(200)
//         expect(response.body.data.list_user.length).toBe(1)
//         expect(response.body.data.number_user).toBe(1)
//     })
// });


// describe('Create new user', () => {
//     it('create new user when missing all attribute ', async () => {
//         const response = await request(app).post('/user/add-user').send({})
//         expect(response.statusCode).toBe(400)
//         expect(response.body.data.number_user).toBe(9)
//     })

//     it('create new user when missing all attribute ', async () => {
//         const response = await request(app).post('/user/add-user').send({
//             user_name: "bean",
//             user_name: "upchh@example.com",
//             user_name: "123456",
//             phone: "0944321602",
//             avatar: "aaaa",
//             role_id: 1
//         })
//         expect(response.statusCode).toBe(400)
//         expect(response.message).toBe(7)
//         expect(response.body.data.number_user).toBe(9)
//     })
// });



describe('login', () => {
    it('login when missing all attribute ', async () => {
        const response = await request(app).post('/login').send({})
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when user is null ', async () => {
        const response = await request(app).post('/login').send({
            user: null,
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when user is "" ', async () => {
        const response = await request(app).post('/login').send({
            user: ""
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when password is null ', async () => {
        const response = await request(app).post('/login').send({
            password: null,
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when password is "" ', async () => {
        const response = await request(app).post('/login').send({
            password: ""
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when user has value ', async () => {
        const response = await request(app).post('/login').send({
            user: "bean"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user and password are null  ', async () => {
        const response = await request(app).post('/login').send({
            user: null,
            password: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user is null and password is ""  ', async () => {
        const response = await request(app).post('/login').send({
            user: null,
            password: ""
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user is "" and password is null  ', async () => {
        const response = await request(app).post('/login').send({
            user: "",
            password: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user and password are ""  ', async () => {
        const response = await request(app).post('/login').send({
            user: "",
            password: ""
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user has value and password is ""  ', async () => {
        const response = await request(app).post('/login').send({
            user: "bean",
            password: ""
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user has value and password is null ', async () => {
        const response = await request(app).post('/login').send({
            user: "bean",
            password: null
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user is null  and password has value ', async () => {
        const response = await request(app).post('/login').send({
            user: null,
            password: "bean"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user is ""  and password has value ', async () => {
        const response = await request(app).post('/login').send({
            user: "",
            password: "bean"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user and password have values but do not exist ', async () => {
        const response = await request(app).post('/login').send({
            user: "bean",
            password: "bean"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("User not exist")
    })

    it('login when has user and password have values  , user exist in db ', async () => {
        const response = await request(app).post('/login').send({
            user: "0944321602",
            password: "duc1234"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Login successful!")
    })
});


describe('changePassword', () => {
    it('change when', async () => {
        const response = await request(app).post('/change-password').send({
            user: "0944321602",
            password: "duc1234"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Login successful!")
    })

})