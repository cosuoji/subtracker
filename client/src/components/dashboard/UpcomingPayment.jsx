import {
  formatCurrency,
  formatDate,
} from "../../utils/paymentUtils";

const UpcomingPayment = ({ payment }) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-4 last:border-b-0">
      <div className="min-w-0">
        <h3 className="truncate font-medium text-gray-900">
          {payment.name}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {payment.category}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-semibold text-gray-900">
          {formatCurrency(
            payment.amount,
            payment.currency
          )}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {formatDate(payment.nextPaymentDate)}
        </p>
      </div>
    </div>
  );
};

export default UpcomingPayment;
