import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../../Context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const normalize = (str) => (str || "").trim().toLowerCase();

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.length === 0 && <p>No food items available.</p>}
        {food_list.map((item, index) => {
          if (
            category === "All" ||
            normalize(category) === normalize(item.category)
          ) {
            return (
              <FoodItem
                key={item._id || index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
