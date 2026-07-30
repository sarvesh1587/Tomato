import orderModel from "../Models/OrderModel.js";
import UserModel from "../Models/UserModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Checking Razorpay Keys:");
console.log(
  "RAZORPAY_KEY_ID:",
  process.env.RAZORPAY_KEY_ID ? "✅ Set" : "❌ Missing",
);
console.log(
  "RAZORPAY_KEY_SECRET:",
  process.env.RAZORPAY_KEY_SECRET ? "✅ Set" : "❌ Missing",
);

let razorpay;
try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are missing in .env file");
  }
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("✅ Razorpay initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Razorpay:", error.message);
}

const placeorder = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.body.items || !req.body.amount || !req.body.address) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new orderModel({
      userId: userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
      status: "Pending",
    });

    await newOrder.save();
    await UserModel.findByIdAndUpdate(req.userId, { cartData: {} });

    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message:
          "Payment service is not configured. Please check Razorpay keys.",
      });
    }

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: `order_${newOrder._id}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    await orderModel.findByIdAndUpdate(newOrder._id, {
      razorpayOrderId: razorpayOrder.id,
    });

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      dbOrderId: newOrder._id,
    });
  } catch (error) {
    console.log("Error in placeorder:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await orderModel.findByIdAndUpdate(dbOrderId, {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        payment: true,
        status: "Paid",
      });

      res.json({
        success: true,
        message: "Payment verified successfully",
        orderId: dbOrderId,
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.log("Error in verifyPayment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { placeorder, verifyPayment, userOrders };
