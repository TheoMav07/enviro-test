import React from 'react';
import { Button } from '@mui/material'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, child } from 'firebase/database'
import '../styles/Map.css'

function SendButton() {
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_DATABASE_URL,
        projectId: process.env.REACT_APP_PROJECT_ID,
        storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_SENDER_ID,
        appId: process.env.REACT_APP_APP_ID
      };
    
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const measurements = ref(database, "Envirosocial")
    const now = new Date()
    const year = now.getFullYear()
    var month = now.getMonth() + 1
    var date = now.getDate()
    var hours = now.getHours()
    var minutes = now.getMinutes() 
    var seconds = now.getSeconds()
    if (month < 10) {
        month.toString()
        month = "0" + month
    }
    if (date < 10) {
        date.toString()
        date = "0" + date
    }
    if (hours < 10) {
        hours.toString()
        hours = "0" + hours
    }
    if (minutes < 10) {
        minutes.toString()
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds.toString()
        seconds = "0" + seconds
    }
    const fullDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
    const userId = "Test User"

    function sendData() {
        const key = userId + "*" + fullDate
        const data = latitude + "*" + longitude + "*" + "26.47*44.05*1018.89*10*2*67.72"
        var updates = {}
        updates[key] = data
        update(measurements, updates)
    }

    return (
    <div>
        <Button variant="contained" disableElevation id="sendButton" color="success" onClick={sendData}>Send Data</Button>
    </div>
    )
}

export default SendButton;