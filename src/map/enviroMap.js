import { React, useEffect } from 'react'
import L from 'leaflet'
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

export default function EnviroMap() {
  var all = L.layerGroup();
  var today = L.layerGroup();
  var lastHour = L.layerGroup();

  useEffect(() => {
    var container = L.DomUtil.get('enviroMap');
    if (container != null) {
      container._leaflet_id = null;
    }
    const mymap = L.map('enviroMap', {layers: lastHour}).fitWorld();
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(mymap);
    var overlayMaps = {
      "Last Hour": lastHour,
      "Today": today,
      "All": all
    };
    var layerControl = L.control.layers(overlayMaps).addTo(mymap);
    
    if (navigator.geolocation) { 
        navigator.geolocation.getCurrentPosition( setCurrentPosition, positionError, { 
            enableHighAccuracy: true, 
            timeout: 15000, 
            maximumAge: 0 
        } );
    } 
    
    /*var latitude = document.querySelector( '.latitude' )
    var longitude = document.querySelector( '.longitude' )
    var accuracy = document.querySelector( '.accuracy' ) */
    
    function setCurrentPosition( position ) { 
       var latitude = position.coords.latitude; 
       var longitude = position.coords.longitude; 
       var accuracy = position.coords.accuracy;
       var radius = accuracy / 2;
       mymap.setView([latitude, longitude], 20);
       L.marker([latitude, longitude]).addTo(mymap).bindPopup("You are in lat: " + latitude + " and long: " + longitude + ".").openPopup();
       L.circle([latitude, longitude], radius).addTo(mymap);
    }
    
    function positionError( error ) { 
    
        switch ( error.code ) { 
            case error.PERMISSION_DENIED: 
                
                console.error( "User denied the request for Geolocation." ); 
                break; 
    
            case error.POSITION_UNAVAILABLE: 
    
                console.error( "Location information is unavailable." ); 
                break; 
    
            case error.TIMEOUT: 
    
                console.error( "The request to get user location timed out." ); 
                break; 
    
            case error.UNKNOWN_ERROR: 
    
                console.error( "An unknown error occurred." ); 
                break; 
        }
    }
    
    /*mymap.on('locationfound', onLocationFound);
    mymap.on('locationerror', onLocationError);
    mymap.locate({ setView: true, maxZoom: 10 }); */

    /*function onLocationFound(e) {
      var radius = e.accuracy / 2;
      mymap.setView(e.latlng, 20);
      L.marker(e.latlng).addTo(mymap)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();
      L.circle(e.latlng, radius).addTo(mymap);
    }*/
    
    /*function onLocationError(e) {
      alert(e.message);
    }*/

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
    // Αρχικοποιώ την σύνδεση
    firebase.initializeApp(firebaseConfig);
    //Δημιουργώ μια μεταβλητή για να αποθηκεύσω την αναφορά στην βάση δεδομένων
    var database = firebase.database()
    //Δημιουργώ μια μεταβλητή για να αποθηκεύσω την αναφορά στα δεδομένα της βάσης
    var ref = database.ref('Envirosocial');
    //Όταν πάρω τα δεδομένα σωστά θα τρέξει η gotData αλλιώς θα τρέξει η errData
    ref.on('value', gotData, errData);

  }, []);


  function gotData(data) {
    var greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    var orangeIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    var redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    //Παίρνω τα δεδομένα στην μεταβλητή μετρήσεις
    var metriseis = data.val();
    //Παίρνω τα κλειδιά (όνομα χρήστη και ημερομηνία-ώρα) στην μεταβλητή keys
    var keys = Object.keys(metriseis);
    //Δημιουργώ έναν άδειο πίνακα markers στον οποίο θα βάζω τους markers με την κάθε μέτρηση
    var markers = [];
    var todayDate = new Date();
    //Για κάθε στοιχεία της βάσης δεδομένων κάνω τα παρακάτω
    for (var i = 0; i < keys.length; i++) {
      //var key = keys[i];
      //Στην λίστα key_data κρατάω το όνομα χρήστη και την ημερομηνία τα οποία χωρίζονται με *
      var key_data = keys[i].split("*");
      var username = key_data[0];
      var date = key_data[1]
      var dateForNum = date.split(/[-\s:]+/)
      var dateNum = new Date(dateForNum[0], dateForNum[1] - 1, dateForNum[2], dateForNum[3], dateForNum[4], dateForNum[5]);
      //Στην λίστα metrisi_data κρατάω τo latitude το longtitude την θερμοκαρασία την υγρασία το cο το μεθάνιο τα μικροσωματίδια και τον ήχο τα οποία χωρίζονται με *
      var metrisi_data = metriseis[keys[i]].split("*");
      var latitude = metrisi_data[0].substr(1, metrisi_data[0].length);
      var longtitude = metrisi_data[1];
      var temperature = Number(metrisi_data[2]);
      var humidity = Number(metrisi_data[3]);
      var pressure = Number(metrisi_data[4]);
      var gases = Number(metrisi_data[5]);
      var sound = Number(metrisi_data[6]);
      var particles = Number(metrisi_data[7].substr(0, metrisi_data[7].length - 4));
      //Προσθέτω έναν marker στον πίνακα markers με το γεωγραφικό πλάτος και μήκος της κάθε μέτρησης
      if (temperature > 10 && temperature < 25) {
        markers[i] = L.marker([latitude, longtitude], { icon: greenIcon }).addTo(all);
      } else if (temperature > 0 && temperature < 30) {
        markers[i] = L.marker([latitude, longtitude], { icon: orangeIcon }).addTo(all);
      } else {
        markers[i] = L.marker([latitude, longtitude], { icon: redIcon }).addTo(all);
      }
      //Προσθέτω στον marker τα δεδομένα σε παράθυρο pop up
      markers[i].bindPopup("<b>Measurement by " + username + "</b><br>Date:" + date + "<br>Temperature: " + temperature + " Celcius<br>Humidity: " + humidity + "%<br>Pressure: " + pressure + " hPa<br>Gases: " + gases + "%<br>Noise Level: " + sound + "%<br>Particles Concentration: " + particles + " μg/m3");
      var msBetweenDates = Math.abs(todayDate.getTime() - dateNum.getTime());
      var hoursBetweenDates = msBetweenDates / (1000 * 60 * 60);
      if (hoursBetweenDates < 24) {
        markers[i].addTo(today);
      }
      if (hoursBetweenDates < 1) {
        markers[i].addTo(lastHour);
      }
      //markers[i] = L.marker([latitude, longtitude]).addTo(mymap);					
    }

  }

  function errData(err) {
    console.log('Error!');
    console.log(err);
  }


  return <div style={{ width: "100%", height: "500px" }} id="enviroMap"></div>
}
