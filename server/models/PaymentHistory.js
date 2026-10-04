import mongoose from "mongoose";

const paymentHistorySchema = new mongoose.Schema(
  {
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      uppercase: true,
    },

    paymentDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["paid", "missed"],
      default: "paid",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const PaymentHistory = mongoose.model(
  "PaymentHistory",
  paymentHistorySchema
);

export default PaymentHistory;
