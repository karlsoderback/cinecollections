import React from "react";
//import { Router, Switch, Route } from "react-router-dom";



import Startscreen from "./pages/startscreen.js";
//import Profile from "./pages/profile.js";

export default function App(props){

      return (
        <Startscreen />
        /*<div className="routes">
            <Switch>
              <Route path = "/" exact component={Startscreen} />
              <Route path  ="/start" exact component={Startscreen} />
              <Route path  ="/profile" exact component={Profile} />
            </Switch>
        </div>*/
      );
    }

    //<Route path = "/profile" exact component={Profile} />