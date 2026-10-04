import { useEffect, useState } from "react";

import PaymentCard from "../components/payments/PaymentCard";
import PaymentForm from "../components/payments/PaymentForm";

import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  updatePaymentStatus,
  markPaymentAsPaid,
} from "../services/paymentService";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPayments();

      setPayments(data.payments);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load payments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError("");

      if (editingPayment) {
        const data = await updatePayment(
          editingPayment._id,
          formData
        );

        setPayments((current) =>
          current.map((payment) =>
            payment._id === editingPayment._id
              ? data.payment
              : payment
          )
        );
      } else {
        const data = await createPayment(formData);

        setPayments((current) => [
          ...current,
          data.payment,
        ]);
      }

      setShowForm(false);
      setEditingPayment(null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save payment."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) return;

    try {
      await deletePayment(id);

      setPayments((current) =>
        current.filter((payment) => payment._id !== id)
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete payment."
      );
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const data = await updatePaymentStatus(id, status);

      setPayments((current) =>
        current.map((payment) =>
          payment._id === id ? data.payment : payment
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update payment status."
      );
    }
  };
  const handleMarkAsPaid = async (id) => {
    try {
      const data = await markPaymentAsPaid(id);

      setPayments((current) =>
        current.map((payment) =>
          payment._id === id
            ? data.payment
            : payment
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to mark payment as paid."
      );
    }
  };

  const openCreateForm = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Payments
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your recurring payments.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Add payment
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No payments yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add your first recurring payment to get started.
            </p>

            <button
              onClick={openCreateForm}
              className="mt-5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white"
            >
              Add your first payment
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {payments.map((payment) => (
              <PaymentCard
                key={payment._id}
                payment={payment}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onMarkAsPaid={handleMarkAsPaid}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <PaymentForm
          payment={editingPayment}
          onSubmit={handleSubmit}
          onClose={closeForm}
          loading={saving}
        />
      )}
    </div>
  );
};

export default Payments;
