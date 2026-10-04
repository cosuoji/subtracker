import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      default: "NGN",
      uppercase: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Streaming",
        "Software",
        "Utilities",
        "Insurance",
        "Internet",
        "Phone",
        "Rent",
        "Membership",
        "Other",
      ],
      default: "Other",
    },

    billingCycle: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    nextPaymentDate: {
      type: Date,
      required: true,
    },

    reminderDays: {
      type: Number,
      default: 3,
      min: 0,
      max: 30,
    },

    status: {
      type: String,
      enum: ["active", "paused", "cancelled"],
      default: "active",
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

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
