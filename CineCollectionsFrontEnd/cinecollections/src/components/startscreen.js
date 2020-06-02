import "./css/startscreen.css"
import "./css/general.css";

import React from "react";
import { sendBackendPOST } from "../rest/backendAPI"
import { Button, FormGroup, FormControl } from "react-bootstrap";
import Parser from "html-react-parser";
import { browserHistory } from "react-router";

import { connect } from "react-redux";
import { loggedIn } from "../redux/actions";


class Startscreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loginUsername: "",
            loginPassword: "",
            registerUsername: "",
            registerPassword: "",
            registerPassword2: "",
            response: "",
        };

        this.createNewSession = this.createNewSession.bind(this);
        this.loginSubmit = this.loginSubmit.bind(this);
        this.registerSubmit = this.registerSubmit.bind(this);
    }

    validateForm(username, password) {
        return username.length > 0 && password.length > 0;
    }
    
    createNewSession(body) {
        sendBackendPOST("auth/newsession", body).then(
            data => {
                this.setState({response: ""});
                let loginData = {username: body.username, token: data.jwt};
                this.props.dispatch(loggedIn(loginData));
                browserHistory.push("/profile")
            }).catch(error => {
                {this.setState({response: error.message})};
            });
        }
        
    loginSubmit (event) {
        const body =
        {
            "username": this.state.loginUsername,
            "password": this.state.loginPassword
        }
        this.createNewSession(body)
        event.preventDefault();
    }

    registerSubmit (event) { // TODO - add duplicate password field that needs to match
        const body = 
        {
            "username": this.state.registerUsername,
            "password": this.state.registerPassword
        }
        if (this.state.registerPassword === this.state.registerPassword2) {
            sendBackendPOST("user/new", body).then(
                data => {
                    this.setState({response: ""});
                    this.createNewSession(body);
                }).catch(error => {
                    {this.setState({response: error.message})};
                });
        } else {
            this.setState({response: "Passwords don't match"});
        }
        event.preventDefault();
    }

    render(){
        return (
            <div className="Startscreen">
                <h1 className="title">CineCollections</h1>
                <div className="Forms">
                    <div className="Login">
                        <form className="loginForm" onSubmit={this.loginSubmit}>
                            <FormGroup controlId="loginUsername" bssize="large">
                                <FormControl 
                                    autoFocus
                                    type="text"
                                    placeholder="Username"
                                    value={this.state.loginUsername}
                                    onChange={e => this.setState({loginUsername: e.target.value})}
                                />
                            </FormGroup>
                            <FormGroup controlId="loginPassword" bssize="large">
                                <FormControl 
                                    type="password"
                                    placeholder="Password"
                                    value={this.state.loginPassword}
                                    onChange={e => this.setState({loginPassword: e.target.value})}
                                />
                            </FormGroup>
                            <Button 
                            block bssize="large" 
                            disabled={!this.validateForm(this.state.loginUsername, this.state.loginPassword)} 
                            type="submit"
                            variant="custom"
                            >
                            <p className="formbutton">Login</p>
                            </Button>
                        </form>
                    </div>
                    <div className="Register">
                        <form className="registerForm" onSubmit={this.registerSubmit}>
                                <FormGroup controlId="registerUsername" bssize="large">
                                    <FormControl 
                                        autoFocus
                                        type="text"
                                        placeholder="Username"
                                        value={this.state.registerUsername}
                                        onChange={e => this.setState({registerUsername: e.target.value})}
                                    />
                                </FormGroup>
                                <FormGroup controlId="registerPassword" bssize="large">
                                    <FormControl 
                                        type="password"
                                        placeholder="Password"
                                        value={this.state.registerPassword}
                                        onChange={e => this.setState({registerPassword: e.target.value})}
                                    />
                                </FormGroup>
                                <FormGroup controlId="registerPassword2" bssize="large">
                                    <FormControl 
                                        type="password"
                                        placeholder="Password"
                                        value={this.state.registerPassword2}
                                        onChange={e => this.setState({registerPassword2: e.target.value})}
                                    />
                                </FormGroup>
                                <Button 
                                block bssize="large" 
                                disabled={!this.validateForm(this.state.registerUsername, this.state.registerPassword)} 
                                type="submit"
                                variant="custom"
                                >
                                <p className="formbutton">Register</p>
                                </Button>
                        </form>
                    </div>
                    <div className="response">
                        <p>{Parser(this.state.response)}</p>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loggedIn: state.loginState.loggedIn
    }
}

export default connect(mapStateToProps)(Startscreen);