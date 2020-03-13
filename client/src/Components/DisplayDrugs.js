import React, { Component } from 'react';
import '../App.css';
import Button from '@material-ui/core/Button';
import Pharmacist from './Pharmacist';
import Paper from '@material-ui/core/Paper';

class DisplayDrugs extends Component {
    constructor (props){
        super (props);
        this.state = {
            //data retrieved from the database
            drugDataKey: [], drugDataValue: [],

            //states handling what is to be loaded
            edit: false, loading: false,

            //the properties of the drugs that want to be edited, to be passed into the drug form component 
            editDrugID: "", editDrugName: "", editDrugDosage: "", editDrugRisk: "", editDrugEffect: "", editDrugInstructions: "",
        };
        this.display = this.display.bind(this);
        this.delete  = this.delete.bind(this);
        this.edit    = this.edit.bind(this);
    }
    
    componentDidMount(){
        this.callBackendAPI()
        .then (res => { 
            this.setState({drugDataKey: [...Object.keys(res.data)]});  //storing drugIDs into state
            this.setState({drugDataValue: [...Object.values(res.data)]});// store the properties into state 

            // for debugging
            console.log("these are the keys: ", this.state.drugDataKey);
            console.log("these are the values: ", this.state.drugDataValue);
        })
        .catch (err => console.error(err))
        .then(()=> {
            this.setState({loading: false}) //to 'remove' loading statement after database retrieves data
        })
    }   

    callBackendAPI = async () => {
        this.setState({loading: true}) //set state to display 'loading' statement
        const response = await fetch("http://localhost:5000/getdrugs", {
            method: 'GET',
            headers: {'Accept' : 'application/json',}
        })
        const body = await response.json();
        if (response.status!== 200) {
            throw Error(body.message)
        }
        return body;
    }

    deleteFromDatabase = async(id) => {
        const response = await fetch("http://localhost:5000/deleteDrug", {
            method: 'DELETE',
            body:  JSON.stringify({ ID : id }),
            headers: {
                'Content-type': 'application/json',
                'Accept' : 'application/json',
            }
        })

        const body = await response.json();
        if (response.status!==200) {
            throw Error(body.message);
        }
        return body;
    }

    delete(item) {
        //delete item at their ID
        this.deleteFromDatabase(item.ID)
        .then(res => console.log(res.data))
        .then(() => this.componentDidMount()) //reloading the data locally
        .catch(err =>console.error(err))
    }
    
    edit(item) {
        //if someone wants to edit a drug, we set edit state to be true
        //bind all the item info 
        //the display drugForm state should still be false
        this.setState({edit: true});
        this.setState({editDrugID: item.ID});
        this.setState({editDrugName: item.DrugName});
        this.setState({editDrugDosage: item.Dosage});
        this.setState({editDrugRisk: item.Risk});
        this.setState({editDrugEffect: item.Effect});
        this.setState({editDrugInstructions: item.Instructions});
    }

    display() {
        if (this.state.drugDataKey.length != 0){
            let vals = this.state.drugDataValue;

            let items = vals.map(d => {
                let colour;
                if      (d.Risk === "High")   { colour = 'rgb(222, 32, 7)' ;}
                else if (d.Risk === "Medium") { colour = 'rgb(222, 175, 7)';}
                else if (d.Risk === "Low")    { colour = 'rgb(27, 150, 52)';}
                return (
                    <tr key={d.ID}>
                        <td style={{paddingRight: 30}}>{d.ID}</td><td style={{paddingRight: 30}}>{d.DrugName}</td><td style={{paddingRight: 30}}>{d.Dosage}</td>
                        <td style={{paddingRight: 30}}>{d.Instructions}</td><td style={{paddingRight: 30, color: colour}}>{d.Risk}</td><td style={{paddingRight: 15}}>{d.Effect}</td>
                        <td><Button color="primary"   onClick={this.edit.bind(this, d)}>Edit</Button></td>
                        <td><Button color="secondary" onClick={this.delete.bind(this, d)}>Delete</Button></td>
                    </tr>
                )   
            })
               
            return (
                <div>
                    <h3> Here are the drugs currently in the database: </h3>
                    <table> 
                        <tbody>
                            <tr>
                                <td style={{paddingRight: 30, fontWeight:"bold"}}>ID: </td><td style={{paddingRight: 30, fontWeight:"bold"}}>Drug Name:</td><td style={{paddingRight: 30, fontWeight:"bold"}}>Dosage:</td>
                                <td style={{paddingRight: 30, fontWeight:"bold"}}>Instructions:</td><td style={{paddingRight: 30, fontWeight:"bold"}}>Risk:</td><td style={{paddingRight: 30, fontWeight:"bold"}}>Effects:</td>
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

    componentWillUnmount () {
        this.setState({edit: false});
    }


    render() {
        let drugDisplay = this.display();
        //if someone wants to edit, we return to the pharmacist page, and pass all the properties of that drug
        //wanttoedit should be passed as true
        if (this.state.edit){
            return <Pharmacist wanttoedit="true" 
                               editID          ={this.state.editDrugID} 
                               editName        = {this.state.editDrugName} 
                               editDosage      ={this.state.editDrugDosage}
                               editInstructions={this.state.editDrugInstructions} 
                               editRisk        ={this.state.editDrugRisk} 
                               editEffect      ={this.state.editDrugEffect}/>
        }
        //display a button that lets people to add a new drug
        //onClick, this should set the display drug from to true
        else {
            return (
                <div>
                    <Paper elevation={3} style={{fontFamily: 'Montserrat', padding:20}}>
                        <Button variant="contained" onClick={this.props.backToPharm}>Enter a New Drug</Button>
                        {drugDisplay}
                    </Paper>
                </div>
            )
        }
    }
};

export default DisplayDrugs;

