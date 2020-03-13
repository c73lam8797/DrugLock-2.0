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
        }
        this.handleClickLogin = this.handleClickLogin.bind(this);
        this.handleClickCreate = this.handleClickCreate.bind(this);
    }

    handleClickLogin() { this.setState(state => ({login: !state.login})); } //toggles "login" pagge
    handleClickCreate() { this.setState(state => ({createProfile: !state.createProfile})); } //toggle "create profile" page

        
    render() {

        //if neither button is pressed, display the home screen
        if (!this.state.login && !this.state.createProfile) {
            return (
                <div style={{display: "flex", justifyContent: "center", position: "relative", top: 50}}>
                    <Paper elevation={3} style={{padding:20, minWidth:150, maxWidth:500, minHeight:300, maxHeight:600}}>
                        <h1 style={{fontFamily: 'Roboto, sans-serif' }}> Welcome to DrugLock 2.0 </h1>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <Button variant="contained" color="primary" onClick={this.handleClickLogin} type = "submit" >Login</Button>
                                <Button variant="outlined"  color="primary" onClick={this.handleClickCreate} type = "submit">Create Profile</Button>
                            </div>
                    </Paper>
                </div>
            );
        }
        //if the login button is pressed, we set the login state to true; return the login page
        //we pass the child component <Login /> the ability to change the state again, and return back to the homepage
        else if (this.state.login) {
            return (
                <div> <Login loginAndOut = {this.handleClickLogin}/> </div>
            );
        }
        //if the create profile is pressed, we set the create profile state to true; return create profile page
        //we pass the child component <Login /> the ability to change the state again, and return back to the homepage
        else if (this.state.createProfile) {
            return (
                <div> <CreateProfile backToPage = {this.handleClickCreate} /> </div>
            );
        }
    }
};


export default Homepage;

