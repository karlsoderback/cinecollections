import React from "react";
import "./css/profile.css";
import "./css/general.css";
import { browserHistory } from "react-router";
import { connect } from "react-redux";

import { 
    loggedIn, 
    loggedOut, 
    fetchedCollections,
    displayedUser, 
    handledCollectionUpdate 
} from "../redux/actions";

import { sendBackendGET, getCreator } from "../rest/backendAPI"
import { getFilmById, getFilmPoster } from "../rest/movieAPI";

import Search from "./search";
import CreateCollection from "./createCollection";
import Collection from "./collection";

import Button from "./button";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            simpleMyCollections: [],
            simpleSubCollections: [],
            renderMyCollections: [],
            renderSubCollections:[],
            displayUser: ""
        };
        
        this.logOut = this.logOut.bind(this);
        this.renderCollections = this.renderCollections.bind(this);
        this.refreshCollections = this.refreshCollections.bind(this);
    }
    
    componentDidMount() {
        let loggedInUser = this.props.loggedInUser;
        let displayUser = this.props.displayUser;
        
        if (loggedInUser === "" && localStorage.getItem("loggedIn")) {
            loggedInUser = localStorage.getItem("loggedInUser");
            let loginData = {username: loggedInUser, token: localStorage.getItem("token")};
            this.props.dispatch(loggedIn(loginData))
        }

        if (displayUser === "") {
            displayUser = loggedInUser;
            this.props.dispatch(displayedUser(displayUser))
        }
        this.refreshCollections(displayUser);
    }

    refreshCollections(user) {
        sendBackendGET("collection/getallforuser?username=" + user).then(
            data => {
                this.setState({simpleMyCollections: data.my_collections});
                this.setState({simpleSubCollections: data.subscribed_collections});  
                this.renderCollections();
            }
        )
    }

    logOut() {
        this.props.dispatch(loggedOut());
        browserHistory.push("/");
    }
    home(){
        browserHistory.push("/");
    }

    async renderCollections(){   
        let detailedMyCollections = [];
        let detailedSubCollections = [];
        let retMyCollections = [];
        let retSubCollections = [];
 
        for (let i = 0; i < this.state.simpleMyCollections.length; i++) { // Render my collections
            const collection = this.state.simpleMyCollections[i];
            const fullInfoCollection = await this.generateDetailedFilmList(collection);
   
            detailedMyCollections.push(fullInfoCollection);  
            retMyCollections.push(
                <div key={collection.collection_id}>
                    <Collection data={fullInfoCollection}/>
                </div>
            );
        }

        for (let i = 0; i < this.state.simpleSubCollections.length; i++) { // Render subscribed collections
            const collection = this.state.simpleSubCollections[i];
            
            const fullInfoCollection = await this.generateDetailedFilmList(collection);
            detailedSubCollections.push(fullInfoCollection);
            const creator = await getCreator(collection.creator);
    
            retSubCollections.push(
                <div key={collection.collection_id}>
                    <Collection data={fullInfoCollection}/>
                    Creator: {creator}
                </div>);
        }
        
        this.setState({renderMyCollections: retMyCollections});
        this.setState({renderSubCollections: retSubCollections});

        this.props.dispatch(fetchedCollections({myCollections: detailedMyCollections, subCollections: detailedSubCollections}));
    }

    async generateDetailedFilmList(collection) {
        let films = []
        let detailedCollection = new Object();
        detailedCollection.id = collection.collection_id;
        detailedCollection.collection_name = collection.collection_name;
        detailedCollection.creator = collection.creator;
        if (collection.films.length != 0) {
            for (let i = 0; i < collection.films.length; i++) {
                let id = collection.films[i];
                let filmInfo = await this.getFilmFullInfo(id);
                if (filmInfo.Response === "False") {
                    console.log(filmInfo.Error);
                } else {
                    filmInfo.poster = await getFilmPoster(id)
                    films.push(filmInfo);
                }
            }
        }
        detailedCollection.films = films;
        return detailedCollection;
    }

    async getFilmFullInfo(id) {
        return await new Promise(resolve => {
            getFilmById(id).then(
                film => {
                    resolve(film);
                }
            )
        });
    }

    render() {
        if (this.props.displayUser != this.state.displayUser) {
            this.refreshCollections(this.props.displayUser);
            this.setState({displayUser: this.props.displayUser});
        }
        if (this.props.collectionsUpdated) {
            this.refreshCollections(this.props.displayUser);
            this.props.dispatch(handledCollectionUpdate());
        }

        return (
            <div className="Profile">
                <div className="ProfileInfoWrapper">
                    <div className="ProfileHeader">
                        <h1 class="profileName">{this.props.displayUser}</h1>
                        <Button onClick={this.logOut}><p class="buttontext">Log out</p></Button>
                        <Button onClick={this.home}><p class="buttontext">Home</p></Button>
                        <CreateCollection />
                    </div>
                    <div className="collections">
                        <h2 class="collectionHeader">My Collections</h2>
                        <div className="myCollections">
                            {this.state.renderMyCollections}
                        </div>
                        <h2 class="collectionHeader">Subscribed Collections</h2>
                        <div className="subCollections">
                            {this.state.renderSubCollections}
                        </div>
                    </div>
                </div>              
                <div className="SearchWrapper">
                    <Search />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loggedInUser: state.loginState.loggedInUser,
        displayUser: state.loginState.displayedUser,
        
        collectionsUpdated: state.collectionState.collectionsUpdated
    }
}

export default connect(mapStateToProps)(Profile);

