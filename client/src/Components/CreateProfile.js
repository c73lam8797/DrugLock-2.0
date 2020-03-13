import React, { Component } from 'react';
import '../App.css';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class CreateProfile extends Component {
    constructor (props){
        super (props);
        this.state = {
            //handling user input based from form entry 
            employeeID: "", lastName : "", firstName : "", occupation : "", password: "",

            //states determining what to display
            alreadyExists: false, attemptToSubmit: false, successfulSubmit: false, isEmpty: true,
        };
        this.handleSubmit      = this.handleSubmit.bind(this);
        this.handleChangeID    = this.handleChangeID.bind(this);
        this.handleChangeLast  = this.handleChangeLast.bind(this);
        this.handleChangeFirst = this.handleChangeFirst.bind(this);
        this.handleChangeOcc   = this.handleChangeOcc.bind(this);
        this.handleChangePass  = this.handleChangePass.bind(this);
    }

    handleChangeID   (event){ this.setState({employeeID: event.target.value}); }
    handleChangeLast (event){ this.setState({lastName:   event.target.value}); }
    handleChangeFirst(event){ this.setState({firstName:  event.target.value}); }
    handleChangeOcc  (event){ this.setState({occupation: event.target.value}); }
    handleChangePass (event){ this.setState({password:   event.target.value}); }
    
    handleSubmit(event) {
        event.preventDefault();

        //if the form is not empty, we post to the backend
        if (this.state.employeeID != "" && this.state.lastName != ""
        && this.state.firstName != "" && this.state.occupation != "" && this.state.password != ""){
            this.setState({isEmpty: false});
            this.callBackendAPI()
            .then(res => {
                console.log("Employee already found: ", res.data) //for debugging 
                this.setState({alreadyExists: res.data});

                //if employee doesn't already exist, submission is successful, and there was an attempt to submit
                if (!this.state.alreadyExists) { 
                    this.setState ({successfulSubmit: true});
                    this.setState ({attemptToSubmit: true}); 
                }
            })
            .catch(err => console.error(err)); 
        }
        //otherwise, there we set state so that there was an attempt to submit, but it was not suffessful 
        else {this.setState ({attemptToSubmit: true}); this.setState({successfulSubmit: false}); this.setState({isEmpty: true})};
    }

    callBackendAPI = async () => {
        const response = await fetch("http://localhost:5000/createprofile", {
            method: 'POST',
            //send JSON to backend containing user input
            body:  JSON.stringify({ 
                    ID          : this.state.employeeID,
                    LastName    : this.state.lastName,
                    FirstName   : this.state.firstName,
                    Occ         : this.state.occupation,
                    Pass        : this.state.password
            }),
            headers: {
                'Content-type': 'application/json',
                'Accept' : 'application/json',
            }
        })
        const body = await response.json();
        if (response.status!== 200) {
            throw Error(body.message)
        }
        return body;
    }

    render() {
        let message;
        //if the drug was already found in the database
        if (this.state.alreadyExists && !this.state.isEmpty) {message = <h5>Employee already exists in the database.</h5>}
        //if there was a successful submit and an attempt to submit, the login passed authentication, and was submitted
        else if (this.state.successfulSubmit && this.state.attemptToSubmit) { message = <h5>Profile successfully created.</h5>}
        //if there was no successful submit, but an attempt to submit, some fields are empty
        else if (this.state.attemptToSubmit && !this.state.successfulSubmit && this.state.isEmpty) { message = <h5>Please fill in all fields before submitting.</h5>}


        return (
            <Paper elevation={3} style={{fontFamily: 'Montserrat', padding:20, minWidth:150, maxWidth:500, minHeight:"95vh", overflow: "initial"}}>
                {/* uses props passed in from homepage to change state and return back to homepage */}
                <Button variant="outlined" onClick={this.props.backToPage} type = "submit">Back To Homepage</Button>
                <h1>Create an Employee Profile</h1>

                {/* displays error message, if any */}
                {message}

                <form>
                    <p> Enter Your Employee ID: </p>
                    <TextField onChange={this.handleChangeID} value={this.state.employeeID} id="outlined-basic" label="Employee ID" variant="outlined" required/> <br />

                    <p> Enter Your Last Name: </p>
                    <TextField onChange={this.handleChangeLast} value={this.state.lastName} id="outlined-basic" label="Last Name" variant="outlined" required/> <br />

                    <p> Enter Your First Name: </p>
                    <TextField onChange={this.handleChangeFirst} value={this.state.firstName} id="outlined-basic" label="First Name" variant="outlined" required/> <br />

                    <p> You are a: </p>
                    <select onChange={this.handleChangeOcc} value={this.state.occupation} required> 
                        <option>          </option>
                        <option>Pharmacist</option>
                        <option>Nurse     </option>
                    </select> <br />

                    <p> Enter a Password: </p>
                    <TextField type="password" value={this.state.password} onChange={this.handleChangePass} id="outlined-basic" label="Password" variant="outlined" required/> <br />
                    <br />
                    <Button variant="contained" type="submit" onClick={this.handleSubmit}>Submit Profile</Button>
                </form>
            </Paper>
        )
    }
};

export default CreateProfile;

