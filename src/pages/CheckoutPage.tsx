import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";  // Point to your shared axios instance client

export default function CheckoutPage() {
  const [phoneNumber, setPhoneNumber] = useState("0789287915");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [cartTotal, setCartTotal] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Look up current checkout total value matching active user session
    apiClient.get("/cart")
      .then((res) => setCartTotal(res.data.totalPrice || 0))
      .catch((err) => console.error("Error loading cart totals", err));
  }, []);

  const handleMomoCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("Contacting hosted Render instance server framework...");

    try {
      // 1. Fire payment prompt request payload
      const initRes = await apiClient.post("/checkout/momo", { phoneNumber });
      const orderId = initRes.data.orderId;

      setStatusMessage("Push prompt initialized. Waiting for transaction approval block...");

      // 2. Poll transaction verification endpoint every 3 seconds
      const pollTimer = setInterval(async () => {
        try {
          const statusRes = await apiClient.get(`/checkout/status/${orderId}`);
          
          if (statusRes.data.paymentStatus === "completed") {
            clearInterval(pollTimer);
            setStatusMessage("Success! Your invoice has been sent to your email. Redirecting... 🎉");
            setLoading(false);
            setTimeout(() => navigate("/"), 2500); // Route back to homepage front
          } else if (statusRes.data.paymentStatus === "failed") {
            clearInterval(pollTimer);
            setStatusMessage("Transaction dropped or rejected.");
            setLoading(false);
          }
        } catch (pollErr) {
          console.error("Error polling order transaction milestone", pollErr);
        }
      }, 3000);

    } catch (err: any) {
      setStatusMessage(`Transaction processing break down error: ${err.response?.data?.message || err.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "60px auto", padding: "30px", border: "1px solid #e2e8f0", borderRadius: "12px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#2b6cb0", margin: "0 0 10px 0" }}>MTN Mobile Money Gateway</h2>
      <p style={{ fontSize: "16px", color: "#4a5568" }}>Amount Due: <strong style={{ color: "#2b6cb0" }}>{cartTotal?.toLocaleString()} RWF</strong></p>
      
      <form onSubmit={handleMomoCheckout}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: "14px" }}>Payer Phone Wallet (MSISDN)</label>
        <input 
          type="text" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
          disabled={loading}
          style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e0", borderRadius: "6px", marginBottom: "20px", boxSizing: "border-box" }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", backgroundColor: loading ? "#cbd5e0" : "#2b6cb0", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Authorizing Payment Flow..." : "Pay Now"}
        </button>
      </form>

      {statusMessage && (
        <div style={{ marginTop: "20px", padding: "12px", backgroundColor: "#ebf8ff", border: "1px solid #bee3f8", color: "#2b6cb0", borderRadius: "6px", fontSize: "14px", textAlign: "center" }}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}
