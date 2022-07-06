import { React, useEffect } from "react";
import { Button } from '@mui/material'
import EnviroMap from "../map/enviroMap"
import SendButton from "../components/sendData";
import '../styles/Map.css'

export default function Map() {
  return <>
    <EnviroMap />
    <div style={{width: "100%", height: "60px"}}>
      <Button variant="contained" disableElevation id="connectButton" onClick={connect}>Connect</Button>
    </div>
    <SendButton />
  </>;

function connect(event) {
  event.stopPropagation()
  event.preventDefault()
  if (isWebBluetoothEnabled()) {
      getDeviceInfo()
  }
}

}