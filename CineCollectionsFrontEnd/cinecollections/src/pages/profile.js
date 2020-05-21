import React, { useState } from "react";

import { browserHistory } from "react-router";
import { connect } from "react-redux";
import { logged_out } from "../redux/actions.js";

import { sendGET } from "../rest/rest.js"

import collection from "../models/collection.js";

function Profile(props) {
    const [myCollections, setMyCollections] = useState("");
    const [subscribedCollections, setSubscribedCollections] = useState("");
    
    /*sendGET("collection/getallforuser?username=" + props.username).then(
        data => {
            setMyCollections(data.my_collections);
            setSubscribedCollections(data.subscribed_collections);
            console.log("My collections: ");
            console.log(myCollections);
            console.log("Subcribed collections: ");
            console.log(subscribedCollections);
        }
    )*/ //TODO - investigate spam bug

    function logOut() {
        props.dispatch(logged_out());
        browserHistory.push("/");
    }
    function home(){
        browserHistory.push("/");
    }

    function renderCollections(){    
        for (var i = 0; i < myCollections.length; i++) {
            // TODO - render all collections here
        }

        return (
            <div className="collections">
                <h1>test</h1>
            </div>
        )
    }

    return (
        <div className="profile">
            <h1>{props.username}</h1>
            <button onClick={logOut}>Log out</button>
            <button onClick={home}>Home</button>
            <div className="collections">
                <h2>Collections</h2>

            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        username: state.loginState.username,
    }
}

export default connect(mapStateToProps)(Profile);

