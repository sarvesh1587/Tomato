import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { food_list as defaultFoodList } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";
  const [food_list, setFoodList] = useState(defaultFoodList);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token } },
        );
      } catch (error) {
        console.error("Failed to sync cart add:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 0) updated[itemId] -= 1;
      if (updated[itemId] <= 0) delete updated[itemId];
      return updated;
    });
    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } },
        );
      } catch (error) {
        console.error("Failed to sync cart remove:", error);
      }
    }
  };

  const getTotalCartamount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = food_list.find((food) => food._id === itemId);
        if (itemInfo) total += itemInfo.price * cartItems[itemId];
      }
    }
    return total;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) setFoodList(response.data.data);
    } catch (error) {
      console.error("Failed to fetch food list, using local fallback:", error);
      setFoodList(defaultFoodList);
    }
  };

  const loadCartData = async (savedToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token: savedToken } },
      );
      if (response.data.success) setCartItems(response.data.data || {});
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    foodList: food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartamount,
    url,
    serverURL: url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
