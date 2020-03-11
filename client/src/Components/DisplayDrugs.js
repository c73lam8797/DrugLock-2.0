import React, { Component } from 'react';
import '../App.css';
import Button from '@material-ui/core/Button';

class DisplayDrugs extends Component {
    constructor (props){
        super (props);
        this.state = {
            drugDataKey: [],
            drugDataValue: [],
            // drugData: {},
        };
        this.display = this.display.bind(this);
        this.delete = this.delete.bind(this);
    }
    
    componentWillMount(){
        this.callBackendAPI()
        .then (res => { 
            this.setState({drugDataKey: [...Object.keys(res.data)]});  //storing drugIDs into state
            this.setState({drugDataValue: [...Object.values(res.data)]});// store the properties into state 

            // this.setState({drugData: {...res.data}});
            console.log("these are the keys: ", this.state.drugDataKey);
            console.log("these are the values: ", this.state.drugDataValue);
            // console.log("both: ", this.state.drugData);
        })
        .catch (err => console.error(err))
    }   

    callBackendAPI = async () => {
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

    deleteFromDatabase = async(id) => {
        const response = await fetch("http://localhost:5000/deleteDrug", {
            method: 'DELETE',
            body:  JSON.stringify({ 
                    ID : id
            }),
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
        this.deleteFromDatabase(item.ID)
        .then(res => console.log(res.data))
        .then(()=> this.componentWillMount())
        .catch(err =>console.error(err))
    }

    display() {
        if (this.state.drugDataKey.length != 0){
            let vals = this.state.drugDataValue;

            let items = vals.map(d => {
                return (
                    <tr key={d.ID}>
                        <td style={{paddingRight: 30}}>{d.ID}</td><td style={{paddingRight: 30}}>{d.DrugName}</td><td style={{paddingRight: 30}}>{d.Dosage}</td>
                        <td style={{paddingRight: 30}}>{d.Instructions}</td><td style={{paddingRight: 30}}>{d.Risk}</td><td style={{paddingRight: 15}}>{d.Effect}</td>
                        <td><Button color="primary">Edit</Button></td>
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
        else {
            return (
                <p>You have nothing in the database yet.</p>
            )
        }        
    }


    render() {
        let drugDisplay = this.display();
        return (
            <div>{drugDisplay}</div>
        )
    }
};

export default DisplayDrugs;

