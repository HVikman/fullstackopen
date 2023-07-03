/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    username:
    'dsgtitesti',
    name:
    'he',
    passwordHash:
    '$2a$10$1fHuNFe/OvSjn5ggwK7FLutHUSqF8bRLCGe81v4TKn13DxtL4P1ie'
  },
  {
    username:
    'dsaa',
    name:
    'a',
    passwordHash:
    '$2a$10$x5STdc.BVmpfDe5lPVKUiubYnfU4vdHmLMWTo.ochttfe8ZEjDUAy'
  },
]

beforeEach(async () => {
  await User.deleteMany({})
  let UserObject = new User(initialUsers[0])
  await UserObject.save()
  UserObject = new User(initialUsers[1])
  await UserObject.save()
})

describe('get', () => {
  test('2 users in database', async () => {
    const res= await api.get('/api/users')
    expect(res.body).toHaveLength(2)
  })
})

describe('create user', () => {
  test('adding user', async () => {
    const user = { name: 'Joh', username: 'John', password:'password' }

    const res = await api.post('/api/users').send(user).expect(201)
    expect(res.body.username).toBe('John')

  })
  test('short password', async () => {
    const user = { name: 'John', username: 'John', password:'pa' }
    const res = await api.post('/api/users').send(user).expect(400)
    expect(res.body.error).toContain('Password has to be atleast 3 characters')
  })

  test('missing/too short username or name', async () => {
    const user1 = { name: 'John', username: '', password:'password' }
    const user2 = { name: 'John', username: 'Jo', password:'password' }
    const user3 = { name: '', username: 'John', password:'password' }

    let res = await api.post('/api/users').send(user1).expect(400)
    expect(res.body.error).toContain('Path `username` is required')
    res = await api.post('/api/users').send(user2).expect(400)
    expect(res.body.error).toContain('shorter than the minimum allowed length')

    res = await api.post('/api/users').send(user3).expect(400)
    expect(res.body.error).toContain('Path `name` is required')
  })


})