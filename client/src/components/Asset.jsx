import React, {Component} from "react"
import { Link } from "react-router-dom";


class Asset extends Component {
    
    state = {
      asset : this.props.asset,
      accounts: this.props.accounts,
      contract: this.props.contract
      
    }


    payRent = async () => {

      try {
        
        await this.state.contract.methods.payRent( this.state.asset.id)
      } catch (error) {
        
      }
    }

    render() { 
      if (!this.state.asset) {
        return <div> No properties are listed</div>
      }
        return(

          <div className="card mb-3" style={{maxWidth: '1000px'}}>
          <div className="row g-0">
            <div className="col-md-4">
              <img src={"http://127.0.0.1:8000/images/" + this.state.asset.propertyID+".jpeg"} className="img-fluid rounded-start" alt="..." />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">Symbol: {this.state.asset.symbol}</h5>
                <p className="card-text">Owner: {this.state.asset.mainPropertyOwner}</p>
                <p className="card-text">Available Shares: {this.state.asset.availableSupply} / {this.state.asset.totalSupply}</p>
                <p className="card-text">Property id: {this.state.asset.propertyID }</p>
                <Link to={"/assets/" + this.state.asset.id} className="btn btn-primary mx-3" >More Details</Link>
                {/* {
                  this.state.accounts[0] == this.state.asset.tenant &&
                  <button className="btn btn-success" onClick={this.payRent}> Pay Rent</button>
                } */}
                
              </div>
            </div>
          </div>
        </div>
        )
    }
}

export default Asset;