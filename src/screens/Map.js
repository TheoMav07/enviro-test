import React from "react";
import { Button } from '@mui/material'
import EnviroMap from "../map/enviroMap"
import './styles/Map.css'

export default function Map() {
    
  return <div>
    <EnviroMap />
    {/* <div style={{ width: "100%", height: "500px" }} id="enviroMap"></div> */}
    <div>
      <Button variant="contained" disableElevation id="connectButton">Connect</Button>
    </div>
  </div>;
}

const button = document.querySelector('#connectButton')
console.log(button)
