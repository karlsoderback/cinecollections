import React from "react";

import { connect } from "react-redux";

import { Button } from "@material-ui/core";
import Popup from "reactjs-popup";

import { sendAuthorizedBackendGET } from "../rest/backendAPI";

class CreateCollection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collectionName: "",
            response: ""
        }

        this.create = this.create.bind(this);
    }

    create() { // TODO - validate input not empty
        sendAuthorizedBackendGET("collection/create?username=" + this.props.loggedInUser + "&collection_name=" + this.state.collectionName, this.props.token).then(
            data => {
                this.setState({response: (this.state.collectionName + " was created!")}); 
            }).catch(error => {
                this.setState({response: error});
        });
    }

    render () {
        let create;
        if(this.props.loggedInUser === this.props.displayedUser) {
            create = 
                <Popup trigger={
                    <Button
                    color="primary"
                    >
                    Create Collection
                    </Button>
                }
                position="right center">
                    <div>
                        {this.state.response}
                        <input 
                            type="text" 
                            value ={this.state.collectionName} 
                            onChange={e => this.setState({collectionName: e.target.value})} 
                        />
                        <Button color="primary" onClick={this.create}>Create Collection</Button>
                    </div>
                </Popup>
        } else {
            create = (null);
        }
        return (
            <div>
                {create}
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
          loggedInUser: state.loginState.loggedInUser,
          displayedUser: state.loginState.displayedUser,
          token: state.loginState.token
    }
  }
  
  export default connect(mapStateToProps)(CreateCollection);