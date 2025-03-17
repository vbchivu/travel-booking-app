import { Request, Response, NextFunction } from "express";
import { httpRequestCounter, httpRequestDuration } from "./metrics";

export function trackMetrics(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();

    res.on("finish", () => {
        const duration = process.hrtime(start);
        const durationInSeconds = duration[0] + duration[1] / 1e9;

        httpRequestCounter.inc({
            method: req.method,
            route: req.path,
            status_code: res.statusCode,
        });

        httpRequestDuration.observe(
            {
                method: req.method,
                route: req.path,
                status_code: res.statusCode,
            },
            durationInSeconds
        );
    });

    next();
}
