import express from "express";
import {
    createBookingHandler,
    getBookingByIdHandler,
    getBookingsByUserHandler,
    updateBookingStatusHandler
} from "../controllers/bookingController";

const router = express.Router();

router.post("/", createBookingHandler);
router.get("/:id", getBookingByIdHandler);
router.get("/user/:userId", getBookingsByUserHandler);
router.patch("/:id/status", updateBookingStatusHandler);

export default router;
