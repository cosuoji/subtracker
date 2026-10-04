
import Payment from "../models/Payment.js";
import PaymentHistory from "../models/PaymentHistory.js";
import { getNextPaymentDate } from "../utils/recurrence.js";

// Create payment
export const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user._id,
    }).sort({
      nextPaymentDate: 1,
    });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single payment
export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update payment
export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Pause / resume payment
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "paused", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const payment = await Payment.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark payment as paid
export const markPaymentAsPaid = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status !== "active") {
      return res.status(400).json({
        success: false,
        message:
          "Only active payments can be marked as paid.",
      });
    }

    // Save the current occurrence
    const history = await PaymentHistory.create({
      payment: payment._id,
      name: payment.name,
      amount: payment.amount,
      currency: payment.currency,
      paymentDate: payment.nextPaymentDate,
      status: "paid",
      notes: payment.notes,
    });

    // Move to the next occurrence
    payment.nextPaymentDate = getNextPaymentDate(
      payment.nextPaymentDate,
      payment.billingCycle
    );

    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment marked as paid.",
      payment,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    // First make sure this payment belongs to the logged-in user
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const history = await PaymentHistory.find({
      payment: payment._id,
    }).sort({
      paymentDate: -1,
    });

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get upcoming payments
export const getUpcomingPayments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    sevenDaysFromNow.setHours(23, 59, 59, 999);

    const payments = await Payment.find({
      user: req.user._id,
      status: "active",
      nextPaymentDate: {
        $gte: today,
        $lte: sevenDaysFromNow,
      },
    }).sort({ nextPaymentDate: 1 });

    const upcomingPayments = payments.map((payment) => {
      const paymentDate = new Date(payment.nextPaymentDate);

      const differenceInMs = paymentDate - today;
      const daysUntil = Math.ceil(
        differenceInMs / (1000 * 60 * 60 * 24)
      );

      return {
        ...payment.toObject(),
        daysUntil,
      };
    });

    res.status(200).json({
      success: true,
      count: upcomingPayments.length,
      payments: upcomingPayments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
