import { prisma } from "@travel-app/shared";

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
};

export const createUser = async (email: string, password: string) => {
    // Initialize with an empty array of refreshTokens
    return prisma.user.create({
        data: { email, password, refreshTokens: [] },
    });
};

export const updateUserRefreshTokens = async (userId: string, newToken: string, oldToken?: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    // Filter out the old token (if any) and add the new token
    const updatedTokens = user.refreshTokens.filter((token: string | undefined) => token !== oldToken);
    updatedTokens.push(newToken);

    await prisma.user.update({
        where: { id: userId },
        data: { refreshTokens: updatedTokens },
    });
};
