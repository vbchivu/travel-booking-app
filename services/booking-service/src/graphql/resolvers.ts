// src/graphql/resolvers.ts
import { createBooking, getBookingById, getBookingsByUser, updateBookingStatus } from "../models/bookingModel";
import { publishBookingEvent } from "../events/publisher";

export const resolvers = {
    Query: {
        bookingById: async (_: any, { id }: { id: string }) => {
            return await getBookingById(id);
        },
        bookingsByUser: async (_: any, { userId }: { userId: string }) => {
            return await getBookingsByUser(userId);
        },
    },
    Mutation: {
        createBooking: async (_: any, { userId, flightNumber }: { userId: string; flightNumber: string }) => {
            const booking = await createBooking(userId, flightNumber);
            await publishBookingEvent("booking.created", booking);
            return booking;
        },
        updateBookingStatus: async (_: any, { id, status }: { id: string; status: string }) => {
            return await updateBookingStatus(id, status);
        },
    },
};
