const express = require("express");
const bodyParser = require("body-parser");
const bookingRoutes = require("./routes/booking");

const app = express();
app.use(bodyParser.json());
app.use("/api", bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
