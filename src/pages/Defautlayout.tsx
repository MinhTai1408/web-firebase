import React from "react";
import { Route, Routes } from "react-router-dom";

import ForgotPassword from "./login/forgot_password";
import ForgotPasswordNew from "./login/forgot_password_new";

import Home from "./Home/Home";

import AuthRoutes from "../components/AuthAction";

import AddDevices from "../components/AddDevices";

import Edit from "../components/EditDevice";
import Device from "./Device/Device";
import ReadDevice from "../components/ReadDevice";

const Defautlayout = () => {
  return (
    <div>
      <Routes>
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/forgotnew" element={<ForgotPasswordNew />} />
        <Route element={<AuthRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/device" element={<Device />} />
          <Route path="/add-device" element={<AddDevices />} />
          <Route path="/edit-device/:id" element={<Edit />} />
          <Route path="/read-book/:id" element={<ReadDevice />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Defautlayout;
