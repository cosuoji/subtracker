import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { getPayments } from "../services/paymentService";
import { formatCurrency } from "../utils/paymentUtils";

const Calendar = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await getPayments();
        setPayments(data.payments || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load payments."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const getNextPaymentDate = (date, billingCycle) => {
    const nextDate = new Date(date);

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
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;

      default:
        return null;
    }

    return nextDate;
  };

  const generateEvents = () => {
    const events = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 12);

    payments.forEach((payment) => {
      if (payment.status !== "active") return;

      let currentDate = new Date(payment.nextPaymentDate);

      while (currentDate <= endDate) {
        if (currentDate >= today) {
          events.push({
            id: `${payment._id}-${currentDate.toISOString()}`,
            title: `${payment.name} - ${formatCurrency(
              payment.amount,
              payment.currency
            )}`,
            start: new Date(currentDate),
            allDay: true,
            extendedProps: {
              paymentId: payment._id,
              category: payment.category,
              billingCycle: payment.billingCycle,
            },
          });
        }

        const nextDate = getNextPaymentDate(
          currentDate,
          payment.billingCycle
        );

        if (!nextDate) break;

        currentDate = nextDate;
      }
    });

    return events;
  };

  const handleEventClick = (info) => {
    const { paymentId } = info.event.extendedProps;

    const payment = payments.find(
      (item) => item._id === paymentId
    );

    if (!payment) return;

    alert(
      `${payment.name}\n\n` +
        `Amount: ${formatCurrency(
          payment.amount,
          payment.currency
        )}\n` +
        `Category: ${payment.category}\n` +
        `Billing: ${payment.billingCycle}`
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading calendar...</p>
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
          Payment Calendar
        </h1>

        <p className="mt-1 text-gray-600">
          View your upcoming recurring payments.
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={generateEvents()}
          eventClick={handleEventClick}
          height="auto"
        />
      </div>
    </div>
  );
};

export default Calendar;
