import React, {Component} from "react";
//import Collections from './components/collections';
//import { useGet } from "restful-react";

    class App extends Component {

      /*
      state = {
        collections: null
      }

      */
     /* componentDidMount() {
        fetch('http://localhost:7000/collection/getallforuser?username=slimshady')
        .then(res => res.json())
        .then((data) => {
          this.setState({ collections: data })
        })
        .catch(console.log)
      } */
      render () {
        return (
          "Hello World"
          //this.state.collections
            //<Collections collections={this.state.collections} />
          );
      }
    }

    export default App;