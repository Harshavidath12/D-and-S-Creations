const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const PDFDocument = require("pdfkit");

// Load environment variables
dotenv.config();

// ===== Import routes =====
const userRoutes = require("./Routes/UserRoutes");
const bookingRoutes = require("./Routes/BookingRoutes");
const pricingRoutes = require("./Routes/pricingRoutes");
const paymentRoutes = require("./Routes/PaymentRoutes");
const stockRoutes = require("./Routes/StockRoutes");
const designerRoutes = require("./Routes/designerRoutes");
const complaintRoutes = require("./Routes/complaintRoutes");
const cinemaRoutes = require("./routes/cinemaRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

// ===== Error handling middleware =====
const { errorHandler, notFound } = require("./middleware/errorHandler");

// ===== Import models =====
require("./Model/UserModel");
require("./Model/RentalModel");
const User = mongoose.model("NewUser");
const Booking = mongoose.model("RentalModel");

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ===== Routes =====
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);
app.use("/pricing", pricingRoutes);
app.use("/payments", paymentRoutes);
app.use("/stock", stockRoutes);
app.use("/designers", designerRoutes);
app.use("/complaint", complaintRoutes);
app.use("/api/cinemas", cinemaRoutes);
app.use("/api/reservations", reservationRoutes);

// ===== PDF Download Route for Bookings =====
app.get("/bookings/download/pdf", async (req, res) => {
  try {
    const bookings = await Booking.find();

    const doc = new PDFDocument();
    const filename = "booking_report.pdf";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Booking Report", { align: "center" });
    doc.moveDown();

    // Booking details
    bookings.forEach((b, index) => {
      doc.fontSize(12).text(`Booking #${index + 1}`);
      doc.text(`Booking ID: ${b.bookingId || "N/A"}`);
      doc.text(`Customer Name: ${b.name || "N/A"}`);
      doc.text(`LED Board Type: ${b.ledBoardType || "N/A"}`);
      doc.text(`Quantity: ${b.quantity || "N/A"}`);
      doc.text(`Location: ${b.location || "N/A"}`);
      doc.text(`Purpose: ${b.purpose || "N/A"}`);
      doc.text(
        `Rental Start Date & Time: ${
          b.rentalStartDateTime
            ? new Date(b.rentalStartDateTime).toLocaleString()
            : "N/A"
        }`
      );
      doc.text(
        `Rental End Date & Time: ${
          b.rentalEndDateTime
            ? new Date(b.rentalEndDateTime).toLocaleString()
            : "N/A"
        }`
      );
      doc.text(`Payment Method: ${b.paymentMethod || "N/A"}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("Failed to generate booking PDF");
  }
});

// ===== Health Check =====
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Cinema Management API is running!",
    version: "1.0.0",
  });
});

// ===== Auth Routes =====
app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  try {
    await User.create({ username, password });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "err", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.json({ err: "User not Found" });
    if (user.password === password) {
      return res.json({ status: "ok", user });
    } else {
      return res.json({ err: "Incorrect password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
});

// ===== Error Handling =====
app.use(notFound);
app.use(errorHandler);

// ===== Database Connection and Server Start =====
mongoose
  .connect("mongodb+srv://admin:E1gMihrKg842U8Sd@cluster0.sp3lpkf.mongodb.net/")
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });
  })
  .catch((err) => console.log("❌ DB connection error:", err));

module.exports = app;
