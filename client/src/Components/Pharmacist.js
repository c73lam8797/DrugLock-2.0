import React, { Component } from 'react';
import '../App.css';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DrugForm from './DrugForm';

class Pharmacist extends Component {
    constructor (props){
        super (props);
        this.state = {
            drugForm: false,
        };
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.setState({drugForm: !this.state.drugForm})
    }

    // callBackendAPI = async () => {
    //     const response = await fetch("http://localhost:5000/createprofile", {
    //         method: 'POST',
    //         body:  JSON.stringify({ 
    //                 ID          : this.state.employeeID,
    //                 LastName    : this.state.lastName,
    //                 FirstName   : this.state.firstName,
    //                 Occ         : this.state.occupation,
    //                 Pass        : this.state.password
    //         }),
    //         headers: {
    //             'Content-type': 'application/json',
    //             'Accept' : 'application/json',
    //             'Access-Control-Request-Method' : 'POST'
    //         }
    //     })
    //     const body = await response.json();
    //     if (response.status!== 200) {
    //         throw Error(body.message)
    //     }
    //     return body;
    // }

    render() {
        if(!this.state.drugForm){
            return (
                <Paper elevation={3} style={{fontFamily: 'Montserrat', padding:20}}>
                    <Button variant="contained" onClick={this.handleClick}>Enter a New Drug</Button>
                </Paper>
            )
        }
        else {
            return (
                <DrugForm backToPharm = {this.handleClick} />
            )
        }
    }
};

export default Pharmacist;

