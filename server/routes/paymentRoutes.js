import express from "express";

import {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
  updatePaymentStatus,
  markPaymentAsPaid,
  getPaymentHistory,
  getUpcomingPayments,
} from "../controllers/paymentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/", createPayment);
router.get("/", getPayments);
router.get("/upcoming", getUpcomingPayments);

router.patch("/:id/pay", markPaymentAsPaid);
router.get("/:id/history", getPaymentHistory);
router.get("/:id", getPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);
router.patch("/:id/status", updatePaymentStatus);


export default router;
