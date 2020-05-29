import React from "react";

import "./css/general.css";

import { connect } from "react-redux";

import Button from "./button";
import Popup from "reactjs-popup";

import { sendAuthorizedBackendGET } from "../rest/backendAPI";

import { collectionsUpdated } from "../redux/actions";

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
                this.props.dispatch(collectionsUpdated()); 
            }).catch(error => {
                this.setState({response: error});
        });
    }

    render () { // TODO - Close popup after creation
        let create;
        if(this.props.loggedInUser === this.props.displayUser) {
            create = 
                <Popup trigger={
                    <Button>
                    Create New Collection
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
                        <Button onClick={this.create}>Create</Button>
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
          displayUser: state.loginState.displayedUser,
          token: state.loginState.token
    }
  }
  
  export default connect(mapStateToProps)(CreateCollection);