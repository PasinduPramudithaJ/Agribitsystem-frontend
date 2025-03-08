import React, { useEffect, useState } from "react";
import "./Pay.scss";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

// Load Stripe with your public key
const stripePromise = loadStripe("paste your public key");

interface PaymentDetails {
  transactionId: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
}

const Pay: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>(); // `id` is the Payment ID from the URL params

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        // Fetch payment details from the backend
        const response = await fetch(`http://localhost:8080/api/payments/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch payment details");
        }
        const data = await response.json();
        setPayment(data);

        // Create a payment intent via your backend
        const intentResponse = await fetch(
          `http://localhost:8080/api/payments/${id}/create-payment-intent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ totalAmount: data.totalAmount }),
          }
        );
        if (!intentResponse.ok) {
          throw new Error("Failed to create payment intent");
        }
        const intentData = await intentResponse.json();
        setClientSecret(intentData.clientSecret); // Set Stripe client secret
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPaymentDetails();
  }, [id]);

  // Stripe Elements appearance configuration
  const appearance = {
    theme: "stripe" as "stripe",
    variables: {
      colorPrimary: "#1dbf73",
      fontFamily: "Arial, sans-serif",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="pay d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pay d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pay">
      {payment && (
        <div className="payment-details mb-4 text-center">
          <h2>Payment Details</h2>
          <p>
            <strong>Transaction ID:</strong> {payment.transactionId}
          </p>
          <p>
            <strong>Total Amount:</strong> ${payment.totalAmount}
          </p>
          <p>
            <strong>Payment Method:</strong> {payment.paymentMethod}
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}
            <span className={payment.paymentStatus === "Completed" ? "text-success" : "text-warning"}>
              {payment.paymentStatus}
            </span>
          </p>
        </div>
      )}
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Pay;

