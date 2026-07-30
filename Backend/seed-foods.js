import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./Models/foodModel.js";

dotenv.config();

const foods = [
  {
    name: "Pizza Margherita",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 299,
    category: "Pizza",
    image: "food_1.png"
  },
  {
    name: "Burger Deluxe",
    description: "Juicy beef patty with lettuce, tomato, and cheese",
    price: 249,
    category: "Burger",
    image: "food_2.png"
  },
  {
    name: "Sushi Platter",
    description: "Fresh sushi with salmon, tuna, and avocado",
    price: 499,
    category: "Sushi",
    image: "food_3.png"
  },
  {
    name: "Pasta Carbonara",
    description: "Creamy pasta with bacon, eggs, and parmesan",
    price: 349,
    category: "Pasta",
    image: "food_4.png"
  },
  {
    name: "Chicken Biryani",
    description: "Fragrant rice with spiced chicken and herbs",
    price: 399,
    category: "Indian",
    image: "food_5.png"
  },
  {
    name: "Veggie Burger",
    description: "Plant-based patty with fresh vegetables",
    price: 199,
    category: "Burger",
    image: "food_6.png"
  },
  {
    name: "Chocolate Cake",
    description: "Rich chocolate cake with ganache",
    price: 149,
    category: "Dessert",
    image: "food_7.png"
  },
  {
    name: "Spring Rolls",
    description: "Crispy rolls with vegetables and dip",
    price: 179,
    category: "Appetizer",
    image: "food_8.png"
  }
];

async function seedFoods() {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI not found in .env");
    }
    
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");
    
    // Clear existing foods
    const deleted = await Food.deleteMany({});
    console.log(`🗑️ Cleared ${deleted.deletedCount} existing foods`);
    
    // Insert new foods
    const inserted = await Food.insertMany(foods);
    console.log(`✅ Added ${inserted.length} food items`);
    
    console.log("\n📋 Food items added:");
    inserted.forEach((f, i) => console.log(`   ${i+1}. ${f.name}: ₹${f.price}`));
    
    console.log("\n🎉 Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

seedFoods();