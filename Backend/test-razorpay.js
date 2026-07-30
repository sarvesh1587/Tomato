import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

console.log("🔍 Testing Razorpay Connection...");
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID || "❌ Not found");
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "✅ Found" : "❌ Not found");

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: 1000,
      currency: "INR",
      receipt: "test",
    });

    console.log("✅ Success! Order created:", order.id);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
} else {
  console.log("❌ Keys missing in .env file");
}