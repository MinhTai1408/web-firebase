import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home/home";
import ForgotPassword from "./Auth/forgot_password";
import ForgotPasswordNew from "./Auth/forgot_password_new";

const Defautlayout = () => {
  return (
    <div>
      <Routes>
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/forgotnew" element={<ForgotPasswordNew />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
};

export default Defautlayout;
