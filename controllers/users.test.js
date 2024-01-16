import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import request from "supertest";
import jwt from "jsonwebtoken";

import app from "../app.js";
import { User } from "../models/User.js";

// 1. "enter correct login data => response statusCode = 200"
// 2. "enter correct login data => response contains token"
// 3."enter correct login data => response is an object user,
//  that contains 2 keys - 'email' and 'subscription' with data of string type"

const { TEST_DB_HOST, PORT, JWT_SECRET } = process.env;
console.log(TEST_DB_HOST);

describe("test/api/users/login", () => {
  let server = null;
  const userLogin = {
    email: "test@mail.com",
    password: "123456",
  };

  beforeAll(async () => {
    await mongoose.connect(TEST_DB_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(async () => {
    const password = await bcrypt.hash("123456", 10);
    const user = {
      email: "test@mail.com",
      password: password,
      subscription: "starter",
    };
    await User.create(user);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("enter correct login data => response statusCode = 200", async () => {
    const { statusCode } = await request(app)
      .post("/api/users/login")
      .send(userLogin);

    expect(statusCode).toBe(200);
  });

  test("enter correct login data => response contains token", async () => {
    const { body } = await request(app)
      .post("/api/users/login")
      .send(userLogin);
    const token = jwt.verify(body.token, JWT_SECRET);

    expect(typeof token).toBe("object");
  });

  test("enter correct login data => response is an object user, that contains 2 keys - 'email' and 'subscription' with data of string type", async () => {
    const { body } = await request(app)
      .post("/api/users/login")
      .send(userLogin);
    const { email, subscription } = body.user;

    expect(typeof email).toBe("string");
    expect(typeof subscription).toBe("string");
  });
});
