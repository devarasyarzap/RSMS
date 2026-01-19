const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");

// POST /api/billing/generate (Buat Tagihan)
router.get("/", billingController.getAllBills);

router.post("/generate", billingController.generateBill);

// POST /api/billing/pay (Bayar)
router.post("/pay", billingController.payBill);

module.exports = router;
