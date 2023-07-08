import React from "react";
import { Route, Routes } from "react-router-dom";

import ForgotPassword from "./login/forgot_password";
import ForgotPasswordNew from "./login/forgot_password_new";

import Home from "./Home/Home";

import AuthRoutes from "../components/deviceCompo/AuthAction";

import AddDevices from "../components/deviceCompo/AddDevices";

import Edit from "../components/deviceCompo/EditDevice";
import Device from "./Device/Device";
import ReadDevice from "../components/deviceCompo/ReadDevice";
import Service from "./services/Service";

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
          <Route path="/service" element={<Service />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Defautlayout;
