import React from "react";
import { Route, Routes } from "react-router-dom";

import ForgotPassword from "./login/forgot_password";
import ForgotPasswordNew from "./login/forgot_password_new";

import AuthRoutes from "../components/deviceCompo/AuthAction";

import AddDevices from "../components/deviceCompo/AddDevices";

import Device from "./Device/Device";
import ReadDevice from "../components/deviceCompo/ReadDevice";
import Service from "./services/Service";

import EditService from "./../components/serviceCompo/EditService";
import EditDevice from "../components/deviceCompo/EditDevice";
import AddService from "../components/serviceCompo/AddService";

import ReadService from "../components/serviceCompo/Read";
import Accounts from "./Accounts/Accounts";
import AddAccounts from "../components/accountsCompo/AddAccounts";

import EditAccount from "./../components/accountsCompo/EditAccount";
import Profile from "./profile/Profile";
import AddCapSo from "./../components/capso/AddCapSo";
import CapSo from "./QuanLiCapSo/CapSo";
import ReadCapSo from "../components/capso/ReadCapSo";

const Defautlayout = () => {
  return (
    <div>
      <Routes>
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/forgotnew" element={<ForgotPasswordNew />} />
        <Route element={<AuthRoutes />}>
          <Route path="/profile" element={<Profile />} />

          <Route path="/device" element={<Device />} />
          <Route path="/add-device" element={<AddDevices />} />
          <Route path="/edit-device/:id" element={<EditDevice />} />
          <Route path="/read-book/:id" element={<ReadDevice />} />

          <Route path="/service" element={<Service />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/edit-service/:id" element={<EditService />} />
          <Route path="/read-service/:id" element={<ReadService />} />

          <Route path="/number" element={<CapSo />} />
          <Route path="/add-number" element={<AddCapSo />} />
          <Route path="/read-capso/:id" element={<ReadCapSo />} />

          <Route path="/settings/accounts" element={<Accounts />} />
          <Route
            path="/settings/accounts/add-accounts"
            element={<AddAccounts />}
          />
          <Route
            path="/settings/accounts/edit-accounts/:id"
            element={<EditAccount />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default Defautlayout;
