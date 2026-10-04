export const getNextPaymentDate = (
  currentDate,
  billingCycle
) => {
  const nextDate = new Date(currentDate);

  switch (billingCycle) {
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;

    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;

    case "quarterly":
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;

    case "yearly":
      nextDate.setFullYear(
        nextDate.getFullYear() + 1
      );
      break;

    default:
      throw new Error(
        `Unsupported billing cycle: ${billingCycle}`
      );
  }

  return nextDate;
};
