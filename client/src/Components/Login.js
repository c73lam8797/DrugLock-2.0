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

            isValid: false,
            attemptedLogin: false,
            returnedFN: "",
            returnedLN: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeID = this.handleChangeID.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
    }

    handleChangeID(event){ this.setState({employeeID: event.target.value}); }
    handleChangePass(event){ this.setState({password: event.target.value}); }

    
    handleSubmit(event) {
        event.preventDefault();

        this.callBackendAPI()
        .then (res => {
            this.setState({isValid: res.data});
            this.setState({returnedFN: res.firstName});
            this.setState({returnedLN: res.lastName});
            this.setState({attemptedLogin: true});
            console.log("Valid login: ", this.state.isValid); //for debugging
        })
        .catch(err => {
            console.error('There was a problem.', err);
        });
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
                'Access-Control-Request-Method' : 'POST',               
            } 
        })
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    }

    // ButtonMessage() {
    //     return <Button variant="outlined" onClick={this.handleClickCreate} type = "submit">{this.state.isValid? 'Back To Homepage' : 'Logout'</Button>
    // }


    render() {
        let retry = <h6> </h6>
        if (!this.state.isValid && this.state.attemptedLogin) {retry = <h6>Invalid Login. Please try again.</h6>}

        if (!this.state.isValid){
            return (
                <Paper elevation={3} style={{fontFamily: 'Montserrat', padding:20, minWidth:150, maxWidth:500, minHeight:300, maxHeight:600}}>
                    <Button variant="outlined" onClick={this.props.loginAndOut} type = "submit">{this.state.isValid? 'Logout' : 'Back to Homepage'}</Button>
                    <h1>Login</h1>
                    <form onSubmit={this.handleSubmit}>
                        <p> Enter Your Employee ID: </p>
                        <TextField onChange={this.handleChangeID} value={this.state.employeeID} id="outlined-basic" label="Employee ID" variant="outlined" required/> <br />

                        <p> Enter Your Password: </p>
                        <TextField type="password" onChange={this.handleChangePass} value={this.state.password} id="outlined-basic" label="Password" variant="outlined" required/> <br />
                        <br /><br /><br /><br />
                        <Button variant="contained" type="submit">Login</Button>
                    </form>
                    {retry}
                </Paper>
            )
        }
        else {
            return (
                <div style={{fontFamily: 'Montserrat'}}>
                    <Button variant="outlined" onClick={this.props.loginAndOut} type = "submit">{this.state.isValid? 'Logout' : 'Back to Homepage'}</Button>
                    <h1>Welcome {this.state.returnedFN} {this.state.returnedLN}!</h1>
                    <h5>Username: {this.state.employeeID}</h5>
                </div>
            )
        }
    }
};

export default Login;
