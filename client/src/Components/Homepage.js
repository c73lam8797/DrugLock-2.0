import React, { Component } from 'react';
import '../App.css';
import CreateProfile from './CreateProfile';
import Login from './Login';
import Button from '@material-ui/core/Button';


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
        this.setState(() => ({createProfile: true}));
    }
    
    render() {
        if (!this.state.login && !this.state.createProfile) {
            return (
                <div >
                    <Button variant="contained" color="primary" onClick={this.handleClickLogin} type = "submit">Login</Button>
                    <Button variant="outlined" color="primary" onClick={this.handleClickCreate} type = "submit">Create Profile</Button>
                </div>
            );
        }
        else if (this.state.login) {
            return (
                <div>
                    <Button variant="outlined" onClick={this.handleClickLogin} type = "submit">Logout</Button>
                    <Login />   
                </div>
            );
        }
        else if (this.state.createProfile) {
            return (
                <CreateProfile />
            );
        }
    }
};


export default Homepage;

