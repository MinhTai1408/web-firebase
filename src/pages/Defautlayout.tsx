import React from "react";
import { Route, Routes } from "react-router-dom";

import ForgotPassword from "./login/forgot_password";
import ForgotPasswordNew from "./login/forgot_password_new";

import AuthRoutes from "../components/AuthAction";

import AddDevices from "../components/deviceCompo/ThemTb";

import ReadDevice from "../components/deviceCompo/DocTb";
import Service from "./services/DichVu";

import EditService from "../components/serviceCompo/SuaDv";
import EditDevice from "../components/deviceCompo/SuaTb";
import AddService from "../components/serviceCompo/ThemDv";

import ReadService from "../components/serviceCompo/DocDv";
import Accounts from "./Accounts/TaiKhoan";
import AddAccounts from "../components/accountsCompo/ThemTaiKhoan";

import EditAccount from "../components/accountsCompo/SuaTaiKhoan";
import Profile from "./profile/Profile";
import AddCapSo from "../components/capso/ThemCapSo";
import CapSo from "./QuanLiCapSo/CapSo";
import ReadCapSo from "../components/capso/DocCapSo";

import Dashboards from "./Home/Home";
import LapBaoCao from "./baocao/LapBaoCao";
import Device from "./Device/ThietBi";
import NhatKyHoatDong from "./nhatkyhoatdong/NhatKyHoatDong";
import QuanlyVaitro from "./quanlyvaitro/QuanlyVaitro";
import ThemVaiTro from "../components/vaitro/ThemVaiTro";
import SuaVaiTro from "../components/vaitro/SuaVaiTro";

const Defautlayout = () => {
  return (
    <div>
      <Routes>
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/forgotnew" element={<ForgotPasswordNew />} />

        <Route element={<AuthRoutes />}>
          <Route path="/profile" element={<Profile />} />

          <Route path="/home" element={<Dashboards />} />

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

          <Route path="/report" element={<LapBaoCao />} />

          <Route path="/settings/roles" element={<QuanlyVaitro />} />
          <Route path="/settings/roles/add-roles" element={<ThemVaiTro />} />
          <Route
            path="/settings/roles/edit-roles/:id"
            element={<SuaVaiTro />}
          />

          <Route path="/settings/accounts" element={<Accounts />} />
          <Route
            path="/settings/accounts/add-accounts"
            element={<AddAccounts />}
          />
          <Route
            path="/settings/accounts/edit-accounts/:id"
            element={<EditAccount />}
          />

          <Route path="/settings/users" element={<NhatKyHoatDong />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Defautlayout;
