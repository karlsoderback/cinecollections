import React, { Component, useState } from "react";
import { render } from "react-dom";
import history from "../components/history.js";

export default function Profile(props) {

    function logOut() {
        localStorage.clear();
        history.push("/start");
    }

    return (
        <div className="profile">
            <h1>Hello world</h1>
            <button onClick={logOut}>Log out</button>
        </div>
    );
}
render(<Profile />, document.getElementById('root'));