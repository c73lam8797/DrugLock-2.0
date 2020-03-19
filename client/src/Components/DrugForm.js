import React, { Component } from 'react';
import '../App.css';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class DrugForm extends Component {
    constructor (props){
        super (props);
        this.state = {
            //properties binded to the input on the form 
            drugID: "", drugName: "", dosage: "", instructions: "", risk: "", effects: "",
            
            //states determining what to display
            attemptToSubmit: false, alreadyExists: false,  successfulSubmit: false, wantToEdit: false, isEmpty: true,
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
    
    //used to bind passed in props from the pharmacist page to the state, which displays it on the form
    componentDidMount(){
        console.log("want to edit", this.props.wanttoedit); //for debugging 
        if (this.props.wanttoedit){
            this.setState({drugID      : this.props.editID}); 
            this.setState({drugName    : this.props.editName}); 
            this.setState({dosage      : this.props.editDosage}); 
            this.setState({instructions: this.props.editInstructions}); 
            this.setState({risk        : this.props.editRisk}); 
            this.setState({effects     : this.props.editEffect}); 
    
            //if its an empty form, want to edit should be false (default)
            //if edit, want to edit should be passed as true
            if (this.props.wanttoedit == "true") {
                this.setState({wantToEdit  : true});
            }
        }
    }

    handleSubmit(event) {
        event.preventDefault();
 
        //if any of the strings are empty or undefined, the form is not valid
        if ((this.state.drugID       == undefined || this.state.drugID       == "") || 
            (this.state.drugName     == undefined || this.state.drugName     == "") || 
            (this.state.dosage       == undefined || this.state.dosage       == "") ||
            (this.state.instructions == undefined || this.state.instructions == "") || 
            (this.state.risk         == undefined || this.state.risk         == "") || 
            (this.state.effects      == undefined || this.state.effects      == "") )
        {
            this.setState ({attemptToSubmit: true});
            this.setState ({isEmpty: true})
        }

        else{
            this.setState({isEmpty: false}); //otherwise, it is not empty

            this.callBackendAPI()
            .then(res => {
                if (this.state.wantToEdit){
                    console.log("Drug successfully edited!")
                }
                //if someone wants to submit a new entry, we must notify them whether or not that drug already exists
                else {
                    console.log("Drug already found: ", res.data)
                    this.setState({alreadyExists: res.data});
                }

                //if the ID doesnt already exist in the database(on new entry), or someone wants to edit the form, submission is successful
                if ((this.state.alreadyExists==false) || this.state.wantToEdit){ 
                    console.log ("Successful submission!")
                    this.setState({successfulSubmit: true});

                    //returns back to pharm page using the props passed in, setting the drugForm state on that page to false
                    if (this.state.successfulSubmit){
                        this.props.backToPharm(); 
                    }
                }
            })
            .catch(err => console.error(err))
            .then(()=>{
                //there is always an attempt to submit
                this.setState ({attemptToSubmit: true});
            })
        }
    }

    callBackendAPI = async () => {
        const response = await fetch("http://localhost:5000/newdrug", {
            method: 'POST',
            //send in JSON to the backend to write into database 
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

        const body = await response.json();
        if (response.status!== 200) {
            throw Error(body.message)
        }
        return body;
    }

    render() {
        let emptyForm;
        //if someone attempts to submit, but the form has an empty field
        if (this.state.attemptToSubmit && this.state.isEmpty) { emptyForm = <h6>Please fill in all fields before submitting.</h6>}
        //if the drug was already found in the database, the person does NOT want to edit, and the form is not empty
        else if (this.state.alreadyExists && !this.state.wantToEdit && !this.state.isEmpty) {emptyForm = <h6>The drug ID already exists. </h6> }
        //if the submission was successful
        else if (this.state.successfulSubmit) {emptyForm = <h6>Submission was successful.</h6>}

       
        return (
            <Paper elevation={3} style={{fontFamily: 'Montserrat', padding:20}}>

                 {/* onClick, use the backToPharm props passed in from the pharmacist page, toggling the 'drugForm' state to false */}
                <Button variant="contained" onClick={this.props.backToPharm} >Go Back</Button>

                <h1>{this.state.wantToEdit ? 'Edit Drug' : 'Enter a New Drug'}</h1>
                {emptyForm}
                <form>
                    <p> Enter the Drug ID: </p>
                    <TextField onChange={this.handleChangeID} value={this.state.drugID || ""} label="Drug ID" variant="outlined" required/> <br />

                    <p> Enter the Drug Name: </p>
                    <TextField onChange={this.handleChangeName} value={this.state.drugName || ""} label="Drug Name" variant="outlined" required/> <br />

                    <p> Enter the Dosage: </p>
                    <TextField onChange={this.handleChangeDosage} value={this.state.dosage || ""} label="Dosage" variant="outlined" required/> <br />

                    <p> Enter the Administration Instructions: </p>
                    <TextField onChange={this.handleChangeInstructions} value={this.state.instructions || ""} label="Instructions" variant="outlined" style={{width: 500}} rows={3} required multiline/> <br />

                    <p> What is the Risk of Fatality? </p>
                    <select onChange={this.handleChangeRisk} value={this.state.risk || ""} required> 
                        <option>        </option>
                        <option>Low     </option>
                        <option>Medium  </option>
                        <option>High    </option>
                    </select> <br />

                    <p> What are the Possible Effects? </p>
                    <TextField onChange={this.handleChangeEffects} value={this.state.effects || ""} label="Effects" variant="outlined" required/> <br />
                    <br />
                    
                    <Button variant="contained" type="submit" onClick={this.handleSubmit}>Submit Drug Entry</Button>
                </form>
            </Paper>
        )
    }
};

export default DrugForm;

