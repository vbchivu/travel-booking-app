import app from "./app";
import { config } from "./config/env";

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
