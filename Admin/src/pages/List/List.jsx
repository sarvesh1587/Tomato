import React, { useEffect, useState } from "react";
import "./List.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const List = () => {
  const url = "http://localhost:4000";
  const [list, setlist] = useState([]);

  const fetchlist = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      console.log(response.data);

      if (response.data.success) {
        setlist(response.data.data);
        toast.success("Food List loaded successfully!!");
      } else {
        toast.error("No food items found!");
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to load food list!");
    }
  };

  useEffect(() => {
    fetchlist();
  }, []);

  const removeFood = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        const response = await axios.post(`${url}/api/food/remove`, { id });
        if (response.data.success) {
          toast.success("Food deleted!");
          fetchlist(); // Refresh the list
        } else {
          toast.error("Failed to delete!");
        }
      } catch (error) {
        toast.error("Error deleting!");
      }
    }
  };

  return (
    <div className="list add flex-col">
      <ToastContainer />
      <p>All Foods List</p>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`${url}/images/${item.image}`} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p
              onClick={() => removeFood(item._id)}
              style={{ cursor: "pointer", color: "red" }}
            >
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
