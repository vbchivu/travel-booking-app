import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBooking = async (userId: string, flightNumber: string) => {
    return await prisma.booking.create({
        data: {
            userId,
            flightNumber,
        },
    });
};

export const getBookingById = async (id: string) => {
    return await prisma.booking.findUnique({
        where: { id },
    });
};

export const getBookingsByUser = async (userId: string) => {
    return await prisma.booking.findMany({
        where: { userId },
    });
};

export const updateBookingStatus = async (id: string, status: string) => {
    return await prisma.booking.update({
        where: { id },
        data: { status },
    });
};
