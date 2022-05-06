import React, {Component} from "react"
import {Link} from 'react-router-dom'

class Navbar extends Component {
    
    state = {
        account : this.props.account,
        contract : this.props.contract
    }

    widrawFunds = async () => {
      // console.log("clicked");

      let funds = await this.state.contract.methods.revenues(this.state.account).call();
      console.log(funds);
      if (funds == 0) 
        return alert("You don't have any money")      
      try {
        await this.state.contract.methods.withdraw().send({from: this.state.account});
        alert("Sucess");
      } catch (error) {
        console.log(error);
        alert("something is wrong");
        // console.log();
        
      }
    }

    
    payRent = async () => {

      // console.log("pay rent");
      let propertyId = document.getElementById("propertyId-rent").value;
      let numOfMonths = document.getElementById("numOfMonths").value;

      // console.log(asset);
      try {
        let asset = await this.state.contract.methods.assets(propertyId).call();
        // console.log(asset.tenant);
        if(asset.tenant != this.state.account) {
          alert("You are not tenant of this property");
        }
        let numOfStakeholders = await this.state.contract.methods.numOfStakeholdersForProperty(asset.id).call();
        // console.log(asset.rentPer30Day);
        console.log(numOfStakeholders);
        await this.state.contract.methods.payRent(numOfMonths,propertyId,numOfStakeholders).send({from: this.state.account,  value: (asset.rentPer30Day) * numOfMonths })
        // await this.state.contract.methods.distributeRent(asset.id).send({from:this.state.account})
        alert("Rent Paid")
      } catch (error) {
        console.log(error);
      }
    }

    render() { 
        return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark"> 
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              RET
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-asset">
                    List Property
                  </Link>
                </li>
              </ul>
              {/* <button className="btn btn-primary" onClick={this.widrawFunds}>Widraw</button>
              <div className="me-2 nav-link">{this.state.account}</div> */}
            </div>
          </div>
              <div className="nav-item dropdown">
        <a className="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        {this.state.account}
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          <li><button className="dropdown-item" onClick={this.widrawFunds}  > Widraw Funds</button></li>
          <li><button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#payRent">Pay Rent</button></li>
        </ul>
      </div>

{/* Modal for Paying rent  */}
        <div className="modal fade" id="payRent" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">Pay Rent</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"  />
              </div>
              <div className="modal-body">
              <div className="mb-3 row">
                <label htmlFor="propertyId-rent" className="col-sm-2 col-form-label">Property Id</label>
             <div className="col-sm-10">
          <input type="text" className="form-control-plaintext" id="propertyId-rent"/>
        </div>
      </div>
              <div className="mb-3 row">
                <label htmlFor="numOfMonths" className="col-sm-2 col-form-label">Number of months</label>
             <div className="col-sm-10">
          <input type="number" className="form-control-plaintext" id="numOfMonths"/>
        </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={this.payRent} >Pay Rent</button>
              </div>
            </div>
          </div>
        </div>
      </div>

</nav>
        )
    }
}

export default Navbar;