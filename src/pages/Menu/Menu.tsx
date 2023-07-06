import React from "react";
import { useAppDispatch } from "../../hooks/storeHook";
import { auth } from "../../Firebase";
import { signOut } from "firebase/auth";
import { logout } from "../../features/authSilce";
import Slide from "./Slide";

const Menu = () => {
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
  };
  return (
    <div>
      <Slide handleLogout={handleLogout} />
    </div>
  );
};

export default Menu;
