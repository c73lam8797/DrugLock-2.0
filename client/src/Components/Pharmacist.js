import React, { Component } from 'react';
import '../App.css';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DrugForm from './DrugForm';
import DisplayDrugs from './DisplayDrugs';

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

    render() {
        //by default, display main page
        if(!this.state.drugForm){
            return (
                <Paper elevation={3} style={{fontFamily: 'Montserrat', padding:20}}>
                    <Button variant="contained" onClick={this.handleClick}>Enter a New Drug</Button>
                    <DisplayDrugs />
                </Paper>
            )
        }
        //otherwise, display the drug form
        else {
            return (
                <DrugForm backToPharm = {this.handleClick} />
            )
        }
    }
};

export default Pharmacist;

