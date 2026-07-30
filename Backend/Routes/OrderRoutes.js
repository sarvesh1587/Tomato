import express from "express";
import authMiddleware from "../Middlewares/auth.js";
import {
  placeorder,
  verifyPayment,
  userOrders,
} from "../Controllers/OrderControllers.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeorder);
orderRouter.post("/verify", verifyPayment);
orderRouter.post("/user-orders", authMiddleware, userOrders);

export default orderRouter;
