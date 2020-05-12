import React, {Component} from "react";
import { sendGET, sendPost } from "./rest/rest.js";
import Login from "./components/login.js";

export default function App(props){

     /* componentDidMount() {
        fetch('http://localhost:7000/collection/getallforuser?username=slimshady')
        .then(res => res.json())
        .then((data) => {
          this.setState({ collections: data })
        })
        .catch(console.log)
      } */
      
      /*function click() {
        sendGET("/collection/getallforuser?username=slimshady").then(
          data => this.setState({data}));
      }

      return (
        <div className="Login">

        </div>
        <button onClick={click}>CLICK</button>
      );*/
      return (
        <Login />
      );
    }