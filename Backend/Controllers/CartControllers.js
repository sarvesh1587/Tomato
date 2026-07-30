import userModel from "../Models/UserModel.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    let userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};
    cartData[req.body.itemId] = (cartData[req.body.itemId] || 0) + 1;
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    let userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};
    if (cartData[req.body.itemId] > 0) cartData[req.body.itemId] -= 1;
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed From cart!" });
  } catch (error) {
    console.log("Internal server error ->", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    let userData = await userModel.findById(userId);
    res.json({ success: true, data: userData.cartData || {} });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
