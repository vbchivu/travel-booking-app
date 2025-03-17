import express from "express";
import { register } from "@travel-app/shared";
const router = express.Router();

router.get("/metrics", async (_req, res) => {
    res.setHeader("Content-Type", register.contentType);
    res.end(await register.metrics());
});

export default router;
