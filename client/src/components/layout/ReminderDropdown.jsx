import { Bell, X } from "lucide-react";
import {
  getActiveReminders,
  getDaysUntilPayment,
} from "../../utils/reminderUtils";
import { formatCurrency, formatDate } from "../../utils/paymentUtils";

const ReminderDropdown = ({ payments, onClose }) => {
  const reminders = getActiveReminders(payments);

  const getDueText = (days) => {
    if (days < 0) {
      return `Overdue by ${Math.abs(days)} days`;
    }

    if (days === 0) {
      return "Due today";
    }

    if (days === 1) {
      return "Due tomorrow";
    }

    return `Due in ${days} days`;
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell size={17} />

          <h3 className="font-semibold text-gray-900">
            Reminders
          </h3>
        </div>

        <button
          onClick={onClose}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>

      {reminders.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-gray-500">
            No reminders right now.
          </p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {reminders.map((payment) => {
            const daysUntil = getDaysUntilPayment(payment);

            return (
              <div
                key={payment._id}
                className="border-b border-gray-100 px-4 py-4 last:border-b-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {payment.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {getDueText(daysUntil)}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(payment.nextPaymentDate)}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(
                      payment.amount,
                      payment.currency
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReminderDropdown;
