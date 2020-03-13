const express = require('express')
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

//adding or editing a new drug into the database 
app.post('/newdrug', (req, res) => {
    const drugID = req.body.ID;
    var drugFound = false;

    db.collection("Drugs").doc(drugID).get()
    .then (data => {
        //if data exists for that drug already and the person doesn't want to edit
            
        console.log(data.exists && req.body.Edit==false); //for debugging

        //if the data exist AND the user does not want to edit the drug
        if (data.exists && (req.body.Edit==false)){ 
            drugFound = true; 
            console.log("Drug already exists in the database")
            res.send({data: drugFound}); //send a response that the drug was already found
        }

        //if drug doesnt already exist or the person wants to edit
        else { 
            //write in the new data
            const drugName     = req.body.DrugName;
            const dosage       = req.body.Dosage;
            const instructions = req.body.Instructions;
            const risk         = req.body.Risk;
            const effect       = req.body.Effect;

            //write in passed input at the given drugID
            db.collection("Drugs").doc(drugID).set({
                ID          : drugID,
                DrugName    : drugName,
                Dosage      : dosage,
                Instructions: instructions,
                Risk        : risk,
                Effect      : effect,
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


//retrieving drugs from the database
app.get('/getdrugs', (req, res) => {
    var drugData = {};
    db.collection("Drugs").get()
    .then (snapshot => {
        //map each snapshot to its specific document and its properties
        snapshot.forEach(doc =>{
            let obj = {}; //create a temporary object
            obj[doc.data().ID] = doc.data() //set the key to be the drugID, and then the values to be ALL its properties (including ID)
            drugData = {...drugData, ...obj}//add it on to the object
        })
    })
    .then (function(){
        console.log(drugData); //for debugging
        res.send ({data: drugData});
    })
    .catch(err => console.error(err))
})

//create an employee profile
app.post('/createprofile', (req, res) => {
    const employeeID = req.body.ID;
    var employeeFound = false;

    db.collection("Employees").doc(employeeID).get()
    .then (data => {
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

//deleting drugs from the database at given ID
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

    //storing the passed in user input 
    const sentID = req.body.ID;
    const sentPassword = req.body.Password;

    let employeeInfo = {
        Password: "",
    }

    //x is a variable that holds the comparison of the passwords 
    var x   = false;
    //create variables to store data retrieval from database
    var FN  = ""; //firstname
    var LN  = ""; //lastname
    var OCC = ""; //occupation 
    
    db.collection("Employees").doc(sentID).get()
    .then(doc => {
        //if there is not existing data for that employee
        if(!doc.exists) { 
            console.log("Employee does not exist!");
        }
        //otherwise, check the data 
        else {
            employeeInfo.Password = doc.data()["Password"]; //set employeeInfo.Password to the password found at the given document 
            console.log("Employee data successfully retrieved!");
            x =  (sentPassword === employeeInfo.Password); //determines whether or not the passwords are the same

            //store retrieved data from database 
            FN  = doc.data()["FirstName"];
            LN  = doc.data()["LastName"];
            OCC = doc.data()["Occupation"];
        }        
        Promise.resolve();
    })
    .then(() => {
        console.log("passwords are the same: ", x); //for debugging
        
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


