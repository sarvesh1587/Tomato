import Food from "../Models/foodModel.js"; // ✅ Use Food (capital F)
import fs from "fs";
import path from "path";

// ADD FOOD ITEM
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required!",
      });
    }

    const { name, description, price, category } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const image_filename = req.file.filename;

    const food = new Food({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price), // ✅ Convert to number
      category: category.trim(),
      image: image_filename,
    });

    await food.save();

    res.status(201).json({
      success: true,
      message: "Food added successfully!",
      data: food,
    });
  } catch (error) {
    console.error("Error adding food:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while adding food",
      error: error.message,
    });
  }
};

// GET ALL FOOD ITEMS - FIXED VERSION
const listfood = async (req, res) => {
  try {
    console.log("Fetching food items...");

    // ✅ Use Food model (capital F)
    const foodlist = await Food.find({}).sort({ createdAt: -1 });

    console.log(`Found ${foodlist.length} items`);

    // Always return data as array
    res.json({
      success: true,
      message:
        foodlist.length === 0 ? "No food items found" : "Food list retrieved",
      data: foodlist || [], // ✅ Ensure array is returned
    });
  } catch (error) {
    console.error("Error fetching food list:", error.message);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "Server error while fetching food list",
      data: [], // ✅ Always return empty array
    });
  }
};

// REMOVE FOOD ITEM
const removeFood = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required!",
      });
    }

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item doesn't exist!",
      });
    }

    // Delete image file
    if (food.image) {
      const imagePath = path.join("uploads", food.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Image deleted:", food.image);
      }
    }

    await Food.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Food deleted successfully!",
    });
  } catch (error) {
    console.error("Error removing food:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting food",
      error: error.message,
    });
  }
};

export { addFood, listfood, removeFood };
