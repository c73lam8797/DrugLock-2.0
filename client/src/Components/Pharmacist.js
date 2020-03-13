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
        //if the DisplayDrugs component passed in a property to edit, we set the state wantToEdit to true
        if (this.props.wanttoedit){
            this.setState({wantToEdit: true});
            this.setState({drugForm: true});
        }
    }

    handleClick() {
        this.setState({wantToEdit: false}) //any time we want to display this page, want to edit is false
        this.setState({drugForm: !this.state.drugForm}) //toggles whether or not the drug form is displayed
    }

    render() {
    
    //CASE 1: DISPLAY FORM = FALSE, WANT TO EDIT = FALSE
        //by default, display main page when drugForm is false, wanttoedit is false
        //when displaying the drugs, we pass the ability to go back to this page with this.handleClick, used when wanting to "Enter a new Drug"
        if(!this.state.drugForm && !this.state.wantToEdit){
            console.log("Display main page")
            return (
                <DisplayDrugs displayDrugForm={this.state.drugForm} backToPharm={this.handleClick}/>
            )
        }
    
    //CASE 2: DISPLAY FORM = TRUE, WANT TO EDIT = TRUE
        //display the drug form if someone wants to edit (called from "Display drugs"), 
        //props are passed in from the Display Drugs component, and we pass them again to have the properties already displayed in the form
        //give the drug form the ability to return to this page by passing this.handleClick
        //want to edit should be passed in as true
        else if(this.state.wantToEdit && this.state.drugForm) {
            console.log("Editing existing data")
            return (
                <DrugForm backToPharm={this.handleClick} wanttoedit="true" 
                          editID          = {this.props.editID} 
                          editName        = {this.props.editName} 
                          editDosage      = {this.props.editDosage} 
                          editInstructions= {this.props.editInstructions} 
                          editRisk        = {this.props.editRisk} 
                          editEffect      = {this.props.editEffect} />
            )
        }
    
    //CASE 3: DISPLAY FORM = TRUE, WANT TO EDIT = FALSE
        //display an empty form when someone clicks the "Enter a new drug" from the display drugs component 
        //pass in this.handleClick to give the ability for user to go back to main page 
        //we pass in wantToEdit, which is false
        else if (this.state.drugForm){
            console.log("Display new form")
            return(
                <DrugForm backToPharm={this.handleClick} wanttoedit="false" />
            )
        }

    }
};

export default Pharmacist;

