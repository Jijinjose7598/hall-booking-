const express = require("express");
const router = express.Router();

let rooms = [];
let bookings = [];

// Endpoint to create a room
router.post("/rooms", (req, res) => {
  const { name, seats, amenities, pricePerHour } = req.body;
  const room = {
    id: rooms.length + 1,
    name,
    seats,
    amenities,
    pricePerHour,
    bookings: [],
  };
  rooms.push(room);
  res.status(201).send(room);
});

// Endpoint to list all rooms with booked data
router.get("/rooms", (req, res) => {
  res.send(rooms);
});

// Endpoint to book a room
router.post("/bookings", (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;

  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    return res.status(404).send({ message: "Room not found" });
  }

  // Check for existing bookings
  const existingBooking = room.bookings.find(
    (b) =>
      b.date === date &&
      ((startTime >= b.startTime && startTime < b.endTime) ||
        (endTime > b.startTime && endTime <= b.endTime))
  );
  if (existingBooking) {
    return res
      .status(400)
      .send({ message: "Room is already booked for the given time" });
  }

  const booking = {
    id: bookings.length + 1,
    customerName,
    date,
    startTime,
    endTime,
    roomId,
  };
  room.bookings.push(booking);
  bookings.push(booking);
  res.status(201).send(booking);
});

// Endpoint to list all customers with booked data
router.get("/customers", (req, res) => {
  const customerBookings = bookings.map((b) => {
    const room = rooms.find((r) => r.id === b.roomId);
    return { ...b, roomName: room.name };
  });
  res.send(customerBookings);
});

// Endpoint to list how many times a customer has booked a room
router.get("/customers/:customerName/bookings", (req, res) => {
  const { customerName } = req.params;
  const customerBookings = bookings
    .filter((b) => b.customerName === customerName)
    .map((b) => {
      const room = rooms.find((r) => r.id === b.roomId);
      return { ...b, roomName: room.name };
    });
  res.send({ customerName, bookings: customerBookings });
});

module.exports = router;
