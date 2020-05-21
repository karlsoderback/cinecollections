import React from "react";
import { browserHistory } from "react-router";

import { connect } from "react-redux";
import { logged_out } from "../redux/actions.js";
import { loginState } from "../redux/reducers/index.js";

function Profile(props) {

    function logOut() {
        props.dispatch(logged_out());
        browserHistory.push("/");
    }
    function home(){
        browserHistory.push("/");
    }

    return (
        <div className="profile">
            <h1>{props.username}</h1>
            <button onClick={logOut}>Log out</button>
            <button onClick={home}>Home</button>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        //loggedIn: state.loginState.loggedIn,
        //token: state.loginState.token,
        username: state.loginState.username,
    }
}

export default connect(mapStateToProps)(Profile);

