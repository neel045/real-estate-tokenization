import React, {Component} from "react"

class Asset extends Component {
    
    state = {
      asset : this.props.asset,
      
    }
    render() { 
        return(

          <div className="card mb-3" style={{maxWidth: '1000px'}}>
          <div className="row g-0">
            <div className="col-md-4">
              <img src="https://blog.hubspot.com/hubfs/parts-url.jpg" className="img-fluid rounded-start" alt="..." />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">Symbol: {this.state.asset.symbol}</h5>
                <p className="card-text">Owner: {this.state.asset.mainPropertyOwner}</p>
                <p className="card-text">Awailable Shares: {this.state.asset.totalSupply }</p>
                <p className="card-text">Property id: {this.state.asset.propertyID }</p>
                <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
              </div>
            </div>
          </div>
        </div>
        )
    }
}

export default Asset;