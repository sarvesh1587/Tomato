import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

// Check if keys exist
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ Razorpay keys are missing in .env file");
  console.error("Please add:");
  console.error("RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx");
  console.error("RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("✅ Razorpay configured successfully");

export default razorpay;
