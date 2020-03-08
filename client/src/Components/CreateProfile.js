import React, { Component } from 'react';
import '../App.css';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class CreateProfile extends Component {
    constructor (props){
        super (props);
        this.state = {
            employeeID: "",
            lastName : "",
            firstName : "",
            occupation : "",
            password: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeID = this.handleChangeID.bind(this);
        this.handleChangeLast = this.handleChangeLast.bind(this);
        this.handleChangeFirst = this.handleChangeFirst.bind(this);
        this.handleChangeOcc = this.handleChangeOcc.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
    }

    handleChangeID(event){
        this.setState({employeeID: event.target.value});
    }
    handleChangeLast(event){
        this.setState({lastName: event.target.value});
    }
    handleChangeFirst(event){
        this.setState({firstName: event.target.value});
    }
    handleChangeOcc(event){
        this.setState({occupation: event.target.value});
    }
    handleChangePass(event){
        this.setState({password: event.target.value});
    }

    handleSubmit() {
        

    //     // Call our fetch function below once the component mounts
    //   this.callBackendAPI()
    //     .then(res => this.setState({ data: res.express }))
    //     .catch(err => console.log(err));
    }
    //   // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
    // callBackendAPI = async () => {
    //   const response = await fetch('http://localhost:5000/express_backend');
    //   const body = await response.json();
  
    //   if (response.status !== 200) {
    //     throw Error(body.message) 
    //   }
    //   return body;
    // };

    render() {
        return (
            <Paper elevation={3} style={{fontFamily: 'Montserrat', padding:20, minWidth:150, maxWidth:500, minHeight:300, maxHeight:600}}>
                <h1>Create an Employee Profile</h1>
                <form onSubmit={this.handleSubmit}>
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
                    <TextField type="password" onChange={this.handleChangePass} value={this.state.password} id="outlined-basic" label="Password" variant="outlined" required/> <br />
                    <br /><br /><br /><br />
                </form>
                <Button variant="contained" type="submit">Submit Profile</Button>
            </Paper>
        )
    }
};

export default CreateProfile;

