import express from "express";
import {
  addFood,
  listfood,
  removeFood,
} from "../Controllers/Foodcontroller.js";
import multer from "multer";
const foodRouter = express.Router();
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
// IMAGE UPLOAD
foodRouter.post("/add", upload.single("image"), addFood);
// GET LIST OF FOODS AVAILABLE
foodRouter.get("/list", listfood);
// DELETE A FOOD
foodRouter.post("/remove", removeFood);
export default foodRouter;
