const express = require("express");
const dotenv = require("dotenv");
const ConnectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config();
ConnectDB();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/auth", userRoutes);
app.use("/api/devices", deviceRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server has started...");
  console.log(`Server is now listening on Port ${PORT}`);
});
