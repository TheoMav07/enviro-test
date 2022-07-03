import { React } from "react";
import { Button } from '@mui/material'
import EnviroMap from "../map/enviroMap"
import './styles/Map.css'

export default function Map() {
    
  return <div>
    <EnviroMap />
    <div>
      <Button variant="contained" disableElevation id="connectButton" onClick={connect}>Connect</Button>
    </div>
    <h2 className="latitude">lat</h2>
    <h2 className="longitude">long</h2>
    <h2 className="accuracy">acc</h2>
  </div>;
}

function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
      console.log('Web Bluetooth API is not available in this browser!')
      return false
    }

    return true
}

function getDeviceInfo() {
    let options = {
        acceptAllDevices: true
    }
    console.log('Requesting Bluetooth Device...')
    navigator.bluetooth.requestDevice(options).then(device => {
      console.log('Name: ' + device.name)
    }).catch(error => {
      console.log('Argh! ' + error)
    })
}

function connect() {
    event.stopPropagation()
    event.preventDefault()
    if (isWebBluetoothEnabled()) {
        getDeviceInfo()
    }
}
