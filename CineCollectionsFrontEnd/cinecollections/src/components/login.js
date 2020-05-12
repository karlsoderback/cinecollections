import React, { Component, useState } from "react";
import { render } from "react-dom";
import { sendPOST } from "../rest/rest.js"
//import React, { } from "react"
import { Button, FormGroup, FormControl } from "react-bootstrap";

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit (event) {

        const body = 
        {
            "username": username,
            "password": password
        }
        sendPOST("/auth/newsession", body);

        event.preventDefault();
    }

    return (
        <div className="Login">
            <h1>CineCollections</h1>
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="username" bsSize="large">
    
                    <FormControl 
                        autoFocus
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
        
                    <FormControl 
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </FormGroup>
                <Button block bsSize="large" disabled={!validateForm()} type="submit">
                    Login
                </Button>
            </form>
        </div>
    );
}
render(<Login />, document.getElementById('root'));