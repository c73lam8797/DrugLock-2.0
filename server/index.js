const express = require('express')
// const bodyParser = require('body-parser')
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

//initialize admin SDK using serviceAcountKey
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin     : 'http://localhost:3000',
    credentials: 'include',
}))

// ---------- <<< END OF CONFIGURATION >>>-------------
app.post('/newdrug', (req, res) => {
    const drugID = req.body.ID;
    var drugFound = false;

    db.collection("Drugs").doc(drugID).get()
    .then (data => {
        //if data exists for that drug
        if (data.exists){ 
            drugFound = true; 
            res.send({data: drugFound}); //send a response that the drug was already found
        }
        //if drug doesnt already exist
        else { 
            //write in the new data
            const drugName = req.body.DrugName;
            const dosage = req.body.Dosage;
            const instructions = req.body.Instructions;
            const risk = req.body.Risk;
            const effect = req.body.Effect;

            db.collection("Drugs").doc(drugID).set({
                ID: drugID,
                DrugName: drugName,
                Dosage: dosage,
                Instructions: instructions,
                Risk: risk,
                Effect: effect,
            })  
            .then(function(){
                console.log("Drug successfully added!");
                res.send({data: drugFound}); //send a response that the drug wasn't already found
    
            })
            .catch(function(error) {
                console.error(error);
            });
        }
    })
});
app.get('/getdrugs', (req, res) => {
    var drugData = {};
    db.collection("Drugs").get()
    .then (snapshot => {
        snapshot.forEach(doc =>{
            let obj = {};
            obj[doc.data().ID] = doc.data()
            drugData = {...drugData, ...obj}
        })
    })
    .then (function(){
        console.log(drugData);
        res.send ({data: drugData});
    })
    .catch(err => console.error(err))
})


app.post('/createprofile', (req, res) => {
    const employeeID = req.body.ID;
    var employeeFound = false;

    db.collection("Employees").doc(employeeID).get()
    .then (data => {
        console.log(data.exists);
        //if data exists for that employeeID
        if (data.exists){ 
            employeeFound = true;
            res.send({data: employeeFound}); //send a response that employee was found
        }
        //if employee doesn't exist
        else {
            //write in the new data 
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
                res.send({data: employeeFound}); //send a response that employee did not already exist
    
            })
            .catch(function(error) {
                console.error(error);
            });
        }
    })
});

app.delete('/deleteDrug', (req, res) => {
    const id = req.body.ID;
    
    db.collection("Drugs").doc(id).delete()
    .then(function(){
        res.send({data: "Success"})
    })
    .catch(err => console.error(err))
})

//fetching employee information from database 
app.post('/login', (req ,res) => {
    console.log(req.body);
    const sentID = req.body.ID;
    const sentPassword = req.body.Password;

    let employeeInfo = {
        Password: "",
    }
    var x   = false;
    var FN  = "";
    var LN  = "";
    var OCC = "";
    
    db.collection("Employees").doc(sentID).get()
    .then(doc => {
        //if there is not existing data for that employee
        if(!doc.exists) { 
            console.log("Employee does not exist!");
        }
        //otherwise, check the data 
        else {
            employeeInfo.Password = doc.data()["Password"];
            console.log("Employee data successfully retrieved!");
            x =  (sentPassword === employeeInfo.Password); //returns whether or not the passwords are the same
            FN  = doc.data()["FirstName"];
            LN  = doc.data()["LastName"];
            OCC = doc.data()["Occupation"];
        }        
        Promise.resolve();
    })
    .then(() => {
        console.log(x);
        //send back the retrieved data, and whether or not the login was valid
        res.send ( { 
            data: x,
            firstName: FN,
            lastName : LN,
            occupation: OCC,

         });
    })
    .catch(function(error) {
        console.error(error);
    });    
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))


