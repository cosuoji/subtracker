export const getReminderDate = (payment) => {
  const reminderDate = new Date(payment.nextPaymentDate);

  reminderDate.setDate(
    reminderDate.getDate() - payment.reminderDays
  );

  reminderDate.setHours(0, 0, 0, 0);

  return reminderDate;
};

export const getDaysUntilPayment = (payment) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const paymentDate = new Date(payment.nextPaymentDate);
  paymentDate.setHours(0, 0, 0, 0);

  return Math.ceil(
    (paymentDate - today) / (1000 * 60 * 60 * 24)
  );
};

export const getActiveReminders = (payments) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return payments
    .filter((payment) => payment.status === "active")
    .filter((payment) => {
      const reminderDate = getReminderDate(payment);

      return today >= reminderDate;
    })
    .sort(
      (a, b) =>
        new Date(a.nextPaymentDate) -
        new Date(b.nextPaymentDate)
    );
};
