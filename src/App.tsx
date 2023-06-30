import { Route, Routes } from "react-router-dom";

import Login from "./pages/Auth/login";

import Defautlayout from "./pages/Defautlayout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/*" element={<Defautlayout />} />
    </Routes>
  );
};

export default App;
