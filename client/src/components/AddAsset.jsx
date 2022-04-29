import axios from "axios";
import React, {Component} from "react"


class AddAsset extends Component {
    
    state = {
      contract : this.props.contract,
      account : this.props.accounts[0]
    }

    componentDidMount = async () =>{
        console.log(this.state.contract, this.state.account);

    }

    addProperty = async (e) => {
        e.preventDefault();
        console.log(this.state.account);
        const mainPropertyOwner = await document.getElementById("property_owner").value;
        const property_symbol = await document.getElementById("property_symbol").value;
        const property_id = await document.getElementById("property_id").value;
        console.log(mainPropertyOwner,property_id,property_symbol);

        const ownerId = await axios.get("http://127.0.0.1:8000/api/v1/citizens",{retId: mainPropertyOwner});

        if(!ownerId) return alert("You are not in our");

        const isPropertyVerified = await axios.get("http://127.0.0.1:8000/api/v1/properties/verify-property",{ownerId: ownerId,propertyId: property_id});

        if(isPropertyVerified){
            const res = await this.state.contract.methods.addProperty(property_id,property_symbol,mainPropertyOwner).send({from : this.state.account});
            console.log(res);
        }



    }
    

    render() { 
        return(
            <div className="container px-4"> 

                <form onSubmit={this.addProperty}>
                    <div className="mb-3">
                        <label htmlFor="property_owner" className="form-label">Property Owner Address</label>
                        <input type="text" className="form-control" id="property_owner" aria-describedby="emailHelp" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="property_symbol" className="form-label">Propety Symbol</label>
                        <input type="text" className="form-control" id="property_symbol"  required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="property_id" className="form-label">property id</label>
                        <input type="text" className="form-control" id="property_id" required />
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={this.addProperty} >Add Property</button>
                </form>
            </div>

        )
    }
}

export default AddAsset;