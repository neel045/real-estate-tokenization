import React, {Component} from "react"
import axios from "axios";

class Signup extends Component {
    
    state = {
        accounts : this.props.accounts,
        contract : this.props.contract
    }

    signup = async (e) => {
        console.log(this.state.accounts);
        e.preventDefault();
        const aadhar = document.getElementById("aadhar").value;

        let isVerified = await axios.get(`http://127.0.0.1:8000/api/v1/citizens/${aadhar}`);

        isVerified = isVerified.data;

        let ac = this.state.accounts[0];
        if (isVerified) {
            try {
                await axios.post(`http://127.0.0.1:8000/api/v1/citizens/${aadhar}`, {retId: this.state.accounts[0]});
                await this.state.contract.methods.addStakeholder(ac).send({from : this.state.accounts[0]});

                alert("Sucess");
            } catch (error) {
                alert("Something gone wrong")
            }
        }

    }

    render() { 
        return(
            <div className="container px-4 w-50">   
            <h2 className="my-4">SignUP</h2>

            <form onSubmit={this.signup}>
                <div className="mb-3">
                    <label htmlFor="aadhar" className="form-label">Aadhar Number</label>
                    <input type="text" className="form-control" id="aadhar"  required/>
                </div>
                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
        </div>

        )
    }
}

export default Signup;