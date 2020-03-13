import React, { Component } from 'react';
import '../App.css';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
class Selection extends Component {
    constructor (props){
        super (props);
        this.state = {
            //states to display the selected drug
            selectedID: "", selectedName: "", selectedDosage: "", selectedRisk: "", selectedEffect: "", selectedInstructions: "",
        };
    }

    //set state based on drug properties passed in from the "Nurse" component
    componentWillMount() {
        this.setState({selectedID: this.props.ID});
        this.setState({selectedName: this.props.DrugName});
        this.setState({selectedDosage: this.props.Dosage});
        this.setState({selectedRisk: this.props.Risk});
        this.setState({selectedEffect: this.props.Effect});
        this.setState({selectedInstructions: this.props.Instructions});
    }


    render() {
        return (
            <div>
                <Button onClick={this.props.goBack} variant = "contained">Go Back</Button> <br /><br /><br /> 
                <Card variant="outlined" id="select" >
                    <CardContent>
                    <h2>You have selected: {this.state.selectedName}</h2>
                    <h5><u>Drug ID: {this.state.selectedID}</u></h5> 
                    <p style={{fontWeight: "bold"}}> <span style={{color: 'rgb(139, 86, 232'}}>Risk:</span>  {this.state.selectedRisk}</p>
                    <p style={{fontWeight: "bold"}}> <span style={{color: 'rgb(139, 86, 232'}}>Effects:</span>  {this.state.selectedEffect}</p>
                    <br />
                
                    <h2 style={{color: "red"}}><u>Please read the following instructions carefully:</u></h2>
                    <p>{this.state.selectedInstructions}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }
};

export default Selection;

