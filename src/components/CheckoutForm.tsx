import React, { useState, useEffect } from "react";
import { checkoutService } from "../services/checkout.service";

export const CheckoutForm: React.FC = () => {
  const [cart, setCart] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState("0789287915");
  const [loading, setLoading] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<string>("");

  useEffect(() => {
    // Mount cart pricing states upon dashboard screen initialization
    checkoutService.getCart().then(setCart).catch(console.error);
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCheckoutStatus("Processing checkout pipeline on Render server...");

    try {
      // 1. Dispatch billing configuration to hosted Render instance
      const result = await checkoutService.initiateMomoPayment(phoneNumber);
      const targetOrderId = result.orderId;

      setCheckoutStatus("Prompt initialized. Simulating transaction approval loop...");

      // 2. Start polling status endpoint checks sequentially every 3 seconds
      const statusPollInterval = setInterval(async () => {
        try {
          const check = await checkoutService.verifyPaymentStatus(targetOrderId);
          
          if (check.paymentStatus === "completed") {
            clearInterval(statusPollInterval);
            setCheckoutStatus("Payment Success! Grand Total Paid. Check your email for your receipt invoice! 🎉");
            setLoading(false);
            setCart({ items: [], totalItems: 0, totalPrice: 0 }); // Empty display basket
          } else if (check.paymentStatus === "failed") {
            clearInterval(statusPollInterval);
            setCheckoutStatus("Transaction rejected or payment failed. Please try again.");
            setLoading(false);
          }
        } catch (pollErr) {
          console.error("Polling sync error", pollErr);
        }
      }, 3000);

    } catch (error: any) {
      setCheckoutStatus(`Checkout Failed: ${error.response?.data?.message || error.message}`);
      setLoading(false);
    }
  };

  if (!cart) return <div style={{ padding: "20px" }}>Loading active shopping cart basket metadata...</div>;

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "30px", border: "1px solid #e2e8f0", borderRadius: "12px", fontFamily: "sans-serif", backgroundColor: "#fff" }}>
      <h2 style={{ color: "#2b6cb0", marginBottom: "20px" }}>Mobile Money Checkout</h2>
      
      <div style={{ background: "#f7fafc", padding: "15px", borderRadius: "8px", marginBottom: "25px" }}>
        <p style={{ margin: "0 0 5px 0", color: "#4a5568" }}>Total items: <strong>{cart.totalItems}</strong></p>
        <p style={{ margin: "0", fontSize: "18px", color: "#2d3748" }}>Total Price: <strong style={{ color: "#2b6cb0" }}>{cart.totalPrice?.toLocaleString()} RWF</strong></p>
      </div>

      {cart.totalItems === 0 ? (
        <p style={{ color: "#718096", textAlign: "center" }}>Your cart is empty. Add a product to run verification checks.</p>
      ) : (
        <form onSubmit={handleCheckout}>
          <label style={{ display: "block", marginBottom: "8px", color: "#4a5568", fontSize: "14px", fontWeight: "bold" }}>MTN MoMo Phone Number</label>
          <input 
            type="text" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
            style={{ width: "100%", padding: "12px", boxSizing: "border-box", border: "1px solid #cbd5e0", borderRadius: "6px", fontSize: "16px", marginBottom: "20px" }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: "100%", padding: "14px", backgroundColor: loading ? "#a0aec0" : "#2b6cb0", color: "#fff", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Verifying Transaction..." : "Pay Now with MoMo"}
          </button>
        </form>
      )}

      {checkoutStatus && (
        <div style={{ marginTop: "20px", padding: "12px", borderRadius: "6px", backgroundColor: "#ebf8ff", color: "#2b6cb0", fontSize: "14px", textAlign: "center", border: "1px solid #bee3f8" }}>
          {checkoutStatus}
        </div>
      )}
    </div>
  );
};
