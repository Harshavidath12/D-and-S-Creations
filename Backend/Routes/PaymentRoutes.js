const express = require("express");
const router = express.Router();
const PaymentController = require("../Controllers/PaymentController");

router.get("/", PaymentController.getAllPayments);
router.post("/", PaymentController.addPayment);
router.get("/:id", PaymentController.getPaymentById);
router.put("/:id", PaymentController.updatePayment);
router.delete("/:id", PaymentController.deletePayment);

module.exports = router;
