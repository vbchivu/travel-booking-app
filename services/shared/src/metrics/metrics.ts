import client from "prom-client";

// Create a new Registry for metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Track API requests count
const httpRequestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total number of API requests",
    labelNames: ["method", "route", "status_code"],
});

// Track API response latency
const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 3, 5, 10],
});

register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);

export { register, httpRequestCounter, httpRequestDuration };
