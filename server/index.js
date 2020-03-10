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

//initialize admin SDK using serviceAcountKey
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();

//cors and bodyparser configs
// app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin     : 'http://localhost:3000',
    credentials: 'include',
}))
// app.use(bodyParser.json())

// ---------- <<< END OF CONFIGURATION >>>-------------


// //storing data from firebase into a local array
// var employees = []; 
// async function getDataFromDB(){
//     // let response = false;
//     let response = await db.collection("Employees").get()
//     .then(snapshot => {
//         snapshot.forEach(doc => {
//             employees.push({
//                 ...doc.data()
//             })
//         })
//     })
//     .then(() => {
//         return true; //returns true when data is done being loaded
//     })
//     .catch(err=> {
//         console.error("trouble getting data: ", err);
//     })

//     if (response) {return response;} //will only return
// }

// //fetching data from database and storing it in a local array;
// app.get('/getdata', (req,res) => {
//   getDataFromDB()
//   .then(isLoaded => {
//         res.send ({data: isLoaded}); //will only return true
//   });
// })

// //writing user input into firebase
// app.post('/createprofile', (req, res) => {
//     let employeeFound = false;
//     const employeeID = req.body.ID;

//     //find to see if the employee exists 
//     for (let i =0; i< employees.length; i++){
//         if (employees[i]["ID"] == employeeID) {employeeFound = true;}
//     }
    
//     //if already found, don't make a new profile
//     if (employeeFound){
//         res.send({data: true}) //notify that the employee exists 
//     }
//     //else we update our profile
//     else { 
//         const firstName  = req.body.FirstName;
//         const lastName   = req.body.LastName;
//         const occupation = req.body.Occ;
//         const password   = req.body.Pass;
        
//         //updating db values 
//         db.collection("Employees").doc(employeeID).set({
//             ID          : employeeID,
//             FirstName   : firstName,
//             LastName    : lastName,
//             Occupation  : occupation,
//             Password    : password
//         })
//         .then(function(){
//             console.log("Employee successfully added!");
//             res.send({data: false}); //we notify that the employee does not exists
//             getDataFromDB(); //updating local employee array
//         })
//         .catch(function(error) {
//             console.error(error);
//         });
//     }
// })

// //fetching employee information from array 
// app.post('/login', (req ,res) => {
//     const sentID       = req.body.ID;
//     const sentPassword = req.body.Password;

//     var employeeFound  = false; 
//     var validPass      = false;
//     var FN             = "";
//     var LN             = "";
//     var OCC            = "";
    
//     //searching for the employee in the array 
//     for (let i =0; i< employees.length; i++){
//         //if the employee exists, see if the passwords are the same
//         if (employees[i]["ID"] == sentID) {
//             employeeFound = true;
//             validPass = (employees[i]["Password"] == sentPassword);
//             FN  = employees[i]["FirstName"];
//             LN  = employees[i]["LastName"];
//             OCC = employees[i]["Occupation"];
//         }
//     }

//     if (!employeeFound) {
//         console.log("Employee not found!") //log if employee exists 
//         res.send ({data: false})  //returns false if employee doesn't exist
//     } 
//     res.send ({//return whether or not the login was valid, along with employee info if it exists
//         data: validPass,
//         firstName: FN,
//         lastName : LN,
//         occupation: OCC,
//     }); 
// })

app.post('/createprofile', (req, res) => {
    const employeeID = req.body.ID;
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const occupation = req.body.Occ;
    const password = req.body.Pass;

    var employeeFound = false;

    db.collection("Employees").doc(employeeID).get()
    .then (data => {
        console.log(data.exists);
        if (data.exists){ //if data exists for that employeeID
            employeeFound = true;
            res.send({data: employeeFound});
        }
        else {
            db.collection("Employees").doc(employeeID).set({
                ID: employeeID,
                FirstName: firstName,
                LastName: lastName,
                Occupation: occupation,
                Password: password
            })  
            .then(function(){
                console.log("Employee successfully added!");
                res.send({data: employeeFound});
    
            })
            .catch(function(error) {
                console.error(error);
            });
        }
    })
    
    // if (!employeeFound) { //if the employee doesnt exist, we write into the db
    //     db.collection("Employees").doc(employeeID).set({
    //         ID: employeeID,
    //         FirstName: firstName,
    //         LastName: lastName,
    //         Occupation: occupation,
    //         Password: password
    //     })  
    //     .then(function(){
    //         console.log("Employee successfully added!");
    //         res.send({data: employeeFound});

    //     })
    //     .catch(function(error) {
    //         console.error(error);
    //     });
    // }
});


//fetching employee information from database 
app.post('/login', (req ,res) => {
    console.log(req.body);
    const sentID = req.body.ID;
    const sentPassword = req.body.Password;

    let employeeInfo = {
        Password: "",
    }
    var x = false;
        var FN             = "";
    var LN             = "";
    var OCC            = "";
    
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
            FN  = doc.data()["FirstName"];
            LN  = doc.data()["LastName"];
            OCC = doc.data()["Occupation"];
        }        
        Promise.resolve();
    })
    .then(() => {
        console.log(x);
        res.send ( { 
            data: x,
            firstName: FN,
            lastName : LN,
            occupation: OCC,

         } );
    })
    .catch(function(error) {
        console.error(error);
    });    

    
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))


//----- <<<<OLD CODE FOR REFERENCE>>>> ----

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









