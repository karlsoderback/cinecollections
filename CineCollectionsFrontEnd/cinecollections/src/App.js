import React, {Component} from "react";
import { sendGET, sendPost } from "./rest/rest.js";

export default function App(props){
     /* componentDidMount() {
        fetch('http://localhost:7000/collection/getallforuser?username=slimshady')
        .then(res => res.json())
        .then((data) => {
          this.setState({ collections: data })
        })
        .catch(console.log)
      } */
      
      function click() {
        sendGET("http://127.0.0.1:7000/").then( // collection/getallforuser?username=slimshady
          data => this.setState({data}));
      }

      return (
        <button onClick={click}>CLICK</button>
      );
    }