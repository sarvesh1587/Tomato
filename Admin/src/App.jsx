import React from "react";
import Sidebar from "./components/sidebar/Sidebar/sidebar";
import Navbar from "./components/sidebar/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import List from "./pages/List/List";
import Order from "./pages/Add/List/Order/Order";
import Add from "./pages/Add/List/Add";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  const url = "http://localhost:4000";
  return (
    <div>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Order url={url} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
