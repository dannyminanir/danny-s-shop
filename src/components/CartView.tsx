import React from "react";

interface CartViewProps {
  cart: any;
  onCheckoutClick: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ cart, onCheckoutClick }) => {
  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "sans-serif" }}>
      <h3 style={{ color: "#2d3748", borderBottom: "2px solid #edf2f7", paddingBottom: "10px" }}>🛒 Your Shopping Cart</h3>
      {cart.items.length === 0 ? (
        <p style={{ color: "#718096" }}>Your cart is empty.</p>
      ) : (
        <div>
          {cart.items.map((item: any, index: number) => (
            <div key={index} style={{ display: "flex", justifyContent: "between", padding: "10px 0", borderBottom: "1px solid #edf2f7" }}>
              <div style={{ flex: 1 }}>
                <strong>{item.product.name}</strong>
                <div style={{ fontSize: "13px", color: "#718096" }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontWeight: "bold", color: "#2b6cb0" }}>{item.subtotal?.toLocaleString()} RWF</div>
            </div>
          ))}
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <h4>Total Items: {cart.totalItems}</h4>
            <h3 style={{ color: "#2b6cb0" }}>Total: {cart.totalPrice?.toLocaleString()} RWF</h3>
            <button onClick={onCheckoutClick} style={{ padding: "10px 20px", backgroundColor: "#319795", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
