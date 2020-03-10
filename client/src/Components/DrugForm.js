import React, { Component } from 'react';
import '../App.css';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class DrugForm extends Component {
    constructor (props){
        super (props);
        this.state = {
            drugID: "",
            drugName: "",
            dosage: "",
            instructions: "",
            risk: "",
            effects: "",


            attemptToSubmit: false,
            emptyForm: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleChangeID          = this.handleChangeID.bind(this);
        this.handleChangeName        = this.handleChangeName.bind(this);
        this.handleChangeDosage      = this.handleChangeDosage.bind(this);
        this.handleChangeInstructions= this.handleChangeInstructions.bind(this);
        this.handleChangeRisk        = this.handleChangeRisk.bind(this);
        this.handleChangeEffects     = this.handleChangeEffects.bind(this);
    }
    handleChangeID          (event){ this.setState({drugID      : event.target.value}); }
    handleChangeName        (event){ this.setState({drugName    : event.target.value}); }
    handleChangeDosage      (event){ this.setState({dosage      : event.target.value}); }
    handleChangeInstructions(event){ this.setState({instructions: event.target.value}); }
    handleChangeRisk        (event){ this.setState({risk        : event.target.value}); }
    handleChangeEffects     (event){ this.setState({effects     : event.target.value}); }
    
    handleSubmit(event) {
        event.preventDefault();

        if (this.state.drugID != "" && this.state.drugName != "" && this.state.dosage != "" 
        && this.state.instructions != "" && this.state.risk!= "" && this.state.effects != "") {
            console.log("test");
            // event.preventDefault();
            // this.callBackendAPI()
            // .then(res => {
            //     console.log("Employee already found: ", res.data)
            //     this.setState({alreadyExists: res.data});
            // })
            // .catch(err => console.error(err)); 
        }
        else {console.log("test2"); this.setState ({attemptToSubmit: true});}
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
        let emptyForm;
        if (this.state.attemptToSubmit) { emptyForm = <h6>Please fill in all fields before submitting.</h6>}
        return (
            <Paper elevation={3} style={{fontFamily: 'Montserrat', padding:20}}>
                <Button variant="contained" onClick={this.props.backToPharm}>Go Back</Button>
                <h1>Enter a new drug</h1>
                <form>
                    <p> Enter the Drug ID: </p>
                    <TextField onChange={this.handleChangeID} value={this.state.drugID} label="Drug ID" variant="outlined" required/> <br />

                    <p> Enter the Drug Name: </p>
                    <TextField onChange={this.handleChangeName} value={this.state.drugName} label="Drug Name" variant="outlined" required/> <br />

                    <p> Enter the Dosage: </p>
                    <TextField onChange={this.handleChangeDosage} value={this.state.dosage} label="Dosage" variant="outlined" required/> <br />

                    <p> Enter the Administration Instructions: </p>
                    <TextField onChange={this.handleChangeInstructions} value={this.state.instructions} label="Instructions" variant="outlined" required/> <br />

                    <p> What is the Risk? </p>
                    <select onChange={this.handleChangeRisk} value={this.state.risk} required> 
                        <option>Low     </option>
                        <option>Medium  </option>
                        <option>High    </option>
                    </select> <br />

                    <p> What are the possible effects? </p>
                    <TextField onChange={this.handleChangeEffects} value={this.state.effects} label="Effects" variant="outlined" required/> <br />
                    <br /><br /><br /><br />
                    {emptyForm}
                    <Button variant="contained" type="submit" onClick={this.handleSubmit}>Submit Drug Entry</Button>
                </form>
            </Paper>
        )
    }
};

export default DrugForm;

