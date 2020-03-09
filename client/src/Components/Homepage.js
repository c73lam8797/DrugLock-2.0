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

    handleClickLogin() {
        this.setState(state => ({login: !state.login}));
    }
    handleClickCreate() {
        this.setState(state => ({createProfile: !state.createProfile}));
    }

    //update the local array everytime the homepage is loaded
    componentDidMount(){
        fetch("http://localhost:5000/getdata")
        .then (res => console.log(res.text()))
        .catch (err => console.error(err));
    }
        
    render() {
        if (!this.state.login && !this.state.createProfile) {
            return (
                <div style={{display: "flex", justifyContent: "center", position: "relative", top: 50   }}>
                    <Paper elevation={3} style={{padding:20, minWidth:150, maxWidth:500, minHeight:300, maxHeight:600}}>
                    <h1 style={{fontFamily: 'Roboto, sans-serif' }}> Welcome to DrugLock 2.0. </h1>

                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Button variant="contained" color="primary" onClick={this.handleClickLogin} type = "submit">Login</Button>
                            <Button variant="outlined" color="primary" onClick={this.handleClickCreate} type = "submit">Create Profile</Button>
                        </div>
                    </Paper>
                </div>
            );
        }
        else if (this.state.login) {
            return (
                <div>
                    <Button variant="outlined" onClick={this.handleClickLogin} type = "submit">Back To Homepage</Button>
                    <Login />   
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

