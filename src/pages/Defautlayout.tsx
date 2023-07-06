import React from "react";
import { Route, Routes } from "react-router-dom";

import ForgotPassword from "./login/forgot_password";
import ForgotPasswordNew from "./login/forgot_password_new";

import Home from "./Home/Home";

import AuthRoutes from "../components/AuthAction";

import List from "./Device";
import AddDevices from "../components/AddDevices";

const Defautlayout = () => {
  return (
    <div>
      <Routes>
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/forgotnew" element={<ForgotPasswordNew />} />
        <Route element={<AuthRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/device" element={<List />} />
          <Route path="/add-device" element={<AddDevices />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Defautlayout;
