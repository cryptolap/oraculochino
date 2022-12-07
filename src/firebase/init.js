import firebase from 'firebase/app'
import 'firebase/auth'

// The configuration below is not sensitive data. You can serenely add your config here
const config = {
  apiKey: "AIzaSyCAfqr9OfWSBPexhQr2K_BlJnL9BQYkI28",
  authDomain: "oraculochino-3f0ec.firebaseapp.com",
  databaseURL: "https://oraculochino-3f0ec.firebaseio.com",
  projectId: "oraculochino-3f0ec",
  storageBucket: "oraculochino-3f0ec.appspot.com",
  messagingSenderId: "670745991219",
  appId: "1:670745991219:web:50da341cd31347b3"
}

firebase.initializeApp(config)
