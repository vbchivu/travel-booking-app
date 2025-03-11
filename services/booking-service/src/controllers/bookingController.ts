import { Request, Response } from "express";
import { bookFlight, fetchBookingById, fetchBookingsByUser, changeBookingStatus } from "../services/bookingService";

export const createBookingHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, flightNumber } = req.body;
        if (!userId || !flightNumber) {
            res.status(400).json({ message: "User ID and flight number are required" });
            return;
        }

        const booking = await bookFlight(userId, flightNumber);
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Error creating booking", error });
    }
};

export const getBookingByIdHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "Booking ID is required" });
            return;
        }

        const booking = await fetchBookingById(id);
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: "Error fetching booking", error });
    }
};

export const getBookingsByUserHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        const bookings = await fetchBookingsByUser(userId);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user bookings", error });
    }
};

export const updateBookingStatusHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "Booking ID is required" });
            return;
        }

        const { status } = req.body;
        if (!status) {
            res.status(400).json({ message: "Status is required" });
            return;
        }

        const booking = await changeBookingStatus(id, status);
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: "Error updating booking status", error });
    }
};
