import React, { Component } from 'react';
import '../App.css';
import CreateProfile from './CreateProfile';
import Login from './Login';
import ButtonMessage from './Login';
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
            headers: {
                'Accept' : 'application/json'
            }
        })
        .then (res =>res.json())
        .then (info => { 
            this.setState({dataLoaded: info.data});
            console.log(this.state.dataLoaded); //for debugging
            console.log("Data successfully retrieved:", info.data);
        })
        .catch (err => console.error(err));
    }

        
    render() {
        let loginButton;
        let createProfileButton;
        let welcomeMessage;
        if (!this.state.dataLoaded){
            welcomeMessage = <h1 style={{fontFamily: 'Roboto, sans-serif' }}> Data is loading...please wait. </h1>
            loginButton = <Button variant="contained" color="primary" onClick={this.handleClickLogin} type = "submit" disabled>Login</Button>
            createProfileButton = <Button variant="outlined"  color="primary" onClick={this.handleClickCreate} type = "submit" disabled>Create Profile</Button>
        }
        else {
            welcomeMessage = <h1 style={{fontFamily: 'Roboto, sans-serif' }}> Welcome to DrugLock 2.0. </h1>
            loginButton = <Button variant="contained" color="primary" onClick={this.handleClickLogin} type = "submit" >Login</Button>
            createProfileButton = <Button variant="outlined"  color="primary" onClick={this.handleClickCreate} type = "submit">Create Profile</Button>
        }

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
        else if (this.state.login) {
            return (
                <div>
                    <Login loginAndOut = {this.handleClickLogin}/>
                </div>
            );
        }
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

