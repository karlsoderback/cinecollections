import React, { useState } from "react";
import { sendPOST } from "../rest/rest.js"
import { Button, FormGroup, FormControl } from "react-bootstrap";
import Parser from "html-react-parser";
import { browserHistory } from "react-router";

import { connect } from "react-redux";
import { logged_in } from "../redux/actions.js";


function Startscreen (props) {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
 
    const [response, setResponse] = useState(""); 
    
    if(props.loggedIn) {
        browserHistory.push("/profile");
    }

    function validateForm(username, password) {
        return username.length > 0 && password.length > 0;
    }
    
    function createNewSession(body) {
        sendPOST("auth/newsession", body).then(
            data => {
                setResponse("");
                let loginData = {username: body.username, token: data.jwt};
                props.dispatch(logged_in(loginData));
                browserHistory.push("/profile")
            }).catch(error => {
                {setResponse(error.message)};
            });
        }
        
    function loginSubmit (event) {
        const body =
        {
            "username": loginUsername,
            "password": loginPassword
        }
        createNewSession(body)
        event.preventDefault();
    }

    function registerSubmit (event) {
        const body = 
        {
            "username": registerUsername,
            "password": registerPassword
        }
        sendPOST("newuser", body).then(
            data => {
                setResponse("");
                createNewSession(body);
            }).catch(error => {
                {setResponse(error.message)};
            });
        event.preventDefault();
    }

    return (
        <div className="Startscreen">
            <h1>CineCollections</h1>
            <div className="Login">
                <h2>Login</h2>
                <form onSubmit={loginSubmit}>
                    <FormGroup controlId="loginUsername" bssize="large">
                        <FormControl 
                            autoFocus
                            type="text"
                            value={loginUsername}
                            onChange={e => setLoginUsername(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup controlId="loginPassword" bssize="large">
                        <FormControl 
                            type="password"
                            value={loginPassword}
                            onChange={e => setLoginPassword(e.target.value)}
                        />
                    </FormGroup>
                    <Button block bssize="large" disabled={!validateForm(loginUsername, loginPassword)} type="submit">
                        Login
                    </Button>
                </form>
            </div>
            <div className="Register">
                <h2>Register</h2>
                <form onSubmit={registerSubmit}>
                    <FormGroup controlId="registerUsername" bssize="large">
                            <FormControl 
                                autoFocus
                                type="text"
                                value={registerUsername}
                                onChange={e => setRegisterUsername(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup controlId="registerPassword" bssize="large">
                            <FormControl 
                                type="password"
                                value={registerPassword}
                                onChange={e => setRegisterPassword(e.target.value)}
                            />
                        </FormGroup>
                        <Button block bssize="large" disabled={!validateForm(registerUsername, registerPassword)} type="submit">
                            Register
                        </Button>
                </form>
            </div>
            <div className="response">
                {Parser(response)}
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        loggedIn: state.loginState.loggedIn
    }
}

export default connect(mapStateToProps)(Startscreen);
