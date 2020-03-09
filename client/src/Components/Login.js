import React, { Component } from 'react';
import '../App.css';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class Login extends Component {
    constructor (props){
        super (props);
        this.state = {
            employeeID: "",
            password: "",

            isValid: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeID = this.handleChangeID.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
    }

    handleChangeID(event){
        this.setState({employeeID: event.target.value});
    }
    handleChangePass(event){
        this.setState({password: event.target.value});
    }

    handleSubmit() {
        this.callBackendAPI()
        .then (res => {
            console.log(res.data); //for debugging
            this.setState({isValid: res.data});
            console.log(this.state.isValid); //for debugging
        })
        .catch(err => console.error('There was a problem.', err));
    }   

    callBackendAPI = async() => {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            body: JSON.stringify({
                ID: this.state.employeeID,
                Password: this.state.password
            }),
            headers: {
                'Content-type': 'application/json',
                'Accept' : 'application/json',
                'Access-Control-Request-Method' : 'POST'
            } 
        })

        const body = await response.json();
        console.log("is this even running"); //for debugging
        console.log(body); //for debugging 

        return body;
    }
    render() {
        return (
            <Paper elevation={3} style={{fontFamily: 'Montserrat', padding:20, minWidth:150, maxWidth:500, minHeight:300, maxHeight:600}}>
                <h1>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    <p> Enter Your Employee ID: </p>
                    <TextField onChange={this.handleChangeID} value={this.state.employeeID} id="outlined-basic" label="Employee ID" variant="outlined" required/> <br />

                    <p> Enter Your Password: </p>
                    <TextField type="password" onChange={this.handleChangePass} value={this.state.password} id="outlined-basic" label="Password" variant="outlined" required/> <br />
                    <br /><br /><br /><br />
                    <Button variant="contained" type="submit">Login</Button>
                </form>
            </Paper>
        )
    }
};

export default Login;
