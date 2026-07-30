import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";

const PlaceOrder = () => {
  const { getTotalCartamount, token, foodList, cartItems, serverURL } =
    useContext(StoreContext);

  const [data, setdata] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setdata({ ...data, [name]: value });
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order items
      let orderItems = [];
      foodList.map((item) => {
        if (cartItems[item._id] > 0) {
          orderItems.push({
            name: item.name,
            price: item.price,
            quantity: cartItems[item._id],
            _id: item._id,
          });
        }
      });

      let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartamount() + 12,
      };

      // 1. Create order on backend
      let response = await axios.post(
        serverURL + "/api/order/place",
        orderData,
        {
          headers: { token },
        },
      );

      if (response.data.success) {
        // 2. Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert("Razorpay SDK failed to load. Please try again.");
          setLoading(false);
          return;
        }

        // 3. Open Razorpay checkout
        const options = {
          key: response.data.key,
          amount: response.data.amount,
          currency: response.data.currency,
          name: "Food Delivery App",
          description: "Order Payment",
          order_id: response.data.orderId,
          handler: async (paymentResponse) => {
            // 4. Verify payment
            try {
              const verificationResponse = await axios.post(
                serverURL + "/api/order/verify",
                {
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  dbOrderId: response.data.dbOrderId,
                },
              );

              if (verificationResponse.data.success) {
                alert("Payment successful! Your order has been placed.");
                window.location.href =
                  "/verify?success=true&orderId=" +
                  verificationResponse.data.orderId;
              } else {
                alert("Payment verification failed. Please contact support.");
              }
            } catch (error) {
              console.error("Verification error:", error);
              alert("Payment verification failed. Please contact support.");
            }
            setLoading(false);
          },
          prefill: {
            name: data.firstName + " " + data.lastName,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: "#F37254",
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            },
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        alert("Error placing order: " + response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Info</p>
        <div className="multi-fields">
          <input
            type="text"
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="First Name"
          />
          <input
            type="text"
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder="Last Name"
          />
        </div>
        <input
          type="email"
          name="email"
          required
          onChange={onChangeHandler}
          value={data.email}
          placeholder="Email"
        />
        <input
          type="text"
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            type="text"
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            placeholder="City"
          />
          <input
            type="text"
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            placeholder="Zip Code"
          />
          <input
            type="text"
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            placeholder="Country"
          />
        </div>
        <input
          type="text"
          name="phone"
          required
          onChange={onChangeHandler}
          value={data.phone}
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartamount()}</p>
          </div>
          <div className="cart-total-details">
            <p>Delivery Fees</p>
            <p>₹2</p>
          </div>
          <div className="cart-total-details">
            <p>Platform Charge</p>
            <p>₹10</p>
          </div>
          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{getTotalCartamount() + 12}</b>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Proceed To Payment"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
