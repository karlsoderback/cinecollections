import React from "react";

import { browserHistory } from "react-router";
import { connect } from "react-redux";
import { logged_out } from "../redux/actions";

import { sendBackendGET } from "../rest/backendAPI"
import { getFilm, getPoster } from "../rest/movieAPI";

import Search from "./search";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myCollections: [],
            subCollections: [],
            renderMyCollections: [],
            renderSubCollections:[],
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
            
            const fullInfoCollection = await this.generateDetailedFilmList(collection);
            myCollections.push(fullInfoCollection);
            
            const films = this.renderFilms(fullInfoCollection); 
            
            retMyCollections.push(
                <div key={collection.collection_id}>
                <h3>{collection.collection_name}</h3>
                <h4>Films:</h4>
                {films}
            </div>);
        }

        for (let i = 0; i < this.state.subCollections.length; i++) { // Render subscribed collections
            const collection = this.state.subCollections[i];
            
            const fullInfoCollection = await this.generateDetailedFilmList(collection);
            subCollections.push(fullInfoCollection);
            
            const films = this.renderFilms(fullInfoCollection);
            const creator = await this.getCreator(collection.creator);
            
            retSubCollections.push(
                <div key={collection.collection_id}>
                    <h3>{collection.collection_name}</h3>
                    <h4>Creator: {creator}</h4>
                    <h4>Films:</h4>
                    {films}
                </div>);
        }
        
        this.setState({myCollections: myCollections});
        this.setState({subCollections: subCollections});
        
        this.setState({renderMyCollections: retMyCollections});
        this.setState({renderSubCollections: retSubCollections});
    }

    renderFilms(fullInfoCollection) {
        let filmInfo = [];
        for (let i = 0; i < fullInfoCollection.length; i++) {
            let film = fullInfoCollection[i];
            let posterURL = URL.createObjectURL(film.poster);
            filmInfo.push(
                <div key={i}>
                    <img src ={posterURL}></img>
                    <li>{film.Title}</li>
                </div>
            )
        }
        return filmInfo;
    }

    async generateDetailedFilmList(collection) {
        let films = []
        for (let i = 0; i < collection.films.length; i++) {
            let id = collection.films[i];
            let filmInfo = await this.getFilmFullInfo(id);
            filmInfo.poster = await this.getFilmPoster(id)
            films.push(filmInfo);
        }
        return films;
    }

    async getFilmFullInfo(id) {
        return await new Promise(resolve => {
            getFilm(id).then(
                film => {
                    resolve(film);
                }
            )
        });
    }

    async getFilmPoster(id) {
        return await new Promise(resolve => {
            getPoster(id).then(
                poster => {
                    console.log(poster);
                    resolve(poster);
                }
            )
        });
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
                {this.state.test}
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
                <Search />
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

