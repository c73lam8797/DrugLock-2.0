import React, { Component } from 'react';
import '../App.css';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Selection from './Selection'

class Nurse extends Component {
    constructor (props){
        super (props);
        this.state = {
            drugDataKey: [],
            drugDataValue: [],
            select: false,

            selectedID: "",
            selectedName: "",
            selectedDosage: "",
            selectedRisk: "",
            selectedEffect: "",
            selectedInstructions: "",
            loading: false,
        };
        this.display = this.display.bind(this);
        this.select = this.select.bind(this);
    }
    
    componentWillMount(){
        this.callBackendAPI()
        .then (res => { 
            this.setState({drugDataKey: [...Object.keys(res.data)]});  //storing drugIDs into state
            this.setState({drugDataValue: [...Object.values(res.data)]});// store the properties into state 

            console.log("these are the keys: ", this.state.drugDataKey);
            console.log("these are the values: ", this.state.drugDataValue);
        })
        .catch (err => console.error(err))
        .then(()=>{
            this.setState({loading: false})
        })
    }   

    callBackendAPI = async () => {
        this.setState({loading: true})
        const response = await fetch("http://localhost:5000/getdrugs", {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
            }
        })
        const body = await response.json();
        if (response.status!== 200) {
            throw Error(body.message)
        }
        return body;
    }

    select(item) {
        this.setState({select: !this.state.select}); 

        this.setState({selectedID: item.ID});
        this.setState({selectedName: item.DrugName});
        this.setState({selectedDosage: item.Dosage});
        this.setState({selectedRisk: item.Risk});
        this.setState({selectedEffect: item.Effect});
        this.setState({selectedInstructions: item.Instructions});
    }

    display() {
        if (this.state.drugDataKey.length !== 0){
            let vals = this.state.drugDataValue;

            let items = vals.map(d => {
                let colour;
                if (d.Risk === "High") { colour = 'rgb(222, 32, 7)';}
                else if (d.Risk === "Medium") { colour = 'rgb(222, 175, 7)';}
                else if (d.Risk === "Low") { colour = 'rgb(27, 150, 52)'}

                return (
                    <tr key={d.ID}>
                        <td style={{paddingRight: 30}}>{d.ID}</td><td style={{paddingRight: 30}}>{d.DrugName}</td><td style={{paddingRight: 30, color: colour}}>{d.Risk}</td>
                        {/* <td style={{paddingRight: 30}}>{d.Dosage}</td>
                        <td style={{paddingRight: 30}}>{d.Instructions}</td><td style={{paddingRight: 15}}>{d.Effect}</td> */}
                        <td><Button color="secondary" onClick={this.select.bind(this, d)}>Select</Button></td>
                    </tr>
                )   
            })
               
            return (
                <div>
                    <h3> Please choose the drug you'd like to withdraw. </h3>
                    <table> 
                        <tbody>
                            <tr>
                                <td style={{paddingRight: 30, fontWeight:"bold"}}>ID: </td><td style={{paddingRight: 30, fontWeight:"bold"}}>Drug Name:</td>
                                <td style={{paddingRight: 30, fontWeight:"bold"}}>Risk:</td>
                                {/* <td style={{paddingRight: 30, fontWeight:"bold"}}>Instructions:</td><td style={{paddingRight: 30, fontWeight:"bold"}}>Dosage:</td><td style={{paddingRight: 30, fontWeight:"bold"}}>Effects:</td> */}
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
                        <Selection goBack={this.select} 
                        ID = {this.state.selectedID} DrugName = {this.state.selectedName} Risk = {this.state.selectedRisk}
                        Effect = {this.state.selectedEffect} Dosage = {this.state.selectedDosage} Instructions = {this.state.selectedInstructions}/>
                    </Paper>
                </div>
            )
        }

    }
};

export default Nurse;

