import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../../assets/assets";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Rolls",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validation
    if (!image) {
      toast.error("Please upload an image!");
      return;
    }

    if (!data.name || !data.description || !data.price || !data.category) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("image", image);

      const response = await axios.post(`${url}/api/food/add`, formData);

      if (response.data.success) {
        // Reset form
        setData({
          name: "",
          description: "",
          price: "",
          category: "Rolls",
        });
        setImage(false);
        toast.success(response.data.message || "Product added successfully!");
      } else {
        toast.error(response.data.message || "Failed to add product!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const imageStyles = {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "2px dashed #ddd",
    cursor: "pointer",
    maxWidth: "120px",
    maxHeight: "120px",
    display: "block",
  };

  return (
    <div className="add">
      {/* ✅ Add ToastContainer here */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              style={imageStyles}
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload_img"
            />
          </label>
          <input
            type="file"
            id="image"
            hidden
            required
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
          {image && (
            <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              Selected: {image.name}
            </p>
          )}
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            type="text"
            name="name"
            placeholder="Type Here"
            onChange={onChangeHandler}
            value={data.name}
            required
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            name="description"
            rows="6"
            placeholder="Write Content "
            onChange={onChangeHandler}
            value={data.description}
            required
          ></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              name="category"
              onChange={onChangeHandler}
              value={data.category}
              required
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Deserts">Deserts</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              type="Number"
              name="price"
              placeholder="$20"
              onChange={onChangeHandler}
              value={data.price}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
    </div>
  );
};

export default Add;
