import { useEffect, useState } from "react";
import { getPayments, getPaymentHistory } from "../services/paymentService";
import { formatCurrency, formatDate } from "../utils/paymentUtils";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const paymentsData = await getPayments();
        const payments = paymentsData.payments || [];

        const historyResults = await Promise.all(
          payments.map((payment) => getPaymentHistory(payment._id))
        );

        const allHistory = historyResults.flatMap(
          (result) => result.history || []
        );

        allHistory.sort(
          (a, b) =>
            new Date(b.paymentDate) - new Date(a.paymentDate)
        );

        setHistory(allHistory);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load payment history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Payment History
        </h1>

        <p className="mt-1 text-gray-600">
          See all payments you have marked as paid.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">
            No payment history yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {item.name}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {formatCurrency(
                        item.amount,
                        item.currency
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {formatDate(item.paymentDate)}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
