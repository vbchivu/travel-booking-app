// services/user-service/__tests__/auth.test.ts
import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { beforeEach, afterAll, describe, it, expect } from "@jest/globals";

beforeEach(async () => {
    await prisma.user.deleteMany(); // Clean up DB before each test
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe("Authentication API", () => {
    const testUser = { email: "test@example.com", password: "SecurePass123" };
    let refreshToken: string;
    let requestAgent: any;

    beforeAll(() => {
        requestAgent = request(app); // ✅ Use a typed request instance
    });

    it("should register a user", async () => {
        const res = await requestAgent.post("/api/auth/signup").send(testUser).expect(201);
        expect(res.body).toHaveProperty("userId");
    });

    it("should not allow duplicate user registration", async () => {
        await requestAgent.post("/api/auth/signup").send(testUser).expect(201);
        await requestAgent.post("/api/auth/signup").send(testUser).expect(409);
    });

    it("should authenticate user and return tokens", async () => {
        await requestAgent.post("/api/auth/signup").send(testUser).expect(201);
        const res = await requestAgent.post("/api/auth/login").send(testUser).expect(200);

        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("userId");

        refreshToken = res.body.refreshToken;
    });

    it("should deny access with an invalid token", async () => {
        await requestAgent
            .get("/api/auth/protected-route")
            .set("Authorization", "Bearer invalidtoken")
            .expect(403);
    });

    it("should refresh access token with a valid refresh token", async () => {
        await requestAgent.post("/api/auth/signup").send(testUser).expect(201);
        const loginRes = await requestAgent.post("/api/auth/login").send(testUser).expect(200);
        const refreshToken = loginRes.header["set-cookie"][0].split("refreshToken=")[1].split(";")[0];

        const res = await requestAgent
            .post("/api/auth/refresh")
            .set("Cookie", `refreshToken=${refreshToken}`)
            .expect(200);

        expect(res.body).toHaveProperty("accessToken");
    });

    it("should deny refresh token request with an invalid token", async () => {
        await requestAgent
            .post("/api/auth/refresh")
            .set("Cookie", "refreshToken=invalidtoken")
            .expect(403);
    });
});
