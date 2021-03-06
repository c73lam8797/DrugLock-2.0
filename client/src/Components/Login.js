import React, { Component } from 'react';
import '../App.css';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Pharmacist from './Pharmacist';
import Nurse from './Nurse';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

//overriding default Material Ui Properties 
const theme = createMuiTheme({
    overrides: {
      MuiPaper: {
        root: { display: "inline-block",  minWidth: 300, minHeight: "95vh", padding: 20, overflow: "initial" },
      },
    },
  });


class Login extends Component {
    constructor (props){
        super (props);
        this.state = {
            //user input 
            employeeID: "", password: "", 
            
            //state determining what to display
            isValid: false, attemptedLogin: false, loading: false, 

             //information returned from the database
            returnedFN : "", returnedLN : "", returnedOCC: "",
        };
        
        this.handleSubmit = this.handleSubmit.bind(this); 
        this.handleChangeID = this.handleChangeID.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
    }

    //handling user input
    handleChangeID  (event){ this.setState({employeeID: event.target.value}); } 
    handleChangePass(event){ this.setState({password: event.target.value}); }

    //handling attempts to login
    handleSubmit(event) {
        event.preventDefault(); //prevents page from reloading by default "onSubmit"

        this.setState({loading: true}); //used to show temporary "loading" message
        this.callBackendAPI()
        .then (res => {
            this.setState({isValid: res.data}); //determines whether or not the password was right

            this.setState({returnedFN: res.firstName}); //returns empty if employee not found, or name associated with correct ID
            this.setState({returnedLN: res.lastName}); //returns empty if employee not found, or last name associated with correct ID
            this.setState({returnedOCC: res.occupation}); //returns empty if employee not found, or occupation associated with correct ID

            this.setState({attemptedLogin: true}); //notifies system that an attempt to login has been made
            console.log("Valid login: ", this.state.isValid); //for debugging
        })
        .catch(err => {
            console.error('There was a problem.', err);
        })
        .then(()=>{
            this.setState({loading: false}) //returns loading state to false, regardless of whether data was fetched or not 
        })
    }   

    callBackendAPI = async() => {
        //onsubmit, we send the user input (employeeID, password) to our backend as a JSON
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            //sends JSON with employee login and password for authentication 
            body: JSON.stringify({
                ID: this.state.employeeID,
                Password: this.state.password
            }),
            headers: {
                'Content-type': 'application/json',
                'Accept' : 'application/json', 
            } 
        })
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    }

    //based on the information returned from the database, we determne which page to display next 
    pharmOrNurse(){ 
        if (this.state.returnedOCC === "Pharmacist") { return <Pharmacist /> }
        else if (this.state.returnedOCC === "Nurse") { return <Nurse /> }
    }


    render() {
        //by default, the "retry" message to try logging in again is empty
        let retry = <p> </p> 
        
        //loading message for while the login is being authenticated
        if (this.state.loading) {retry = <h5>Logging in...please wait.</h5>}

        //if the credentials are invalid and there was an attempt to login, set the "retry" message to:
        else if (!this.state.isValid && this.state.attemptedLogin) {retry = <h5>Invalid Login. Please try again.</h5>}

        //if there is no valid login (so on a wrong attempt, and by default), load the login page
        if (!this.state.isValid){
            return (
                <ThemeProvider theme={theme}>
                    <Paper elevation={3} style={{fontFamily: 'Montserrat'}}>
                        <Button variant="outlined" onClick={this.props.loginAndOut} type = "submit" >Back to Homepage</Button>
                        <h1>Login</h1>
                        {retry}
                        <form onSubmit={this.handleSubmit}>
                            <p> Enter Your Employee ID: </p>
                            <TextField onChange={this.handleChangeID} value={this.state.employeeID} label="Employee ID" variant="outlined" required/> <br />

                            <p> Enter Your Password: </p>
                            <TextField type="password" onChange={this.handleChangePass} value={this.state.password} label="Password" variant="outlined" required/> <br />
                            <br /><br /><br /><br />
                            <Button variant="contained" type="submit">Login</Button>
                        </form>
                    </Paper>
                </ThemeProvider>
            )
        }

        //on valid login, return a new page, and the button is now "logout"
        else {
            let occ = this.pharmOrNurse(); //determines occupation based on the data fetched from the database
            return (
                <div style={{fontFamily: 'Montserrat'}}>
                    {/* uses props passed from homepage to return to homepage when logging out */}
                    <Button variant="outlined" onClick={this.props.loginAndOut} type = "submit" style={{background: 'rgb(196, 224, 255)'}}>Logout</Button>
                    
                    {/* displays employee information */}
                    <h1>Welcome {this.state.returnedFN} {this.state.returnedLN}!</h1>
                    <h5>Username: {this.state.employeeID}</h5>
                    <h5>Occupation: {this.state.returnedOCC}</h5>

                    {/* displaying page depending on occupation */}
                    {occ}
                </div>
            )
        }
    }
};

export default Login;
