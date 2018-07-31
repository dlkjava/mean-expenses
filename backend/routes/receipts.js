const express = require("express");

const ReceiptController = require("../controllers/receipts");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.get('/totals', ReceiptController.getReceiptsTotals);

router.post("", checkAuth, extractFile, ReceiptController.createReceipt);

router.put("/:id", checkAuth, extractFile, ReceiptController.updateReceipt);

router.get("", ReceiptController.getReceipts);

router.get("/:id", ReceiptController.getReceipt);

router.delete("/:id", checkAuth, ReceiptController.deleteReceipt);

router.get("/category/:category", ReceiptController.getReceiptsByCategory);

module.exports = router;
