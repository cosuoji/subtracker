export const getMonthlyAmount = (payment) => {
  const amount = Number(payment.amount);

  switch (payment.billingCycle) {
    case "weekly":
      return amount * 52 / 12;

    case "monthly":
      return amount;

    case "quarterly":
      return amount / 3;

    case "yearly":
      return amount / 12;

    default:
      return 0;
  }
};

export const getYearlyAmount = (payment) => {
  const amount = Number(payment.amount);

  switch (payment.billingCycle) {
    case "weekly":
      return amount * 52;

    case "monthly":
      return amount * 12;

    case "quarterly":
      return amount * 4;

    case "yearly":
      return amount;

    default:
      return 0;
  }
};

export const isDueWithinDays = (payment, days = 7) => {
  if (payment.status !== "active") {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const paymentDate = new Date(payment.nextPaymentDate);
  paymentDate.setHours(0, 0, 0, 0);

  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);

  return paymentDate >= today && paymentDate <= futureDate;
};

export const formatCurrency = (amount, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};
