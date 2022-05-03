import React, {Component} from "react"
import { Link } from "react-router-dom";
import Web3 from "web3";


class AssetDetails extends Component {
    
    state = {
      asset : null,
      account : this.props.accounts[0],
      contract : this.props.contract,
      shares : [],
      interstedTenant: null
    }

    componentDidMount = async () =>{


        const path = window.location.pathname.split('/');
        const id = path[path.length - 1];
        
        const res = await this.state.contract.methods.getSharesOfProperty(id).call();

        const _address = res["0"];
        const _shares = res["1"];
        const _sharesOffered = res["2"];
        const _shareSellPrice = res["3"];

        let shares = [];

        for (let i = 0; i < _address.length; i++) {
            shares.push( { address: _address[i], share : _shares[i], sharesOffered: _sharesOffered[i], shareSellPrice : _shareSellPrice[i]})
        }

        this.setState({shares: shares});

        // for (let i = 0; i < array.length; i++) {
        //     const element = array[i];
            
        // }

        const interstedTenant = await this.state.contract.methods.getAllInterrestedTenant(id).call();
        this.setState({interstedTenant: interstedTenant})



        this.setState({asset: await this.state.contract.methods.assets(id).call() })    
        
    }

    buyShares =  async () => {

        const buyShareFrom = document.getElementById("buyShareFrom").value;
        const propertyId = this.state.asset.id;
        const numberOfsharesBuy = document.getElementById("numberOfshares-buy").value;
        const perSharePrice = document.getElementById("perSharePriceForBuying").value;



        console.log(buyShareFrom,propertyId,numberOfsharesBuy);

        try {

            await this.state.contract.methods.buyShares(buyShareFrom,propertyId,numberOfsharesBuy).send({from : this.state.account , value: perSharePrice * numberOfsharesBuy });
            alert("process has been sucessful");
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }




    }


    offerShares = async() => {
        const propertyId = this.state.asset.id;
        const sharesOfferedBy = this.state.account;
        const sharesOfferd = document.getElementById("numberOfshares-offerd").value;
        const pricePerToken = document.getElementById("pricePerToken").value;

        try {
            await this.state.contract.methods.offerShares(propertyId,sharesOfferedBy,sharesOfferd,pricePerToken).send({from: sharesOfferedBy});
            alert("sucess");
        } catch (error) {
            alert("Something went wrong");
            
        }
         
    }

    fillFromData = (e) => {
        const buyShareFromNode = document.getElementById("buyShareFrom");
        const {buyShareFrom} = e.target.dataset;
        buyShareFromNode.value = buyShareFrom;

        const propertyIdNode = document.getElementById("propertyId");
        const {propertyId} = e.target.dataset;
        propertyIdNode.value = propertyId;

        const perSharePriceForBuyingNode = document.getElementById("perSharePriceForBuying");
        const {perSharePriceForBuying} = e.target.dataset;
        perSharePriceForBuyingNode.value = perSharePriceForBuying;


    }

    applyAsTenant = async () => {
        await this.state.contract.methods.applyTenant(this.state.asset.id).send({from :this.state.account});
    }
    

    approveTenant = async (e) => {
        const {tenantAddress} = e.target.dataset;
        try {
            await this.state.contract.methods.aproveTanent(tenantAddress,this.state.asset.id).send({from : this.state.account});
            alert(`${tenantAddress} has been approved as tenant`);
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        if (!this.state.asset) {
            return <div className="loader"></div>

        }
        return(
    <div className="container mt-4">
                <h4>Stakeholders of {this.state.asset.propertyID}</h4>
        
    <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Address</th>
            <th scope="col">Shares</th>
            <th scope="col">Offered shares</th>
            <th scope="col">share price (gwei)</th>
            <th scope="col">Buy Shares</th>
            <th scope="col">Offer Shares</th>
          </tr>
        </thead>
        <tbody>
            {
                this.state.shares.map((share , index) => (
                    <tr key={index+1}>
                    <th scope="row">{index +1}</th>
                    <td>{share.address}</td>
                    <td>{share.share}</td>
                    <td>{share.sharesOffered}</td>
                    <td>{share.shareSellPrice/1000}</td>
                    <td>{share.sharesOfferd !=0 && this.state.account != share.address &&  <button  className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#buyshares" data-buy-share-from={share.address} data-property-id={this.state.asset.id} data-per-share-price-for-buying={share.shareSellPrice} onClick={this.fillFromData}>Buy</button> }</td>


                    <td>{share.share !=0 && this.state.account == share.address &&<button  
                    className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#offershares" data-buy-share-from={share.address} data-property-id={this.state.asset} data-per-share-price={share.shareSellPrice}>Offer Share</button> }</td>
                  </tr>
                ))
                }

        </tbody>
      </table>


        {/* Modal for buying shares */}
        <div className="modal fade" id="buyshares" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">Buy Shares</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
              <div className="mb-3 row">
                <label htmlFor="buyShareFrom" className="col-sm-2 col-form-label">From: </label>
             <div className="col-sm-10">
          <input type="text" readOnly className="form-control-plaintext" id="buyShareFrom"/>
        </div>
              <div className="mb-3 row">
                <label htmlFor="propertyId" className="col-sm-2 col-form-label">Property Id: </label>
             <div className="col-sm-10">
          <input type="text" readOnly className="form-control-plaintext" id="propertyId"/>
        </div>
      </div>
              <div className="mb-3 row">
                <label htmlFor="numberOfshares-buy" className="col-sm-2 col-form-label">Number of Tokens: </label>
             <div className="col-sm-10">
          <input type="number" className="form-control-plaintext" id="numberOfshares-buy"/>
        </div>
        <input hidden id="perSharePriceForBuying" />
      
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button onClick={this.buyShares} type="button" className="btn btn-primary">Buy now</button>
              </div>
            </div>
          </div>
        </div>
      </div>


</div>



        {/* Modal for offering shares */}
        <div className="modal fade" id="offershares" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">Offer Shares</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"  />
              </div>
              <div className="modal-body">
              <div className="mb-3 row">
                <label htmlFor="sharesOfferedBy" className="col-sm-2 col-form-label">From: </label>
             <div className="col-sm-10">
          <input type="text" value={this.state.account} readOnly className="form-control-plaintext" id="sharesOfferedBy"/>
        </div>
              <div className="mb-3 row">
                <label htmlFor="propertyId-offer" className="col-sm-2 col-form-label">Property Id: </label>
             <div className="col-sm-10">
          <input type="text" readOnly className="form-control-plaintext" id="propertyId-offer" value={this.state.asset.id}/>
        </div>
      </div>
              <div className="mb-3 row">
                <label htmlFor="numberOfshares-offerd" className="col-sm-2 col-form-label">Number of Tokens: </label>
             <div className="col-sm-10">
          <input type="number" className="form-control-plaintext" id="numberOfshares-offerd"/>
        </div>
              <div className="mb-3 row">
                <label htmlFor="pricePerToken" className="col-sm-2 col-form-label">Price Per Token</label>
             <div className="col-sm-10">
          <input type="number" className="form-control-plaintext" id="pricePerToken"/>
        </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button onClick={this.offerShares} type="button" className="btn btn-primary">Offer Shares</button>
              </div>
            </div>
          </div>
        </div>
      </div>


</div>



</div>

{ this.state.account != this.state.asset.mainPropertyOwner &&
<div className="card mt-4">
        <div className="card-header">
          Apply To rent property
        </div>
        <div className="card-body">
            <p>Current tenant: {this.state.asset.tenant}</p>
            
          <button className="btn btn-primary" onClick={this.applyAsTenant} >Apply as tenant</button>
        </div>
      </div>

}
      {/* //tenant listed */}

{
    this.state.account == this.state.asset.mainPropertyOwner &&

    <div>

        <h3 className="mt-3">Interrested Tenents</h3>

      <table className="table mt-5">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Address</th>
            <th scope="col">Approve</th>
          </tr>
        </thead>
        <tbody>
            {
                this.state.interstedTenant.map((tenant , index) => (
                   
                    this.state.asset.tenant != tenant &&

                   <tr key={index+1}>
                    <th scope="row">{index +1}</th>
                    <td>{tenant}</td>

                    <td>{<button data-tenant-address={tenant} onClick={this.approveTenant} className="btn btn-success">Approve</button> }</td>
                  </tr>
                ))
            }

        </tbody>
      </table>

            </div>

}
</div>



        )
    }
}

export default AssetDetails;