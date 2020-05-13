import React, { Component, useState } from "react";
import { render } from "react-dom";
import { sendPOST } from "../rest/rest.js"
//import React, { } from "react"
import { Button, FormGroup, FormControl } from "react-bootstrap";

export default function Login(props) {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    function validateForm(username, password) {
        return username.length > 0 && password.length > 0;
    }

    function loginSubmit (event) {
        const body = 
        {
            "username": loginUsername,
            "password": loginPassword
        }
        sendPOST("auth/newsession", body);
        event.preventDefault();
    }

    function registerSubmit (event) {
        const body = 
        {
            "username": registerUsername,
            "password": registerPassword
        }
        sendPOST("newuser", body);
        event.preventDefault();
    }

    return (
        <div className="Startscreen">
            <h1>CineCollections</h1>
            <div className="Login">
                <h2>Login</h2>
                <form onSubmit={loginSubmit}>
                    <FormGroup controlId="loginUsername" bsSize="large">
                        <FormControl 
                            autoFocus
                            type="text"
                            value={loginUsername}
                            onChange={e => setLoginUsername(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup controlId="loginPassword" bsSize="large">
                        <FormControl 
                            type="password"
                            value={loginPassword}
                            onChange={e => setLoginPassword(e.target.value)}
                        />
                    </FormGroup>
                    <Button block bsSize="large" disabled={!validateForm(loginUsername, loginPassword)} type="submit">
                        Login
                    </Button>
                </form>
            </div>
            <div className="Register">
                <h2>Register</h2>
                <form onSubmit={registerSubmit}>
                    <FormGroup controlId="registerUsername" bsSize="large">
                            <FormControl 
                                autoFocus
                                type="text"
                                value={registerUsername}
                                onChange={e => setRegisterUsername(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup controlId="registerPassword" bsSize="large">
                            <FormControl 
                                type="password"
                                value={registerPassword}
                                onChange={e => setRegisterPassword(e.target.value)}
                            />
                        </FormGroup>
                        <Button block bsSize="large" disabled={!validateForm(registerUsername, registerPassword)} type="submit">
                            Register
                        </Button>
                </form>
            </div>
        </div>
    );
}
render(<Login />, document.getElementById('root'));