// Polyfill TextEncoder/TextDecoder when Jest setupFiles are not applied
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

const request = require('supertest');

const { MongoMemoryServer } = require('mongodb-memory-server');
let mongod;
let app;

// Increase jest timeout for DB setup
jest.setTimeout(30000);

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();

  // Connect DB using project's connect helper, then require the app
  const dbModule = require('../../../../../backend/config/db');
  const connectDB = typeof dbModule === 'function' ? dbModule : dbModule.connectDB;
  await connectDB();

  app = require('../../../../../backend/app');
});

afterAll(async () => {
  const mongoose = require('mongoose');
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

describe('GET USERS', () => {
  it('should return users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
  }, 20000);
});