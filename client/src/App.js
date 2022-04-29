import React, { Component } from "react";
import SimpleStorageContract from "./contracts/RealEstateTokenization.json";
import getWeb3 from "./getWeb3";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Assets from "./components/Assets";
import AddAsset from "./components/AddAsset";

import "./App.css";
import Signup from "./components/Signup";

class App extends Component {
  state = {
    isStakeholder: false,
    web3: null,
    accounts: null,
    contract: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.verifyAccount);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    // // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });
    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();
    // // Update state with the result.
    // this.setState({ storageValue: response });
    // console.log(this.state);
  };

  verifyAccount = async () => {
    const { accounts, contract } = this.state;
    let result = await contract.methods.isStakeholder(accounts[0]).call();
    this.setState({ isStakeholder: result[0] });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Router>
          <Navbar accounts={this.state.accounts[0]} />
          <Routes>
            <Route
              exact
              path="/"
              element={
                !this.state.isStakeholder ? (
                  <Signup
                    to="/signup"
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                  />
                ) : (
                  <Assets
                    contract={this.state.contract}
                    numOfProperties={this.state.numOfProperties}
                  />
                )
              }
            />

            <Route
              exact
              path="/add-asset"
              element={
                <AddAsset
                  contract={this.state.contract}
                  accounts={this.state.accounts}
                />
              }
            />
          </Routes>
        </Router>

        {/* <h3>{this.state.numOfProperties}</h3> */}
      </div>
    );
  }
}

export default App;
