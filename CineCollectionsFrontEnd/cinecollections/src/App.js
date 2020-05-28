import React from "react";
import Startscreen from "./components/startscreen";
import Profile from "./components/profile";

import { connect } from "react-redux";
import { loggedIn, displayedUser } from "./redux/actions";
import { browserHistory } from "react-router";

class App extends React.Component {

  componentDidMount() {
    if(this.props.loggedIn) {
      this.props.dispatch(displayedUser(this.props.loggedInUser))
      browserHistory.push("/profile");
    } else if(localStorage.getItem("loggedIn")) {
      let loginData = {username: localStorage.getItem("loggedInUser"), token: localStorage.getItem("token")};
      this.props.dispatch(loggedIn(loginData))
      this.props.dispatch(displayedUser(loginData.username))
      browserHistory.push("/profile");
    }
  }
  
  render(){
    let retComponent;
    if(this.props.loggedIn) {
      retComponent = <Profile />;
    } else {
      retComponent = <Startscreen />;
    }  
    return (
      <div>
        {retComponent}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
        loggedIn: state.loginState.loggedIn,
        loggedInUser: state.loginState.loggedInUser
  }
}

export default connect(mapStateToProps)(App);
