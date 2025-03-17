import client from "prom-client";

// Create a Registry
const register = new client.Registry();

// Default metrics
client.collectDefaultMetrics({
    register,
});

// Custom metrics example
export const httpRequestsTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
});

register.registerMetric(httpRequestsTotal);

export default register;
