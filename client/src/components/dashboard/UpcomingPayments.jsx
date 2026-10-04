import { CalendarDays, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/paymentUtils";

const UpcomingPayments = ({ payments }) => {
  const getDueText = (daysUntil) => {
    if (daysUntil === 0) {
      return "Due today";
    }

    if (daysUntil === 1) {
      return "Due tomorrow";
    }

    return `Due in ${daysUntil} days`;
  };

  if (!payments.length) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays size={20} />
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming payments
          </h2>
        </div>

        <p className="text-sm text-gray-500">
          No payments are due in the next 7 days.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays size={20} />
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming payments
          </h2>
        </div>

        <span className="text-sm text-gray-500">
          Next 7 days
        </span>
      </div>

      <div className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment._id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p className="font-medium text-gray-900">
                {payment.name}
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <Clock size={14} />

                <span>
                  {getDueText(payment.daysUntil)}
                </span>

                <span>•</span>

                <span>
                  {formatDate(payment.nextPaymentDate)}
                </span>
              </div>
            </div>

            <p className="font-semibold text-gray-900">
              {formatCurrency(
                payment.amount,
                payment.currency
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingPayments;
