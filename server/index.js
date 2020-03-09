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
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(bodyParser.json())
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });


//writing user input into firebase
app.post('/createprofile', (req, res) => {
    const employeeID = req.body.ID;
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const occupation = req.body.Occ;
    const password = req.body.Pass;

    db.collection("Employees").doc(employeeID).set({
        ID: employeeID,
        FirstName: firstName,
        LastName: lastName,
        Occupation: occupation,
        Password: password
    })
    .then(function(){
        console.log("Employee successfully added!");
        res.send({data: "Success"});

    })
    .catch(function(error) {
        console.error(error);
    });
})


//fetching employee information from database 
app.post('/login', (req ,res) => {
    const sentID = req.body.ID;
    const sentPassword = req.body.Password;

    let employeeInfo = {
        Password: "",
    }
    var x = false; 
    
    db.collection("Employees").doc(sentID).get()
    .then(doc => {
        if(!doc.exists) { 
            console.log("Employee does not exist!");
        }
        else {
            console.log(doc.data()); //for debugging
            employeeInfo.Password = doc.data()["Password"];
            console.log("Employee data successfully retrieved!");
            x =  (sentPassword === employeeInfo.Password); //returns whether or not the passwords are the same
        }        
        Promise.resolve();
    })
    .then(() => {
        console.log(x);
        res.send ( { data: x } );
    })
    .catch(function(error) {
        console.error(error);
    });    

    
})


app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))



