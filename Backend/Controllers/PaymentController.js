const Payment = require("../Model/PaymentModel");

// Get all payments
const getAllPayments = async (req, res) => {
  let payments;
  try {
    payments = await Payment.find();
  } catch (err) {
    console.log(err);
  }

  if (!payments) {
    return res.status(404).json({ message: "Payments not found" });
  }

  return res.status(200).json({ payments });
};

// Add new payment
const addPayment = async (req, res) => {
  const { email, contactNo, amount, address, paymentMethod, paymentDate, status } = req.body;
  let payment;
  try {
    payment = new Payment({ email, contactNo, amount, address, paymentMethod, paymentDate, status });
    await payment.save();
  } catch (err) {
    console.log(err);
  }

  if (!payment) {
    return res.status(404).json({ message: "Unable to add payment" });
  }

  return res.status(200).json({ payment });
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  const id = req.params.id;
  let payment;
  try {
    payment = await Payment.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  return res.status(200).json({ payment });
};

// Update payment
const updatePayment = async (req, res) => {
  const id = req.params.id;
  const { email, contactNo, amount, address, paymentMethod, paymentDate, status } = req.body;
  let payment;
  try {
    payment = await Payment.findByIdAndUpdate(
      id,
      { email, contactNo, amount, address, paymentMethod, paymentDate, status },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }

  if (!payment) {
    return res.status(404).json({ message: "Unable to update payment" });
  }

  return res.status(200).json({ payment });
};

// Delete payment
const deletePayment = async (req, res) => {
  const id = req.params.id;
  let payment;
  try {
    payment = await Payment.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!payment) {
    return res.status(404).json({ message: "Unable to delete payment" });
  }

  return res.status(200).json({ payment });
};

module.exports = {
  getAllPayments,
  addPayment,
  getPaymentById,
  updatePayment,
  deletePayment
};
