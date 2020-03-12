import React, { Component } from 'react';
import '../App.css';
import DrugForm from './DrugForm';
import DisplayDrugs from './DisplayDrugs';

class Pharmacist extends Component {
    constructor (props){
        super (props);
        this.state = {
            drugForm: false,
            wantToEdit: false,
        };
        this.handleClick = this.handleClick.bind(this)
    }
    componentWillMount(){
        if (this.props.wanttoedit){
            this.setState({wantToEdit: true});
            this.setState({drugForm: true});
            console.log("props", this.props.wanttoedit)
        }
    }

    handleClick() {
        this.setState({wantToEdit: false}) //any time we want to display this page, want to edit is false
        this.setState({drugForm: !this.state.drugForm})
        console.log("display drug form?" ,this.state.drugForm)
    }

    render() {
        //by default, display main page when drugForm is false, wanttoedit is false
        //pass in the ability to go back to this page with this.handleClick, used when wanting to "Enter a new Drug"
        if(!this.state.drugForm && !this.state.wantToEdit){
            console.log("display main page")
            return (
                <DisplayDrugs displayDrugForm={this.state.drugForm} backToPharm={this.handleClick}/>
            )
        }

        //display the drug form if someone wants to edit (called from "Display drugs"), but have all the properties already displayed
        //give the drug form the ability to return to this page by passing this.handleClick
        //want to edit should be passed in as true
        else if(this.state.wantToEdit && this.state.drugForm) {
            console.log("trying to edit")
            return (
                <DrugForm backToPharm={this.handleClick} wanttoedit="true" editID={this.props.editID} editName = {this.props.editName} 
                editDosage={this.props.editDosage} editInstructions={this.props.editInstructions} editRisk={this.props.editRisk} editEffect={this.props.editEffect} />
            )
        }

        //display an empty form when someone clicks the enter a new drug
        //pass in this.handleClick to give the ability for user to go back to main page 
        //we pass in wantToEdit, which should be false
        else if (this.state.drugForm){
            console.log("new form")
            return(
                <DrugForm backToPharm={this.handleClick} wanttoedit="false" />
            )
        }

    }
};

export default Pharmacist;

