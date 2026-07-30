import express from "express";
import cors from "cors";
import { connectdb } from "./Config/db.js";
import foodRouter from "./Routes/FoodRoutes.js";
import userRouter from "./Routes/UserRoute.js";
import dotenv from "dotenv";
import CartRouter from "./Routes/CartRoutes.js";
import orderRouter from "./Routes/OrderRoutes.js";

// Load environment variables FIRST
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// DB CONNECTION
connectdb();

// API ENDPOINTS
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", CartRouter);
app.use("/api/order", orderRouter);

// MOUNTING THE "UPLOADS" FOLDER ON "http://localhost/images/img_name.jpg"
app.use("/images", express.static("Uploads"));

app.get("/", (req, res) => {
  res.send("Api Working!!");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
