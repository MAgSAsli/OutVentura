import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 7070;

app.listen(PORT, () => {
  console.log(`🚀 OutVentura API running on http://localhost:${PORT}`);
});
