
describe('login', () => {
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

    it('login when has user is null  and password has value ', async () => {
        const response = await request(app).post('/login').send({
            user: null,
            password: "bean"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user is null  and password is exist in database ', async () => {
        const response = await request(app).post('/login').send({
            user: null,
            password: "duc25092000"
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

    it('login when has user is "" and password has value  ', async () => {
        const response = await request(app).post('/login').send({
            user: "",
            password: "bena"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user is "" and password is exist in database  ', async () => {
        const response = await request(app).post('/login').send({
            user: "",
            password: "duc25092000"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user has value and password is "" , but user is not exist in db  ', async () => {
        const response = await request(app).post('/login').send({
            user: "bean",
            password: ""
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user has value and password is null , but user is not exist in db ', async () => {
        const response = await request(app).post('/login').send({
            user: "bean",
            password: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user and password have values , but user and pass are not exist in db ', async () => {
        const response = await request(app).post('/login').send({
            user: "bean",
            password: "bean"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user and password have values , but user is not exist and password is exist in db ', async () => {
        const response = await request(app).post('/login').send({
            user: "bean",
            password: "duc25092000"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("User and password can not empty")
    })

    it('login when has user has value and password is null  , user exist in db ', async () => {
        const response = await request(app).post('/login').send({
            user: "+8444321602",
            password: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Login successful!")
    })

    it('login when has user has value and password is ""  , user is exist in db ', async () => {
        const response = await request(app).post('/login').send({
            user: "+8444321602",
            password: ""
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Login successful!")
    })


    it('login when has user and password have values  ,but  user is exist and password is not exist in db ', async () => {
        const response = await request(app).post('/login').send({
            user: "+8444321602",
            password: "bean"
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Login successful!")
    })


    it('login when has user and password have values  ,but  user and password are exist in db ', async () => {
        const response = await request(app).post('/login').send({
            user: "+8444321602",
            password: ""
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Login successful!")
    })
});
describe('Get List User', () => {
    it('get user data when all attributes are null', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: null,
            page: null,
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })


    it('get user data when all attributes are null and offset is ""', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: "",
            page: null,
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })

    it('get user data when all attributes are null and offset is string', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: "abc",
            page: null,
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })


    it('get user data when all attributes are null and offset is negative number', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: -1,
            page: null,
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })

    it('get user data when all attributes are null and offset is positive number', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: 1,
            page: null,
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })


    it('get user data when all attributes are null and page is ""', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: null,
            page: "",
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })

    it('get user data when all attributes are null and page is string ', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: null,
            page: "abc",
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })

    it('get user data when all attributes are null and page is positive number', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: null,
            page: 1,
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })


    it('get user data when all attributes are null and page is negative number ', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: null,
            page: -1,
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })

    it('get user data when all attributes are null and role_id is ""', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: null,
            page: null,
            role_id: "",
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })

    it('get user data when all attributes are null and page is string ', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: null,
            page: null,
            role_id: "admin",
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })

    it('get user data when all attributes are null and page is positive number', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: null,
            page: null,
            role_id: 1,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })


    it('get user data when all attributes are null and page is negative number ', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: null,
            page: null,
            role_id: -1,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })


    it('get user data when all attributes are null and page is negative number ', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: null,
            offset: null,
            page: null,
            role_id: -1,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })

    it('get user data when all attributes are null and limit is "" ', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: "",
            offset: null,
            page: null,
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })

    it('get user data when all attributes are null and limit is string ', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: "abc",
            offset: null,
            page: null,
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })

    it('get user data when all attributes are null and limit is positive number ', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: 1,
            offset: null,
            page: null,
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })

    it('get user data when all attributes are null and limit is negative number ', async () => {
        const response = await request(app).post('/user/list-user').send({
            limit: -1,
            offset: null,
            page: null,
            role_id: null,
        })
        console.log(response.body.data.number_user)
        expect(response.statusCode).toBe(200)
        expect(response.body.data.list_user.length).toBe(7)
        expect(response.body.data.number_user).toBe(9)
    })



});
describe('Create new user', () => {

    it('create new user when all attribute are null', async () => {
        const response = await request(app).post('/user/add-user').send({
            user_name: null,
            email: null,
            password: null,
            phone: null,
            avatar: null,
            role_id: null,
            office_id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed")
    })
    it('create new user when all attribute are null and user_name is "" ', async () => {
        const response = await request(app).post('/user/add-user').send({
            user_name: "",
            email: null,
            password: null,
            phone: null,
            avatar: null,
            role_id: null,
            office_id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed")
    })
    it('create new user when all attribute are null and user_name is string', async () => {
        const response = await request(app).post('/user/add-user').send({
            user_name: "abc",
            email: null,
            password: null,
            phone: null,
            avatar: null,
            role_id: null,
            office_id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed")
    })
    it('create new user when all attribute are null and user_name is negative number ', async () => {
        const response = await request(app).post('/user/add-user').send({
            user_name: -10,
            email: null,
            password: null,
            phone: null,
            avatar: null,
            role_id: null,
            office_id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed")
    })
    it('create new user when all attribute are null and user_name is positive number ', async () => {
        const response = await request(app).post('/user/add-user').send({
            user_name: 10,
            email: null,
            password: null,
            phone: null,
            avatar: null,
            role_id: null,
            office_id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed")
    })
    it('create new user when all attribute are validated', async () => {
        const response = await request(app).post('/user/add-user').send({
            user_name: "Tran Van Duc",
            email: "ducyt2509@gmail.com",
            password: "duc25092000",
            phone: "+84944321602",
            avatar: null,
            role_id: 1,
            office_id: 1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed")
    })
});
describe('update user', () => {

    it('update user when all attribute are null', async () => {
        const response = await request(app).post('/user/update-user').send({
            user_name: null,
            email: null,
            password: null,
            phone: null,
            avatar: null,
            role_id: null,
            office_id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed")
    })
    it('update user when all attribute are null and user_name is "" ', async () => {
        const response = await request(app).post('/user/update-user').send({
            user_name: "",
            email: null,
            password: null,
            phone: null,
            avatar: null,
            role_id: null,
            office_id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed")
    })
    it('update user when all attribute are null and user_name is string', async () => {
        const response = await request(app).post('/user/update-user').send({
            user_name: "abc",
            email: null,
            password: null,
            phone: null,
            avatar: null,
            role_id: null,
            office_id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed")
    })
    it('update user when all attribute are null and user_name is negative number ', async () => {
        const response = await request(app).post('/user/update-user').send({
            user_name: -10,
            email: null,
            password: null,
            phone: null,
            avatar: null,
            role_id: null,
            office_id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed")
    })
    it('update user when all attribute are null and user_name is positive number ', async () => {
        const response = await request(app).post('/user/update-user').send({
            user_name: 10,
            email: null,
            password: null,
            phone: null,
            avatar: null,
            role_id: null,
            office_id: null
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed")
    })
    it('update user when all attribute is validated ', async () => {
        const response = await request(app).post('/user/update-user').send({
            user_name: "Tran Van Duc",
            email: "ducyt2509@gmail.com",
            password: "duc25092000",
            phone: "+84944321602",
            avatar: null,
            role_id: 1,
            office_id: 1
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed")
    })
});
describe("delete user ", () => {
    it("delete user when user id is '' ", async () => {
        const response = await request(app).post('/user/delete-user').send({
            user_id: "",
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed!")
    })

    it("delete user when user id is null", async () => {
        const response = await request(app).post('/user/delete-user').send({
            user_id: null,
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed!")
    })

    it("delete user when user id is string ", async () => {
        const response = await request(app).post('/user/delete-user').send({
            user_id: "abc",
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed!")
    })

    it("delete user when user id is negative number", async () => {
        const response = await request(app).post('/user/delete-user').send({
            user_id: -10,
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed!")
    })


    it("delete user when user id is positive number but user id is not exist in db ", async () => {
        const response = await request(app).post('/user/delete-user').send({
            user_id: 10000,
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("User id is not exist in db")
    })

    it("delete user when user id is positive number but user id is exist in db", async () => {
        const response = await request(app).post('/user/delete-user').send({
            user_id: 9,
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Delete user successful")
    })
})
describe("get User Information", () => {
    it("get user information when user id is '' ", async () => {
        const response = await request(app).post('/user/user-by-id').send({
            user_id: "",
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed!")
    })

    it("get user information when user id is null", async () => {
        const response = await request(app).post('/user/user-by-id').send({
            user_id: null,
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed!")
    })

    it("get user information when user id is string ", async () => {
        const response = await request(app).post('/user/user-by-id').send({
            user_id: "abc",
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed!")
    })

    it("get user information when user id is negative number", async () => {
        const response = await request(app).post('/user/user-by-id').send({
            user_id: -10,
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("Validation input data failed!")
    })


    it("get user information when user id is positive number but user id is not exist in db ", async () => {
        const response = await request(app).post('/user/user-by-id').send({
            user_id: 10000,
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("User id is not exist in db")
    })


    it("get user information when user id is positive number but user id is exist in db", async () => {
        const response = await request(app).post('/user/user-by-id').send({
            user_id: 9,
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.data.message).toBe("")
    })
})

