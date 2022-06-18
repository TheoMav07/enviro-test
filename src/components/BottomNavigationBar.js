import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export default function BottomNavigationBar() {
  const pathname = window.location.pathname;
  const [value, setValue] = React.useState(pathname);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <BottomNavigation
        sx={{ width: "100%", bottom: "0", position: "fixed" }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Dashboard"
          value="/"
          icon={<span className="material-icons">dashboard</span>}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="Leaderboard"
          value="/leaderboard"
          icon={<span className="material-icons">leaderboard</span>}
          component={Link}
          to="/leaderboard"
        />
        <BottomNavigationAction
          label="Map"
          value="/map"
          icon={<span className="material-icons">map</span>}
          component={Link}
          to="/map"
        />
        <BottomNavigationAction
          label="Graphs"
          value="/graphs"
          icon={<span className="material-icons">show_chart</span>}
          component={Link}
          to="/graphs"
        />
        <BottomNavigationAction
          label="Profile"
          value="/profile"
          icon={<span className="material-icons">person</span>}
          sx={{ marginRight: "15px" }}
          component={Link}
          to="/profile"
        />
      </BottomNavigation>
      <Outlet />
    </>
  );
}
