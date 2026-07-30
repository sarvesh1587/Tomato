import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../../assets/assets";
import { StoreContext } from "../../../Context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);
  const [imgError, setImgError] = useState(false);

  const resolveImageSrc = () => {
    if (imgError) return assets.logo;
    if (!image) return assets.logo;
    if (typeof image === "string" && image.startsWith("http")) return image;
    if (typeof image === "string") return `${url}/images/${image}`;
    return image;
  };

  const handleImgError = (e) => {
    console.warn(`Image failed to load for "${name}":`, e.target.src);
    setImgError(true);
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={resolveImageSrc()}
          alt={name}
          onError={handleImgError}
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="remove"
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="add"
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
