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
         const mainPropertyOwner = await document.getElementById("property_owner").value;
        const property_symbol = await document.getElementById("property_symbol").value;
        const property_id = await document.getElementById("property_id").value;
        const total_supply = await document.getElementById("total-supply").value;
        const rentPer30Day = await document.getElementById("rentPer30Day").value;
        const rentLimitMonths = await document.getElementById("rent-limit-months").value;
        console.log(mainPropertyOwner,property_id,property_symbol);

        const ownerId = await axios.get("http://127.0.0.1:8000/api/v1/citizens",{retId: mainPropertyOwner});

        if(!ownerId) return alert("You are not in our");

        const isPropertyVerified = await axios.get("http://127.0.0.1:8000/api/v1/properties/verify-property",{ownerId: ownerId,propertyId: property_id});

        if(isPropertyVerified){
            const res = await this.state.contract.methods.addProperty(property_id,property_symbol,mainPropertyOwner,total_supply,rentPer30Day,rentLimitMonths).send({from : this.state.account});
            console.log(res);
        }



    }
    

    render() { 
        return(
            <div className="container px-4"> 
            <h3 className="mt-3 pt-2">List Property</h3>

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
                    <div className="mb-3">
                        <label htmlFor="total-supply" className="form-label">Total Supply of Tokens</label>
                        <input type="text" className="form-control" id="total-supply" required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="rentPer30Day" className="form-label">Rent of 30 days</label>
                        <input type="text" className="form-control" id="rentPer30Day" required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="rent-limit-months" className="form-label">Limit for advance payment of rent</label>
                        <input type="text" className="form-control" id="rent-limit-months" required />
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={this.addProperty} >Add Property</button>
                </form>
            </div>

        )
    }
}

export default AddAsset;