const PaymentCard = ({
  payment,
  onEdit,
  onDelete,
  onStatusChange,
  onMarkAsPaid,
}) => {
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: payment.currency,
    maximumFractionDigits: 2,
  }).format(payment.amount);

  const formattedDate = new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(payment.nextPaymentDate));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {payment.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {payment.category}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            payment.status === "active"
              ? "bg-green-100 text-green-700"
              : payment.status === "paused"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {payment.status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Amount</p>

          <p className="mt-1 font-semibold text-gray-900">
            {formattedAmount}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Next payment</p>

          <p className="mt-1 font-semibold text-gray-900">
            {formattedDate}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
        <button
          onClick={() => onEdit(payment)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Edit
        </button>

        <button
          onClick={() =>
            onStatusChange(
              payment._id,
              payment.status === "active" ? "paused" : "active"
            )
          }
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          {payment.status === "active" ? "Pause" : "Resume"}
        </button>

        <button
          onClick={() => onMarkAsPaid(payment._id)}
          className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Mark as paid
        </button>

        <button
          onClick={() => onDelete(payment._id)}
          className="ml-auto rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PaymentCard;
