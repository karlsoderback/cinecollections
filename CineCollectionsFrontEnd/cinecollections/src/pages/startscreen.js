import React, { useEffect , useState } from "react";
import { render } from "react-dom";
import { sendPOST } from "../rest/rest.js"
import { Button, FormGroup, FormControl } from "react-bootstrap";
import Parser from "html-react-parser";
//import { Redirect } from "react-router-dom";
//import history from "../components/history.js"
import { browserHistory } from "react-router";

import { connect } from "react-redux";
import { logged_in } from "../redux/actions.js";


function Startscreen({logged_in}) {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    //const [token, setToken] = useState("");
    const [response, setResponse] = useState("");
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") || "");

    function renderRedirect() {
        if (loggedIn) { // TODO - LOG state and check through global state if logged in or not
            browserHistory.push("/profile");
        }
    }

    function validateForm(username, password) {
        return username.length > 0 && password.length > 0;
    }

    function loginSubmit (event) {
        const body =
        {
            "username": loginUsername,
            "password": loginPassword
        }
        sendPOST("auth/newsession", body).then(
            data => {
                setResponse("");
                //setToken(data.jwt);
                //setLoggedIn(true);
                /*localStorage.setItem("username", loginUsername);
                localStorage.setItem("token", data.jwt);
                localStorage.setItem("loggedIn", true);*/
                var data;
                data.username = loginUsername;
                data.token = data.jwt;
                logged_in(data);
            }
            ).catch(error => {
                {setResponse(error.message)};
             });
        
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
                console.log(data);
            }
            ).catch(error => {
                {setResponse(error.message)};
             });;
        event.preventDefault();
    }

    return (
        <div className="Startscreen">
            {renderRedirect()}
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
render(<Startscreen />, document.getElementById('root'));

export default connect(
    state => (//{
        /*loggedIn: state.loginState.loggedIn,
        token: state.loginState.token,
        username: state.loginState.username}),*/
        null,
        {logged_in})
)(Startscreen);