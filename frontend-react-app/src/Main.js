import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./splash/Login";
import Splash from "./splash/Splash";
import HomeContainer from "./dashboard/HomeContainer";
const Main = () => {
  return (
    // The Routes decides which element to show based on the current URL
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navbar childComponent={<Splash />}></Navbar>}
        />
        <Route
          path="/login"
          element={<Navbar childComponent={<Login />}></Navbar>}
        />
        <Route path="/home" element={<HomeContainer />} />
      </Routes>
    </BrowserRouter>
  );
};
export default Main;
