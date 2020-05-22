import React from "react";

import { browserHistory } from "react-router";
import { connect } from "react-redux";
import { logged_out } from "../redux/actions.js";

import { sendBackendGET } from "../rest/backendAPI.js"
import { getMovie } from "../rest/movieAPI.js";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myCollections: [],
            subCollections: [],
            renderMyCollections: [],
            renderSubCollections:[]
        };

        this.logOut = this.logOut.bind(this);
        this.renderCollections = this.renderCollections.bind(this);
        this.getCreator = this.getCreator.bind(this);
    }
    
    componentDidMount() {
        sendBackendGET("collection/getallforuser?username=" + this.props.username).then(
            data => {
                this.setState({myCollections: data.my_collections});
                this.setState({subCollections: data.subscribed_collections});
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
        let subCollections = [];
        let retMyCollections = [];
        let retSubCollections = [];
        
        
        for (let i = 0; i < this.state.myCollections.length; i++) { // Render my collections
            const collection = this.state.myCollections[i];
            
            const fullInfoCollection = await this.getFilmsFullInfoList(collection);
            myCollections.push(fullInfoCollection);
            
            const filmTitles = this.printFilms(fullInfoCollection); 
            console.log(filmTitles)
            retMyCollections.push(
                <div key={collection.collection_id}>
                <h3>{collection.collection_name}</h3>
                <h4>Films:</h4>
                {filmTitles}
            </div>);
        }

        for (let i = 0; i < this.state.subCollections.length; i++) { // Render subscribed collections
            const collection = this.state.subCollections[i];
            
            const fullInfoCollection = await this.getFilmsFullInfoList(collection);
            subCollections.push(fullInfoCollection);
            
            const filmTitles = this.printFilms(fullInfoCollection);
            const creator = await this.getCreator(collection.creator);
            
            retSubCollections.push(
                <div key={collection.collection_id}>
                    <h3>{collection.collection_name}</h3>
                    <h4>Creator: {creator}</h4>
                    <h4>Films:</h4>
                    {filmTitles}
                </div>);
        }
        
        this.setState({myCollections: myCollections});
        this.setState({subCollections: subCollections});
        
        this.setState({renderMyCollections: retMyCollections});
        this.setState({renderSubCollections: retSubCollections});
    }

    printFilms(fullInfoCollection) {
        let filmInfo = [];
        for (let i = 0; i < fullInfoCollection.length; i++) {
            let film = fullInfoCollection[i];
            filmInfo.push(
                <div key={i}>
                    <li>{film.Title}</li>
                </div>
            )
        }
        return filmInfo;
    }

    async getFilmsFullInfoList(collection) {
        let films = []
        for (let i = 0; i < collection.films.length; i++) {
            films.push(await this.getFilmInfo(collection.films[i]));
        }
        return films;
    }

    async getFilmInfo(id) {
        return await new Promise(resolve => {
            getMovie(id).then(
                film => {
                    resolve(film)
                }
            )
        })
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
                    <div className="subCollections">
                        {this.state.renderSubCollections}
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

