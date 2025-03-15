// src/models/userModel.ts
import { prisma } from "@travel-app/shared";

export async function createUser(email: string, hashedPassword: string) {
    return prisma.user.create({
        data: { email, password: hashedPassword },
    });
}

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
}

export async function updateUserRefreshToken(userId: string, refreshToken: string) {
    return prisma.user.update({
        where: { id: userId },
        data: { refreshToken },
    });
}
