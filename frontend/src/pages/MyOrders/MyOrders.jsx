import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/api/order/user-orders`,
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setData(response.data.data);
        setError(null);
      } else {
        setError("Could not load orders.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const statusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("paid") || s.includes("delivered")) return "status-success";
    if (s.includes("pending") || s.includes("processing"))
      return "status-pending";
    if (s.includes("cancel") || s.includes("fail")) return "status-failed";
    return "status-default";
  };

  if (!token) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="orders-empty-state">
          <img src={assets.parcel_icon} alt="" />
          <p>Please sign in to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {loading && (
        <div className="orders-list">
          {[1, 2, 3].map((n) => (
            <div className="order-card skeleton" key={n}>
              <div className="skeleton-box img-box"></div>
              <div className="skeleton-lines">
                <div className="skeleton-box line"></div>
                <div className="skeleton-box line short"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="orders-empty-state">
          <p className="error-text">{error}</p>
          <button className="retry-btn" onClick={fetchOrders}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="orders-empty-state">
          <img src={assets.parcel_icon} alt="" />
          <p>No orders yet — go treat yourself!</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="orders-list">
          {data.map((order, index) => (
            <div key={order._id || index} className="order-card">
              <div className="order-card-icon">
                <img src={assets.parcel_icon} alt="parcel" />
              </div>

              <div className="order-card-body">
                <p className="order-items">
                  {order.items.map((item, i) =>
                    i === order.items.length - 1
                      ? `${item.name} x${item.quantity}`
                      : `${item.name} x${item.quantity}, `,
                  )}
                </p>
                <p className="order-meta">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  {order.date
                    ? ` • ${new Date(order.date).toLocaleDateString()}`
                    : ""}
                </p>
              </div>

              <div className="order-card-amount">
                <p>${order.amount}.00</p>
              </div>

              <div className={`order-status ${statusClass(order.status)}`}>
                <span className="status-dot"></span>
                <b>{order.status}</b>
              </div>

              <button className="track-btn" onClick={fetchOrders}>
                Track Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
