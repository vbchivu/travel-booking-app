// src/server.ts
import app from "./app";

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Booking Service running on port ${PORT}`);
});
