import request from "supertest";
import app from "../app";

jest.mock("../services/auth.service.ts");

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register successfully", async () => {
    const mockUsers = {
      status: "success",
      data: {
        email: "w.jamesdevera@gmail.com",
        password: "winfrey",
        confirmPassword: "winfrey",
        phoneNumber: "+63 97658108388",
      },
    };
    const response = await request(app).post("/api/auth/register").send({
      firstName: "winfrey",
      lastName: "de vera",
      phoneNumber: "+63 97658108388",
      password: "winfrey",
      confirmPassword: "winfrey",
      email: "w.jamesdevera@gmail.com",
    });
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });
});
