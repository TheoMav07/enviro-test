import React from "react";

export default function EnviroMap() {
            var all = L.layerGroup();
			var today = L.layerGroup();
			var lastHour = L.layerGroup();
			//Αρχικά δημιουργώ τον χάρτη και τον βάζω στην θέση 0,0 και χωρίς ζουμ
			const mymap = L.map('enviroMap', {layers: lastHour}).fitWorld();
			//Δημιουργεί τη σταθερή μεταβλητή του url για τα tiles του χάρτη
			const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			//Απαιτείται για λόγους copyright
			const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
			//Εισάγει τα tiles στον χάρτη
			const tiles = L.tileLayer(tileUrl , {attribution});
			tiles.addTo(mymap);
			var overlayMaps = {
					"Last Hour": lastHour,
					"Today": today,
					"All": all
				};
			var layerControl = L.control.layers(overlayMaps).addTo(mymap);
			
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
			
			//Κάνω την σύνδεση με την βάση μας στην firebase
            //TODO: Environmental Variables
			var firebaseConfig = {
				apiKey: process.env.API_KEY,
				authDomain: process.env.AUTH_DOMAIN,
				databaseURL: process.env.DATABASE_URL,
				projectId: process.env.PROJECT_ID,
				storageBucket: process.env.STORAGE_BUCKET,
				messagingSenderId: process.env.MESSAGING_SENDR_ID,
				appId: process.env.APP_ID,
				measurementId: process.env.MEASUREMENT_ID
			};


			// Αρχικοποιώ την σύνδεση
			firebase.initializeApp(firebaseConfig);
			//Δημιουργώ μια μεταβλητή για να αποθηκεύσω την αναφορά στην βάση δεδομένων
			database = firebase.database();
			//Δημιουργώ μια μεταβλητή για να αποθηκεύσω την αναφορά στα δεδομένα της βάσης
			var ref = database.ref('Envirosocial');
			//Όταν πάρω τα δεδομένα σωστά θα τρέξει η gotData αλλιώς θα τρέξει η errData
			ref.on('value',gotData,errData);
			//Κάθε φορά που παίρνω δεδομένα θα τρέχει η gotData
			function gotData(data) {
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
					var latitude = metrisi_data[0].substr(1,metrisi_data[0].length);
					var longtitude = metrisi_data[1];
					var temperature = Number(metrisi_data[2]);
					var humidity = Number(metrisi_data[3]);
					var pressure = Number(metrisi_data[4]);
					var gases = Number(metrisi_data[5]);
					var sound = Number(metrisi_data[6]);
					var particles = Number(metrisi_data[7].substr(0,metrisi_data[7].length-4));
					//Προσθέτω έναν marker στον πίνακα markers με το γεωγραφικό πλάτος και μήκος της κάθε μέτρησης
					if (temperature > 10 && temperature < 25) {
						markers[i] = L.marker([latitude, longtitude],{icon: greenIcon}).addTo(all);
					} else if (temperature > 0 && temperature < 30) {
						markers[i] = L.marker([latitude, longtitude],{icon: orangeIcon}).addTo(all);
					} else {
						markers[i] = L.marker([latitude, longtitude],{icon: redIcon}).addTo(all);
					}
					//Προσθέτω στον marker τα δεδομένα σε παράθυρο pop up
					markers[i].bindPopup("<b>Measurement by "+username+"</b><br>Date:"+date+"<br>Temperature: "+temperature+" Celcius<br>Humidity: "+humidity+"%<br>Pressure: "+pressure+" hPa<br>Gases: "+gases+"%<br>Noise Level: "+sound+"%<br>Particles Concentration: "+particles+" μg/m3");
					var msBetweenDates = Math.abs(todayDate.getTime() - dateNum.getTime());
					var hoursBetweenDates = msBetweenDates / (1000 * 60 * 60 );
					if (hoursBetweenDates < 24) {
						markers[i].addTo(today);
					}
					if (hoursBetweenDates < 1) {
						markers[i].addTo(lastHour);
					}
					//markers[i] = L.marker([latitude, longtitude]).addTo(mymap);					
				}
				
			}
			//Εμφανίζουμε την θέση μας στον χάρτη με έναν marker και έναν κύκλο που δείχνει την ακρίβεια
			function onLocationFound(e) {
				var radius = e.accuracy / 2;
				mymap.setView(e.latlng, 20);
				L.marker(e.latlng).addTo(mymap)
				.bindPopup("You are within " + radius + " meters from this point").openPopup();
				L.circle(e.latlng, radius).addTo(mymap);
			}
			function onLocationError(e) {
				alert(e.message);
			}
			mymap.on('locationfound', onLocationFound);
			mymap.on('locationerror', onLocationError);
			mymap.locate({setView: true, maxZoom: 10});
			function errData(err) {
				console.log('Error!');
				console.log(err);
			}
  return <div id="enviroMap"></div>;
}
