import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  amount: "",
  currency: "NGN",
  category: "Other",
  billingCycle: "monthly",
  startDate: "",
  nextPaymentDate: "",
  reminderDays: 3,
  notes: "",
};

const PaymentForm = ({ payment, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (payment) {
      setForm({
        name: payment.name || "",
        amount: payment.amount || "",
        currency: payment.currency || "NGN",
        category: payment.category || "Other",
        billingCycle: payment.billingCycle || "monthly",
        startDate: payment.startDate
          ? payment.startDate.slice(0, 10)
          : "",
        nextPaymentDate: payment.nextPaymentDate
          ? payment.nextPaymentDate.slice(0, 10)
          : "",
        reminderDays: payment.reminderDays ?? 3,
        notes: payment.notes || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [payment]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...form,
      amount: Number(form.amount),
      reminderDays: Number(form.reminderDays),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {payment ? "Edit payment" : "Add payment"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Keep track of your recurring payment.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Netflix"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Amount
              </label>

              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="15000"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Currency
              </label>

              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900"
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900"
            >
              <option value="Streaming">Streaming</option>
              <option value="Software">Software</option>
              <option value="Utilities">Utilities</option>
              <option value="Insurance">Insurance</option>
              <option value="Internet">Internet</option>
              <option value="Phone">Phone</option>
              <option value="Rent">Rent</option>
              <option value="Membership">Membership</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Billing cycle
            </label>

            <select
              name="billingCycle"
              value={form.billingCycle}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Start date
              </label>

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Next payment
              </label>

              <input
                type="date"
                name="nextPaymentDate"
                value={form.nextPaymentDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Remind me
            </label>

            <select
              name="reminderDays"
              value={form.reminderDays}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900"
            >
              <option value="0">On the due date</option>
              <option value="1">1 day before</option>
              <option value="3">3 days before</option>
              <option value="5">5 days before</option>
              <option value="7">7 days before</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notes
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Optional notes..."
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : payment
                ? "Save changes"
                : "Add payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
