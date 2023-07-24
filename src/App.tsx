import { Route, Routes } from "react-router-dom";

import Defautlayout from "./pages/Defautlayout";
import Login from "./pages/login/login";
import { useAppDispatch } from "./hooks/storeHook";
import { useEffect } from "react";
import { auth } from "./Firebase";
import { login } from "./features/authSilce";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email)
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            photoUrl: user?.photoURL || null,
          })
        );
    });

    return () => unsubscribe();
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/*" element={<Defautlayout />} />
    </Routes>
  );
};

export default App;
