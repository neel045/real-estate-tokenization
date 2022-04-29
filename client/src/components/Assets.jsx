import React, {Component} from "react"
import Asset from "./Asset";

class Assets extends Component {
    
    state = {
    contract : this.props.contract,
    numOfProperties: 0,
    assets :  []
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
            console.log(val[0]["propertyID"]);
            this.setState({assets: val});
            console.table(val);
        })

        
    }

    getAsset =  (id) => {
        return  this.state.contract.methods.assets(id).call();
    }

    render() { 
        return(
            
            
          <div className="container">

                {this.state.assets.map((asset,index) => (
                    <Asset key={asset.propertyID} asset={asset} />
                    
                    )) }
            </div>
            
        )
    }
}

export default Assets;