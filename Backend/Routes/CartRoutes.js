import express from "express";
import authMiddleware from "../Middlewares/auth.js";
import {
  getCart,
  removeFromCart,
  addToCart,
} from "../Controllers/CartControllers.js";
const CartRouter = express.Router();
CartRouter.post("/add", authMiddleware, addToCart);
CartRouter.post("/remove", authMiddleware, removeFromCart);
CartRouter.post("/get", authMiddleware, getCart);

export default CartRouter;
