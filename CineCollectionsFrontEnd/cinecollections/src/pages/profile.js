import React from "react";

import { browserHistory } from "react-router";
import { connect, ReactReduxContext } from "react-redux";
import { logged_out } from "../redux/actions.js";

import { sendBackendGET } from "../rest/backendAPI.js"

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myCollections: [],
            subscribedCollections: [],
            renderMyCollections: [],
            renderSubscribedCollections:[]
        };

        this.logOut = this.logOut.bind(this);
        this.renderCollections = this.renderCollections.bind(this);
        this.getCreator = this.getCreator.bind(this);
    }
    
    componentDidMount() {
        sendBackendGET("collection/getallforuser?username=" + this.props.username).then(
            data => {
                this.setState({myCollections: data.my_collections});
                this.setState({subscribedCollections: data.subscribed_collections});
                console.log("My collections: "); // TODO - remove debug logging
                console.log(this.state.myCollections);
                console.log("Subcribed collections: ");
                console.log(this.state.subscribedCollections);
                this.renderCollections();
            }
        )
    }

    logOut() {
        this.props.dispatch(logged_out());
        browserHistory.push("/");
    }
    home(){
        browserHistory.push("/");
    }

    async renderCollections(){    
        let myCollections = [];
        let subscribedCollections = [];
        
        for (let i = 0; i < this.state.myCollections.length; i++) { // Render my collections
            const collection = this.state.myCollections[i];
            const films = this.prettyPrintFilms(collection); 

            myCollections.push(
            <div key={collection.collection_id}>
                <h3>{collection.collection_name}</h3>
                <h4>Films:</h4>
                {films}
            </div>);
        }
        for (let i = 0; i < this.state.subscribedCollections.length; i++) { // Render subscribed collections
            const collection = this.state.subscribedCollections[i];
            const films = this.prettyPrintFilms(collection);
            const creator = await this.getCreator(collection.creator);
            
            subscribedCollections.push(
                <div key={collection.collection_id}>
                    <h3>{collection.collection_name}</h3>
                    <h4>Creator: {creator}</h4>
                    <h4>Films:</h4>
                    {films}
                </div>);
        }
        console.log("SETSTATE")
        this.setState({renderSubscribedCollections: subscribedCollections});
        this.setState({renderMyCollections: myCollections});
    }

    prettyPrintFilms(collection) {
        return collection.films.map((film) =>
            <div key={film}>
                <li>{film}</li>
            </div>
        );
    }

    async getCreator(userid) {
        return await new Promise(resolve => {
            sendBackendGET("user/get?userid=" + userid).then(
                creator => {
                    resolve(creator);
                }
            )
        }); 
    }
    
    render() {
        return (
            <div className="profile">
                <h1>{this.props.username}</h1>
                <button onClick={this.logOut}>Log out</button>
                <button onClick={this.home}>Home</button>
                <div className="collections">
                    <h2>My Collections</h2>
                    <div className="myCollections">
                        {this.state.renderMyCollections}
                    </div>
                    <h2>Subcribed Collections</h2>
                    <div className="subscribedCollections">
                        {this.state.renderSubscribedCollections}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        username: state.loginState.username,
    }
}

export default connect(mapStateToProps)(Profile);

