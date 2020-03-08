const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const apiPort = 5000
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");
var config = require('./config');

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

var firebaseConfig = config.firebaseConfig
  
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initilize Cloud Firestore
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

//initialize admin SDK using serciceAcountKey
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();


app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('yes.');
    console.log("no.");

    db.collection("cities").doc("asdf").set({
        name: "Los Angeles",
        state: "CA",
        country: "USA"
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
})

app.post('/createprofile', (req, res) => {
    res.send({express: "test"});
    employeeID = req.body.ID;
    firstName = req.body.FirstName;
    lastName = req.body.LastName;
    occupation = req.body.Occ;
    password = req.body.Pass;

    db.collection("Employees").doc(`${employeeID}`).set({
        ID: `${employeeID}`,
        FirstName: `${firstName}`,
        LastName: `${lastName}`,
        Occupation: `${occupation}`,
        Password: `${password}`
    })
    .then(function(){
        console.log("Employee successfully added!");
    })
    .catch(function(error) {
        console.error(error);
    });
})



app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });

  });

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))



