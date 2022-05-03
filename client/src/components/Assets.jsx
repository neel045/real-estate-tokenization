import React, {Component} from "react"
import Asset from "./Asset";

class Assets extends Component {
    
    state = {
    contract : this.props.contract,
    numOfProperties: 0,
    assets :  [],
    accounts: this.props.accounts
    }

    componentDidMount = async () => {
    
        const numAssets = await this.state.contract.methods.numOfProperties().call();
        this.setState({numOfProperties: numAssets},this.getAllAssets);
    }

    getAllAssets = async () => {
        console.log("from asset",this.state.numOfProperties);
        let querries = [];
        for (let i = 1; i <= this.state.numOfProperties; i++) {
            querries.push(this.getAsset(i))
        }
            Promise.all(querries).then(val => {
                this.setState({assets: val});
            console.log(val);
        })
        
    
        
    }

    getAsset =  (id) => {
        return  this.state.contract.methods.assets(id).call();
    }

    render() { 
        return( 
          <div className="container">

                {this.state.assets.length >=1 && this.state.assets.map((asset,index) => (
                    <Asset constract={this.state.contract} accounts={this.state.accounts} key={asset.id} asset={asset} />
                    
                    )) }
            </div>
            
        )
    }
}

export default Assets;