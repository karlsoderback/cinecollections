import React from "react";
import { sendBackendPOST } from "../rest/backendAPI"
import { Button, FormGroup, FormControl } from "react-bootstrap";
import Parser from "html-react-parser";
import { browserHistory } from "react-router";

import { connect } from "react-redux";
import { loggedIn, displayedUser } from "../redux/actions";


class Startscreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loginUsername: "",
            loginPassword: "",
            registerUsername: "",
            registerPassword: "",  
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

    registerSubmit (event) {
        const body = 
        {
            "username": this.state.registerUsername,
            "password": this.state.registerPassword
        }
        sendBackendPOST("user/new", body).then(
            data => {
                this.setState({response: ""});
                this.createNewSession(body);
            }).catch(error => {
                {this.setState({response: error.message})};
            });
        event.preventDefault();
    }

    render(){
        return (
            <div className="Startscreen">
                <h1>CineCollections</h1>
                <div className="Login">
                    <h2>Login</h2>
                    <form onSubmit={this.loginSubmit}>
                        <FormGroup controlId="loginUsername" bssize="large">
                            <FormControl 
                                autoFocus
                                type="text"
                                value={this.state.loginUsername}
                                onChange={e => this.setState({loginUsername: e.target.value})}
                            />
                        </FormGroup>
                        <FormGroup controlId="loginPassword" bssize="large">
                            <FormControl 
                                type="password"
                                value={this.state.loginPassword}
                                onChange={e => this.setState({loginPassword: e.target.value})}
                            />
                        </FormGroup>
                        <Button block bssize="large" disabled={!this.validateForm(this.state.loginUsername, this.state.loginPassword)} type="submit">
                            Login
                        </Button>
                    </form>
                </div>
                <div className="Register">
                    <h2>Register</h2>
                    <form onSubmit={this.registerSubmit}>
                        <FormGroup controlId="registerUsername" bssize="large">
                                <FormControl 
                                    autoFocus
                                    type="text"
                                    value={this.state.registerUsername}
                                    onChange={e => this.setState({registerUsername: e.target.value})}
                                />
                            </FormGroup>
                            <FormGroup controlId="registerPassword" bssize="large">
                                <FormControl 
                                    type="password"
                                    value={this.state.registerPassword}
                                    onChange={e => this.setState({registerPassword: e.target.value})}
                                />
                            </FormGroup>
                            <Button block bssize="large" disabled={!this.validateForm(this.state.registerUsername, this.state.registerPassword)} type="submit">
                                Register
                            </Button>
                    </form>
                </div>
                <div className="response">
                    {Parser(this.state.response)}
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
