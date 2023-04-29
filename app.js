require('dotenv').config();

const express = require('express')
const admin = require('firebase-admin');

const serviceAccount = require(process.env.FIREBASE_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://text-service-c6351-default-rtdb.europe-west1.firebasedatabase.app/'
});

const app = express()
const port = 3000

app.get('/', (req, res) => {
    const database = admin.database();
    const ref = database.ref('test');
    ref.set('Hello, world again!').then(() => {
        res.send('Firebase initialised successfully!')
    }).catch(error => {
        console.error('Error writing to Firebase:', error);
        res.status(500).send('Error writing to Firebase');
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})