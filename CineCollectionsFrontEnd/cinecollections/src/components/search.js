import React from "react";
import Parser from "html-react-parser";

import { connect } from "react-redux";

import { getFilmByTitle, getFilmPoster } from "../rest/movieAPI";

import { Button, Menu, MenuList, MenuItem, Fade } from "@material-ui/core"
import { sendAuthorizedBackendPOST, sendBackendGET } from "../rest/backendAPI";

import { collectionsUpdated, displayedUser } from "../redux/actions";

import { browserHistory } from "react-router";

class Search extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            filmInput: "",
            userInput: "",
            filmResult: new Object(),
            userResult: [],
            filmResponse: "",
            posterURL: "",
            menuAnchor: null,
            generalResponse: ""
        }

        this.searchFilm = this.searchFilm.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.userClick = this.userClick.bind(this);
    }

    async searchFilm () {
        let result = await this.searchFilmTitle(this.state.filmInput);
        if (result.Response === "False") {
            this.setState({generalResponse: "No results found"});
            this.setState({posterURL: ""});
            this.setState({filmResult: null});
            this.setState({filmResponse: ""});
        } else {
            this.setState({filmResult: result});
            let posterURL = URL.createObjectURL(await getFilmPoster(result.imdbID));
            this.setState({posterURL: posterURL});
            let filmPrint = 
                result.Title + "<br>" +
                "Released: " + result.Year + "<br>" +
                "Directed by: " + result.Director + "<br>" +
                "Genre: " + result.Genre;
            
            this.setState({filmResponse: filmPrint});
        }
    }  

    async searchFilmTitle(title) {
        return await new Promise(resolve => {
            getFilmByTitle(title).then(
                film => {
                    resolve(film);
                }
            )
        });
    }

    async searchUser(){
        let result = await this.getUsers();
        let matches = [];
        let users = result.users;
        for (var i = 0; i < users.length; i++) {
            let user = users[i];
            if (user.username === this.state.userInput) {
                matches.push(user);
            }
        }
        if (matches.length > 0) {
            this.setState({generalResponse: ""})
            this.setState({userResult: matches})
        } else {
            this.setState({generalResponse: "No matches found"})
        }
    }

    async getUsers() {
        return await new Promise(resolve => {
            sendBackendGET("user/getall").then(
                users => {
                    resolve(users);
                }
            )
        })
    }

    handleKeyPress(e, searchType) { // TODO - handle when enter is pressed for other search
        if (e.key === "Enter") {
            if (searchType === "film") {
                this.searchFilm();
            } else if (searchType === "user") {
                this.searchUser();
            }
        }
    }

    showAddMenu = (event) => {
        this.setState({menuAnchor: event.currentTarget});
    }

    handleMenuClose = (id) => {
        if (id) {
            this.addToCollection(id);
        }
        this.setState({menuAnchor: null});
    }

    addToCollection(id) {
        const body = {
            "collection_id": id,
            "film_id": this.state.filmResult.imdbID
        }
        sendAuthorizedBackendPOST("collection/add?username=" + this.props.loggedInUser, body, this.props.token).then(
            data => {
                this.setState({generalResponse: ("Added " + this.state.filmResult.Title + " to collection!")});
                //this.props.dispatch(collectionsUpdated(true));
            }).catch(error => {
                this.setState({generalResponse: error});
        });
    }

    userClick(user){
        this.props.dispatch(displayedUser(user.username));
        browserHistory.push("/profile");
    }

    //TODO - only render search button after displaying results
    render() {
        return (
            <div className="Search">
                <Button color="primary" onClick={this.searchFilm}>Search Film by Title</Button>
                <input 
                    type="text" 
                    value={this.state.filmInput} 
                    onChange={e => this.setState({filmInput: e.target.value})} 
                    onKeyUp={e => this.handleKeyPress(e, "film")}
                />
                <Button aria-controls="addMenu" aria-haspopup="true" onClick={this.showAddMenu}>
                    <img src={this.state.posterURL}></img>
                    {Parser(this.state.filmResponse)}
                </Button>
                <Menu
                    id="addMenu"
                    anchorEl={this.state.menuAnchor}
                    keepMounted
                    open={Boolean(this.state.menuAnchor)}
                    onClose={this.handleMenuClose}
                    TransitionComponent={Fade}
                >
                    Add to Collection:
                    {this.props.myCollections.map((collection) =>
                        <MenuItem
                            key={collection.id} 
                            value={collection.name}
                            onClick={this.handleMenuClose.bind(null, collection.id)} 
                        >{collection.name}</MenuItem>
                    )}     
                </Menu>
                <Button color="primary" onClick={this.searchUser}>Search Username</Button>
                <input
                    type="text"
                    vazlue={this.state.userInput}
                    onChange={e => this.setState({userInput: e.target.value})}
                    onKeyUp={e => this.handleKeyPress(e, "user")}
                />
                {
                    this.state.userResult.map((user) => 
                        <Button
                            key={user.id}
                            color="primary"
                            onClick={this.userClick.bind(null, user)}
                        >
                        {user.username}
                        </Button>
                    )
                }
                <div className="generalResponse">
                    {Parser(this.state.generalResponse)}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        myCollections: state.collectionState.myCollections,
        loggedInUser: state.loginState.loggedInUser,
        token: state.loginState.token
    }
}

export default connect(mapStateToProps)(Search);