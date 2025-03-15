// src/routes/bookingRoutes.ts
import express from "express";
import {
    createBookingHandler,
    getBookingByIdHandler,
    getBookingsByUserHandler,
    updateBookingStatusHandler
} from "../controllers/bookingController";
import { authenticateJWT } from "@travel-app/shared";

const router = express.Router();

router.post("/", authenticateJWT, createBookingHandler);
router.get("/:id", authenticateJWT, getBookingByIdHandler);
router.get("/user/:userId", authenticateJWT, getBookingsByUserHandler);
router.patch("/:id/status", authenticateJWT, updateBookingStatusHandler);

export default router;
