import { React } from "react";
import { Button } from '@mui/material'
import EnviroMap from "../map/enviroMap"
import './styles/Map.css'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from 'firebase/database'

export default function Map() {
    

var firebaseConfig = {
      apiKey: "AIzaSyBi2EOWgViitTUi4BlN1LuKM03sVEBXNhw",
      authDomain: "envirosocialv2.firebaseapp.com",
      databaseURL: "https://envirosocialv2.firebaseio.com",
      projectId: "envirosocialv2",
      storageBucket: "envirosocialv2.appspot.com",
      messagingSenderId: "239213374726",
      appId: "1:239213374726:web:2de2c647a3fc5be213c287",
      measurementId: "G-ZX6EYH5N9C"
    };
    
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const measurements = ref(database, "/Envirosocial")

    
  return <>
    <EnviroMap />
    <div style={{width: "100%", height: "60px"}}>
      <Button variant="contained" disableElevation id="connectButton" onClick={connect}>Connect</Button>
    </div>
    <div>
        <Button variant="contained" disableElevation id="sendButton" color="success" onClick={sendData}>Send Data</Button>
    </div>
  </>;
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

function connect(event) {
    event.stopPropagation()
    event.preventDefault()
    if (isWebBluetoothEnabled()) {
        getDeviceInfo()
    }
}

function sendData() {
    
}