const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {
    userOne,
    userOneId,
    userOneAuthToken,
    setupDatabase
} = require('./fixtures/db')


beforeEach(setupDatabase)

test('should sigup a new user', async ()=>{
    const response = await request(app)
      .post("/users")
      .send({
        name: "janet",
        email: "janet@email.com",
        password: "lalaland",
      })
      .expect(201);

    // assert that the database was change correctly
    const user = User.findById(response.body._id)
    expect(user).not.toBeNull


})

test('should login existed user', async ()=>{
    const res = await request(app).post('/users/login').send({
        email: 'mike@email.com',
        password:'lalaland'
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(res.body.token).toBe(user.tokens[1].token);
})

test('should not login not existed user', async ()=>{
    await request(app).post('/user/login').send({
        email: 'notexisted@email.com',
        password: 'randompssw'
    }).expect(404)
})

test('should return user profile', async ()=>{
    await request(app)
      .get("/users/me")
      .set("authorization", userOneAuthToken)
      .send()
      .expect(200);

})

test('should not return profile for unauthenticate user', async ()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('should not delete account for unauthenticate user', async ()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('should delete account for authenticate user', async ()=>{
    await request(app)
      .delete("/users/me")
      .set("authorization", userOneAuthToken)
      .send()
      .expect(200);

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should upload profile picture', async ()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('authorization', userOneAuthToken)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update user info', async ()=>{
    await request(app)
    .patch('/users/me')
    .set('authorization', userOneAuthToken)
    .send({
        name: 'mike2'
    }).expect(200)

    const user = await User.findById(userOneId);
    expect(user.name).toBe('mike2')
})

test('should not update invalid user field', async()=>{
    await request(app)
    .patch('/users/me')
    .set('authorization', userOneAuthToken)
    .send({
        location: 'hanoi'
    })
    .expect(400)
})