import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesnt exists!!" });
    }
    const ismatched = bcrypt.compareSync(password, user.password);
    if (!ismatched) {
      return res.json({ success: false, message: "Incorrect Password!" });
    }
    const token = createToken(user._id);
    res.json({ success: true, token: token });
  } catch (error) {
    console.log("Internal Server Error !");
    return res.json({ success: false, error: error.message });
  }
};

const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User Already exists!" });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email address!",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password!!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      name: name,
      email: email,
      password: hashedpassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token: token });
  } catch (error) {
    console.log("Internal Server Error");
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser };
