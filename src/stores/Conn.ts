import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyAXjsKqzymDIVWDaEXK2_Qy5-DY2ruDeKc",
  authDomain: "produzione-6a1f0.firebaseapp.com",
  databaseURL:
    "https://produzione-6a1f0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "produzione-6a1f0",
  storageBucket: "produzione-6a1f0.appspot.com",
  messagingSenderId: "648443410621",
  appId: "1:648443410621:web:50f0fdcff02c5353079fd4"
}

const firebaseConfigsv = {
  apiKey: "AIzaSyCMyk5bJEFusSqCw0kl8yUHpCFT3CMpJDo",
  authDomain: "sviluppo-12ba0.firebaseapp.com",
  databaseURL: "https://sviluppo-12ba0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sviluppo-12ba0",
  storageBucket: "sviluppo-12ba0.firebasestorage.app",
  messagingSenderId: "760928346814",
  appId: "1:760928346814:web:479c00400975db6567f4ef"
}

export let DatabaseFirebase = "produzione"

//const app = (DatabaseFirebase === "produzione") ? initializeApp(firebaseConfig) : initializeApp(firebaseConfigsv)

let app
let sourceDB
let targetDB

if (DatabaseFirebase === "produzione") {
  app = initializeApp(firebaseConfig)
  const sourceApp = initializeApp(firebaseConfig)
  const targetApp = initializeApp(firebaseConfigsv, 'targetDB')
  
  sourceDB = getDatabase(sourceApp); // Realtime Database
  targetDB = getDatabase(targetApp); // Realtime Database  
} else {
  app = initializeApp(firebaseConfigsv)
 
}


const db = getDatabase(app)



export { db, sourceDB, targetDB }

