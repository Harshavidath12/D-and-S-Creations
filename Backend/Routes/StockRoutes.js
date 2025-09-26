const express = require("express");
const router = express.Router();

const StockController = require("../Controllers/StockController");

router.get("/", StockController.getAllStock);
router.post("/", StockController.addStock);
router.get("/:id", StockController.getStockById);
router.put("/:id", StockController.updateStock);
router.delete("/:id", StockController.deleteStock);

module.exports = router;
