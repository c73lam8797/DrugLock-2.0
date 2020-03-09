require('es6-promise').polyfill();
require('isomorphic-fetch');
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
    credentials: 'include',
    'Access-Control-Allow-Headers': 'Content-type, Accept, Access-Control-Request-Method',
    'Access-Control-Allow-Origin' : 'http://localhost:3000',
    'Access-Control-Allow-Credentials' : true,
}))
app.use(bodyParser.json())

var employees = []; 
function getDataFromDB(){
    db.collection("Employees").get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            employees.push({
                ...doc.data()
            })
        })
    })
    .catch(err=> {
        console.error("trouble getting data: ", err);
    })
}


//fetching data from database and storing it in a local array;
app.get('/getdata', (req,res) => {
    getDataFromDB();
    res.send("Data successfully retreieved.");
})

//writing user input into firebase
app.post('/createprofile', (req, res) => {
    let employeeFound = false;
    const employeeID = req.body.ID;

    //find to see if the employee exists 
    for (let i =0; i< employees.length; i++){
        if (employees[i]["ID"] == employeeID) {
            employeeFound = true;
        }
    }
    
    //if already found, don't make a new profile
    if (employeeFound){
        //notify that the employee exists 
        res.send({data: true})
    }
    //else we update our profile
    else { 
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

            //we notify that the employee does not exists
            res.send({data: false});

            //updating local employee array
            getDataFromDB(); 
        })
        .catch(function(error) {
            console.error(error);
        });
    }
})

//fetching employee information from array 
app.post('/login', (req ,res) => {
    const sentID = req.body.ID;
    const sentPassword = req.body.Password;

    var employeeFound = false; 
    var validPass = false;
    
    //searching for the employee in the array 
    for (let i =0; i< employees.length; i++){
        //if the employee exists, see if the passwords are the same
        if (employees[i]["ID"] == sentID) {
            employeeFound = true;
            validPass = (employees[i]["Password"] == sentPassword);
        }
    }

    //log if employee exists
    if (!employeeFound) {console.log("Employee not found!")}

    //return whether or not the login was valid
    res.send ({data: validPass});
})

//db.collection takes too long to retrieve data, and throws too many errors

    // let employeeInfo = {
    //     Password: "",
    // }

    // db.collection("Employees").doc(sentID).get()
    // .then(doc => {
    //     if(!doc.exists) { 
    //         console.log("Employee does not exist!");
    //     }
    //     else {
    //         console.log(doc.data()); //for debugging
    //         employeeInfo.Password = doc.data()["Password"];
    //         console.log("Employee data successfully retrieved!");
    //         x =  (sentPassword === employeeInfo.Password); //returns whether or not the passwords are the same
    //     }        
    //     Promise.resolve();
    // })
    // .then(() => {
    //     console.log(x);
    //     res.send ( { data: x } );
    // })
    // .catch(function(error) {
    //     console.error(error);
    // });    





app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))



