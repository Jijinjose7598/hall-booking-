const express = require("express");
const bodyParser = require("body-parser");
const bookingRoutes = require("./routes/booking");

const httpServer = express();
httpServer.use(bodyParser.json());

const port = process.env.PORT || 3000;

// Import routes


// Use routes
httpServer.use("/", bookingRoutes);

httpServer.listen(port,"localhost", () => {
  console.log(`Server is running on port ${port}`);
});
