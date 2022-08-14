import "./styles.css";
import React from "react";
import BottomNavigationBar from "./components/BottomNavigationBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import Leaderboard from "./screens/Leaderboard";
import Map from "./screens/Map";
import Graphs from "./screens/Graphs";
import Profile from "./screens/Profile";
import Login from "./screens/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BottomNavigationBar />}>
          <Route index element={<Dashboard />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="map" element={<Map />} />
          <Route path="graphs" element={<Graphs />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
