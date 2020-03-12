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
            alreadyExists: false,
            successfulSubmit: false,
            wantToEdit: false,
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
    
    componentDidMount(){
        console.log("want to edit", this.props.wanttoedit);
        if (this.props.wanttoedit){
            this.setState({drugID      : this.props.editID}); 
            this.setState({drugName    : this.props.editName}); 
            this.setState({dosage      : this.props.editDosage}); 
            this.setState({instructions: this.props.editInstructions}); 
            this.setState({risk        : this.props.editRisk}); 
            this.setState({effects     : this.props.editEffect}); 
    
            //if its an empty form, want to edit should be false (default)
            //if edit, want to edit should be passed as true
            this.setState({wantToEdit  : this.props.wanttoedit});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
 
        //if the form is not empty
        if (this.state.drugID !== undefined && this.state.drugName !== undefined && this.state.dosage !== undefined 
        && this.state.instructions !== undefined && this.state.risk!== undefined && this.state.effects !== undefined) {
            event.preventDefault();
            this.callBackendAPI()
            .then(res => {
                if (this.state.wantToEdit){
                    console.log("Drug successfully edited!")
                }
                else{
                    console.log("Drug already found: ", res.data)
                    this.setState({alreadyExists: res.data});
                }

                if (!this.state.alreadyExists || this.state.wantToEdit){ //if it doesnt already exist, or someone wants to edit the form
                    console.log ("Successful submission!")
                    this.setState({successfulSubmit: true});

                    if (this.state.successfulSubmit){
                        this.props.backToPharm(); //returns back to pharm page using the props passed in, setting the drugForm state on that page to false
                    }
                }
            })
            .catch(err => console.error(err));
        }
        //there was an attempt to submit
        else {
            this.setState ({attemptToSubmit: true});
        } 
    }

    callBackendAPI = async () => {
            const response = await fetch("http://localhost:5000/newdrug", {
                method: 'POST',
                body:  JSON.stringify({ 
                        ID          : this.state.drugID,
                        DrugName    : this.state.drugName,
                        Dosage      : this.state.dosage,
                        Instructions: this.state.instructions,
                        Risk        : this.state.risk,
                        Effect      : this.state.effects,
                        Edit        : this.state.wantToEdit,
    
                }),
                headers: {
                    'Content-type': 'application/json',
                    'Accept' : 'application/json',
                }
            })
        // }

        const body = await response.json();
        if (response.status!== 200) {
            throw Error(body.message)
        }
        return body;
    }

    render() {
        let emptyForm;
        if (this.state.attemptToSubmit) { emptyForm = <h6>Please fill in all fields before submitting.</h6>}
        else if (this.state.successfulSubmit) {emptyForm = <h6>Submission was successful.</h6>}

        //onClick, use the backToPharm props passed in from the pharmacist page `
        //will set the drugForm state to false
        return (
            <Paper elevation={3} style={{fontFamily: 'Montserrat', padding:20}}>
                <Button variant="contained" onClick={this.props.backToPharm} >Go Back</Button>
                <h1>Enter a new drug</h1>
                <form>
                    <p> Enter the Drug ID: </p>
                    <TextField onChange={this.handleChangeID} value={this.state.drugID || ""} label="Drug ID" variant="outlined" required/> <br />

                    <p> Enter the Drug Name: </p>
                    <TextField onChange={this.handleChangeName} value={this.state.drugName || ""} label="Drug Name" variant="outlined" required/> <br />

                    <p> Enter the Dosage: </p>
                    <TextField onChange={this.handleChangeDosage} value={this.state.dosage || ""} label="Dosage" variant="outlined" required/> <br />

                    <p> Enter the Administration Instructions: </p>
                    <TextField onChange={this.handleChangeInstructions} value={this.state.instructions || ""} label="Instructions" variant="outlined" style={{width: 500}} rows={3} required multiline/> <br />

                    <p> What is the Risk? </p>
                    <select onChange={this.handleChangeRisk} value={this.state.risk || ""} required> 
                        <option>        </option>
                        <option>Low     </option>
                        <option>Medium  </option>
                        <option>High    </option>
                    </select> <br />

                    <p> What are the possible effects? </p>
                    <TextField onChange={this.handleChangeEffects} value={this.state.effects || ""} label="Effects" variant="outlined" required/> <br />
                    <br />
                    {emptyForm}
                    <Button variant="contained" type="submit" onClick={this.handleSubmit}>Submit Drug Entry</Button>
                </form>
            </Paper>
        )
    }
};

export default DrugForm;

