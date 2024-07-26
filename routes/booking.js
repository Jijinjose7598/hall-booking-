const express = require("express");
const router = express.Router();
const { rooms, bookings } = require("../data/data");

// 1. Create a Room
router.post("/rooms", (req, res) => {

     console.log("POST /rooms called");
     console.log("Request body:", req.body);
  const { roomName, seats, amenities, pricePerHour } = req.body;
  const newRoom = {
    id: rooms.length + 1,
    roomName,
    seats,
    amenities,
    pricePerHour,
  };
  rooms.push(newRoom);
  res.status(201).json({ message: "Room created successfully", room: newRoom });
});

// 2. Book a Room
router.post("/bookings", (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const isBooked = bookings.some(
    (b) =>
      b.roomId === roomId &&
      b.date === date &&
      ((b.startTime <= startTime && b.endTime > startTime) ||
        (b.startTime < endTime && b.endTime >= endTime) ||
        (b.startTime >= startTime && b.endTime <= endTime))
  );

  if (isBooked) {
    return res
      .status(400)
      .json({ message: "Room is already booked for the specified time" });
  }

  const newBooking = {
    id: bookings.length + 1,
    customerName,
    date,
    startTime,
    endTime,
    roomId,
    bookingDate: new Date(),
    status: "Booked",
  };
  bookings.push(newBooking);
  res
    .status(201)
    .json({ message: "Room booked successfully", booking: newBooking });
});

// 3. List all Rooms with Booked Data
router.get("/rooms", (req, res) => {
  const roomsWithBookings = rooms.map((room) => {
    const roomBookings = bookings.filter((b) => b.roomId === room.id);
    return { ...room, bookings: roomBookings };
  });
  res.json(roomsWithBookings);
});

// 4. List all Customers with Booked Data
router.get("/customers", (req, res) => {
  const customers = bookings.map((booking) => ({
    customerName: booking.customerName,
    roomName: rooms.find((r) => r.id === booking.roomId).roomName,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
  }));
  res.json(customers);
});

// 5. List how many times a customer has booked the room
router.get("/customers/:customerName", (req, res) => {
  const { customerName } = req.params;
  const customerBookings = bookings
    .filter((b) => b.customerName === customerName)
    .map((booking) => ({
      roomName: rooms.find((r) => r.id === booking.roomId).roomName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingId: booking.id,
      bookingDate: booking.bookingDate,
      status: booking.status,
    }));

  res.json({ customerName, bookings: customerBookings });
});

module.exports = router;
