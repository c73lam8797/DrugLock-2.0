import React, { Component } from 'react';
import '../App.css';
import CreateProfile from './CreateProfile';
import Login from './Login';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';


class Homepage extends Component {
    constructor (props) {
        super (props);
        this.state = {
            login: false,
            createProfile: false,
            dataLoaded: false,
        }
        this.handleClickLogin = this.handleClickLogin.bind(this);
        this.handleClickCreate = this.handleClickCreate.bind(this);
    }

    handleClickLogin() { this.setState(state => ({login: !state.login})); }
    handleClickCreate() { this.setState(state => ({createProfile: !state.createProfile})); }

    //update the local array everytime the homepage is loaded
    componentDidMount(){
        fetch("http://localhost:5000/getdata", {
            headers: {'Accept' : 'application/json'}
        })
        .then (res =>res.json())
        .then (info => { 
            //will return true when a response is received from fetch
            //aka. the state changes once the data is done being retrieved from the database
            this.setState({dataLoaded: info.data}); 
            console.log("Data successfully retrieved:", info.data);
        })
        .catch (err => console.error(err));
    }

        
    render() {
        let loginButton, createProfileButton, welcomeMessage;

        //while the data is still being fetched from the database, buttons are disabled
        if (!this.state.dataLoaded){ 
            welcomeMessage = <h1 style={{fontFamily: 'Roboto, sans-serif' }}> Data is loading...please wait. </h1>
            loginButton = <Button variant="contained" color="primary" onClick={this.handleClickLogin} type = "submit" disabled>Login</Button>
            createProfileButton = <Button variant="outlined"  color="primary" onClick={this.handleClickCreate} type = "submit" disabled>Create Profile</Button>
        }
        //once data is loaded, buttons are activated
        else {
            welcomeMessage = <h1 style={{fontFamily: 'Roboto, sans-serif' }}> Welcome to DrugLock 2.0. </h1>
            loginButton = <Button variant="contained" color="primary" onClick={this.handleClickLogin} type = "submit" >Login</Button>
            createProfileButton = <Button variant="outlined"  color="primary" onClick={this.handleClickCreate} type = "submit">Create Profile</Button>
        }
        
        //if neither button is pressed, display the home screen
        if (!this.state.login && !this.state.createProfile) {
            return (
                <div style={{display: "flex", justifyContent: "center", position: "relative", top: 50   }}>
                    <Paper elevation={3} style={{padding:20, minWidth:150, maxWidth:500, minHeight:300, maxHeight:600}}>
                        {welcomeMessage}
                        <div style={{display: "flex", justifyContent: "center"}}>
                            {loginButton}
                            {createProfileButton}
                        </div>
                    </Paper>
                </div>
            );
        }
        //if the login button is pressed, return the login page
        //we pass the child component <Login /> the ability to "handleClickLogin"
        else if (this.state.login) {
            return (
                <div>
                    <Login loginAndOut = {this.handleClickLogin}/>
                </div>
            );
        }
        //if the create profile is pressed, we load the create profile page
        else if (this.state.createProfile) {
            return (
                <div>
                    <Button variant="outlined" onClick={this.handleClickCreate} type = "submit">Back To Homepage</Button>
                    <CreateProfile />
                </div>
            );
        }
    }
};


export default Homepage;

