import { Component } from "react";

class Alert extends Component{

    state = {
        status : this.props.status,
        message : this.props.message,
        type : this.props.type,
        alertClass: ""
    }

    componentDidMount() {
        this.setState({alertClass : this.typeOfAlert});

    }

    typeOfAlert = () => {
        return `alert alert-${this.state.type} alert-dismissible fade show`;
    }

    render() {
        return (
            <div className={this.state.alertClass} role="alert">
        <strong>{this.state.status}</strong> {this.state.message}
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
        )
    }
}

export default Alert;