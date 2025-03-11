import { createBooking, getBookingById, getBookingsByUser, updateBookingStatus } from "../models/bookingModel";
import { publishBookingEvent } from "../events/publisher";

export const bookFlight = async (userId: string, flightNumber: string) => {
    const booking = await createBooking(userId, flightNumber);
    await publishBookingEvent("booking.created", booking);
    return booking;
};

export const fetchBookingById = async (id: string) => {
    return await getBookingById(id);
};

export const fetchBookingsByUser = async (userId: string) => {
    return await getBookingsByUser(userId);
};

export const changeBookingStatus = async (id: string, status: string) => {
    return await updateBookingStatus(id, status);
};
