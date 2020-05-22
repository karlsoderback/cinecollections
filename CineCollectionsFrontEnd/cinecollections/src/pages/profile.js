import React, { useState } from "react";

import { browserHistory } from "react-router";
import { connect, ReactReduxContext } from "react-redux";
import { logged_out } from "../redux/actions.js";

import { sendGET } from "../rest/rest.js"

import collection from "../models/collection.js";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myCollections: [],
            subscribedCollections: []
        };

        this.logOut = this.logOut.bind(this);
        
    }
    
    componentDidMount() {
        sendGET("collection/getallforuser?username=" + this.props.username).then(
            data => {
                this.setState({myCollections: data.my_collections});
                this.setState({subscribedCollections: data.subscribed_collections});
                console.log("My collections: ");
                console.log(this.state.myCollections);
                console.log("Subcribed collections: ");
                console.log(this.state.subscribedCollections);
            }
        )
    }


    logOut() {
        this.props.dispatch(logged_out());
        browserHistory.push("/");
    }
    home(){
        browserHistory.push("/");
    }

    renderCollections(){    
        for (var i = 0; i < this.state.myCollections.length; i++) {
            // TODO - render all collections here
        }

        return (
            <div className="collections">
                <h1>test</h1>
            </div>
        )
    }

    render() {
        return (
            <div className="profile">
                <h1>{this.props.username}</h1>
                <button onClick={this.logOut}>Log out</button>
                <button onClick={this.home}>Home</button>
                <div className="collections">
                    <h2>Collections</h2>
    
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        username: state.loginState.username,
    }
}

export default connect(mapStateToProps)(Profile);

