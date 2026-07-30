import React, { useContext } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
const Cart = () => {
  const navigate = useNavigate();
  const {
    foodList,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartamount,
    serverURL,
  } = useContext(StoreContext);
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {foodList.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id} className="cart-items-title cart-items-item">
                <img src={serverURL + "/images/" + item.image} />
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>${item.price * cartItems[item._id]}</p>
                <p
                  className="cross"
                  onClick={() => {
                    removeFromCart(item._id);
                  }}
                >
                  X
                </p>
              </div>
            );
          }
        })}
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartamount()}</p>
            </div>
            <div className="cart-total-details">
              <p>Delivery Fees</p>
              <p>{getTotalCartamount() === 0 ? 0 : 2}</p>
            </div>
            <div className="cart-total-details">
              <p>Platform Charge</p>
              <p>{getTotalCartamount() === 0 ? 0 : 10}</p>
            </div>
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {getTotalCartamount() === 0 ? 0 : getTotalCartamount() + 12}
              </b>
            </div>
            <button onClick={() => navigate("/order")}>
              Proceed To Checkout
            </button>
          </div>
        </div>
        <div className="card-promocode">
          <div>
            <p>Having Promocode?</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Enter Promocode" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
