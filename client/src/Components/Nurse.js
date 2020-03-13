import React, { Component } from 'react';
import '../App.css';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Selection from './Selection'

class Nurse extends Component {
    constructor (props){
        super (props);
        this.state = {
            //data fetched from the database
            drugDataKey: [],
            drugDataValue: [],

            //states determining what to display
            select: false,
            loading: false,

            //the properties of the drug 'selected', to be passed into the Selection component 
            selectedID: "",  selectedName: "", selectedDosage: "", selectedRisk: "",  selectedEffect: "", selectedInstructions: "",
        };
        this.display = this.display.bind(this);
        this.select = this.select.bind(this);
    }
    
    //immediately calls database and fetches info to be displayed on load
    componentWillMount(){ 
        this.callBackendAPI()
        .then (res => { 
            this.setState({drugDataKey: [...Object.keys(res.data)]});  //storing drugIDs into state
            this.setState({drugDataValue: [...Object.values(res.data)]});// store the properties into state 
            
            //for debugging
            console.log("these are the keys: ", this.state.drugDataKey); 
            console.log("these are the values: ", this.state.drugDataValue);
        })
        .catch (err => console.error(err))
        .then(()=>{ this.setState({loading: false}) }) //sets loading state to false when done fetching data 
    }   

    callBackendAPI = async () => {
        this.setState({loading: true}) //state to displaying loading message while fetching data 
        const response = await fetch("http://localhost:5000/getdrugs", {
            method: 'GET',
            headers: { 'Accept' : 'application/json', }
        })
        const body = await response.json();

        if (response.status!== 200) {
            throw Error(body.message)
        }
        return body;
    }


    select(item) {
        //toggles whether or not to display the "selection" component 
        this.setState({select: !this.state.select}); 

        //bind information of drug selected to the states 
        this.setState({selectedID: item.ID});
        this.setState({selectedName: item.DrugName});
        this.setState({selectedDosage: item.Dosage});
        this.setState({selectedRisk: item.Risk});
        this.setState({selectedEffect: item.Effect});
        this.setState({selectedInstructions: item.Instructions});
    }

    display() {
        //if entries exist in the data base 
        if (this.state.drugDataKey.length !== 0){
            //the properties of each drug, stored in an array when calling on the database 
            let vals = this.state.drugDataValue;

            //map each "key" to its values, to display each drug in the database
            let items = vals.map(d => {
                //setting colour for risk 
                let colour;
                if (d.Risk === "High") { colour = 'rgb(222, 32, 7)';} 
                else if (d.Risk === "Medium") { colour = 'rgb(222, 175, 7)';}
                else if (d.Risk === "Low") { colour = 'rgb(27, 150, 52)'}

                return (
                    <tr key={d.ID}>
                        <td style={{paddingRight: 30}}>{d.ID}</td> {/*display drug ID */}
                        <td style={{paddingRight: 30}}>{d.DrugName}</td> {/*display drug Name */}
                        <td style={{paddingRight: 30, color: colour}}>{d.Risk}</td> {/*display risk */}
                        <td><Button color="secondary" onClick={this.select.bind(this, d)}>Select</Button></td> {/*display select button */}
                    </tr>
                )   
            })
               
            return (
                <div>
                    <h3> Please choose the drug you would like to withdraw. </h3>
                    <table> 
                        <tbody>
                            <tr>
                                <td style={{paddingRight: 30, fontWeight:"bold"}}>ID: </td>
                                <td style={{paddingRight: 30, fontWeight:"bold"}}>Drug Name:</td>
                                <td style={{paddingRight: 30, fontWeight:"bold"}}>Risk:</td>
                            </tr>        
                            {items} 
                        </tbody>
                    </table> 
                </div>
                
            )
        }
        //while data is being fetched from the database 
        else if (this.state.loading){return(<h3>Loading...please wait.</h3>)}
        //when db is empty
        else {return (<h3>You have nothing in the database yet.</h3>)}      
    }


    render() {
        let drugDisplay = this.display();
        if (!this.state.select) {
            return (
                <div>
                    <Paper elevation={3} style={{fontFamily: 'Montserrat', padding:20}}>
                        {drugDisplay}
                    </Paper>
                </div>
            )
        }
        else {
            return (
                <div>
                    <Paper elevation={3} style={{fontFamily: 'Montserrat', padding:20}}>
                        {/* pass in properties of selected drug, and the ability to return to this page into the 'selection' component */}
                        <Selection goBack={this.select} 
                                   ID = {this.state.selectedID} 
                                   DrugName = {this.state.selectedName} 
                                   Risk = {this.state.selectedRisk}
                                   Effect = {this.state.selectedEffect} 
                                   Dosage = {this.state.selectedDosage} 
                                   Instructions = {this.state.selectedInstructions}/>
                    </Paper>
                </div>
            )
        }

    }
};

export default Nurse;

