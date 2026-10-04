import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getPayments,
} from "../services/paymentService";

import {
  formatCurrency,
  getMonthlyAmount,
  isDueWithinDays,
} from "../utils/paymentUtils";

import StatCard from "../components/dashboard/StatCard";
import UpcomingPayment from "../components/dashboard/UpcomingPayment";

const Dashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);

        const data = await getPayments();

        setPayments(data.payments);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const activePayments = useMemo(() => {
    return payments.filter(
      (payment) => payment.status === "active"
    );
  }, [payments]);

  const monthlySpending = useMemo(() => {
    return activePayments.reduce(
      (total, payment) =>
        total + getMonthlyAmount(payment),
      0
    );
  }, [activePayments]);

  const yearlySpending = useMemo(() => {
    return activePayments.reduce(
      (total, payment) =>
        total + getMonthlyAmount(payment) * 12,
      0
    );
  }, [activePayments]);

  const upcomingPayments = useMemo(() => {
    return [...activePayments]
      .sort(
        (a, b) =>
          new Date(a.nextPaymentDate) -
          new Date(b.nextPaymentDate)
      )
      .slice(0, 5);
  }, [activePayments]);

  const dueWithinSevenDays = useMemo(() => {
    return activePayments.filter((payment) =>
      isDueWithinDays(payment, 7)
    );
  }, [activePayments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-6xl text-center text-gray-500">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Here's what's happening with your recurring
              payments.
            </p>
          </div>

          <Link
            to="/payments"
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Add payment
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Monthly spending"
            value={formatCurrency(monthlySpending)}
            description="Estimated recurring cost"
          />

          <StatCard
            label="Yearly spending"
            value={formatCurrency(yearlySpending)}
            description="Estimated annual cost"
          />

          <StatCard
            label="Active payments"
            value={activePayments.length}
            description={`${payments.length} total payments`}
          />

          <StatCard
            label="Due in 7 days"
            value={dueWithinSevenDays.length}
            description="Payments coming up"
          />
        </div>

        {/* Main content */}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Upcoming */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Upcoming payments
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your next recurring payments.
                </p>
              </div>

              <Link
                to="/payments"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                View all
              </Link>
            </div>

            {upcomingPayments.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500">
                No upcoming payments.
              </div>
            ) : (
              <div className="mt-4">
                {upcomingPayments.map((payment) => (
                  <UpcomingPayment
                    key={payment._id}
                    payment={payment}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Next 7 days */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Next 7 days
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Payments that need your attention.
            </p>

            {dueWithinSevenDays.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500">
                You're all clear 🎉
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {dueWithinSevenDays.map((payment) => (
                  <div
                    key={payment._id}
                    className="rounded-xl bg-gray-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-gray-900">
                        {payment.name}
                      </span>

                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(
                          payment.amount,
                          payment.currency
                        )}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Due{" "}
                      {new Date(
                        payment.nextPaymentDate
                      ).toLocaleDateString("en-NG", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
