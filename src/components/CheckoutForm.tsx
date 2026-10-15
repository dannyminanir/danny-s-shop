import React, { useState } from "react";
import { checkoutService } from "../services/checkout.service";

interface CheckoutProps {
  totalPrice: number;
  onSuccess: () => void;
}

export const CheckoutForm: React.FC<CheckoutProps> = ({ totalPrice, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("0789287915");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("Contacting hosted Render server... Firing MoMo prompt.");

    try {
      const initResult = await checkoutService.initiateMomoPayment(phoneNumber);
      const orderId = initResult.orderId;

      setStatusMessage("Prompt successfully initialized. Polling network updates...");

      const checkInterval = setInterval(async () => {
        try {
          const statusResult = await checkoutService.verifyPaymentStatus(orderId);
          
          if (statusResult.paymentStatus === "completed") {
            clearInterval(checkInterval);
            setStatusMessage("Payment Confirmed! Your invoice has been dispatched via Resend email. 🎉");
            setLoading(false);
            setTimeout(() => onSuccess(), 2000);
          } else if (statusResult.paymentStatus === "failed") {
            clearInterval(checkInterval);
            setStatusMessage("Transaction dropped or failed.");
            setLoading(false);
          }
        } catch (pollErr) {
          console.error("Status check failed", pollErr);
        }
      }, 3000);

    } catch (err: any) {
      setStatusMessage(`Checkout processing error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", padding: "25px", border: "1px solid #cbd5e0", borderRadius: "8px", fontFamily: "sans-serif" }}>
      <h3 style={{ color: "#2b6cb0", margin: "0 0 15px 0" }}>MTN Mobile Money Gateway</h3>
      <p style={{ fontSize: "16px" }}>Amount Due: <strong style={{ color: "#2b6cb0" }}>{totalPrice?.toLocaleString()} RWF</strong></p>
      
      <form onSubmit={handleCheckoutSubmit}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Payer Phone Number</label>
        <input 
          type="text" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
          disabled={loading}
          style={{ width: "100%", padding: "10px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #cbd5e0", marginBottom: "15px" }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", backgroundColor: loading ? "#cbd5e0" : "#2b6cb0", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
          {loading ? "Processing..." : "Authorize Sandbox Payment"}
        </button>
      </form>

      {statusMessage && (
        <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#ebf8ff", border: "1px solid #bee3f8", color: "#2b6cb0", borderRadius: "4px", fontSize: "14px", textAlign: "center" }}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};
