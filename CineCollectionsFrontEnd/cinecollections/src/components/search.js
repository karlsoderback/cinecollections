import React from "react";
import Parser from "html-react-parser";
import "./css/search.css";
import "./css/general.css";

import { connect } from "react-redux";

import { getFilmByTitle, getFilmPoster } from "../rest/movieAPI";

import { Menu, ClickAwayListener, MenuItem, Fade } from "@material-ui/core";
import { sendAuthorizedBackendPOST, sendBackendGET } from "../rest/backendAPI";
import Button from "./button";

import { collectionsUpdated, displayedUser } from "../redux/actions";

import { browserHistory } from "react-router";

class Search extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            filmInput: "",
            userInput: "",
            filmResult: null,
            userResult: [],
            filmResponse: "",
            posterURL: "",
            menuAnchor: null,
            showAddMenu: false,
            generalResponse: ""
        }

        this.searchFilm = this.searchFilm.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.userClick = this.userClick.bind(this);
        this.handleClickAway = this.handleClickAway.bind(this);
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
            let filmPrint = "<p>" +
                result.Title + "<br>" +
                "Released: " + result.Year + "<br>" +
                "Directed by: " + result.Director + "<br>" +
                "Genre: " + result.Genre + "</p>";
            
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
            this.setState({userResult: []});
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

    handleKeyPress(e, searchType) {
        if (e.key === "Enter") {
            if (searchType === "film") {
                this.searchFilm();
            } else if (searchType === "user") {
                this.searchUser();
            }
        }
    }

    toggleMenu = (event) => {
        if (this.state.showAddMenu) {
            this.handleMenuClose();    
        } else {
            this.setState({showAddMenu: true, menuAnchor: event.currentTarget});
        }
    }
    
    handleMenuClose = () => {
        this.setState({showAddMenu: false});
        this.setState({menuAnchor: null});
    }

    addToCollection = (id) => {
        const body = {
            "collection_id": id,
            "film_id": this.state.filmResult.imdbID
        }
        sendAuthorizedBackendPOST("collection/add?username=" + this.props.loggedInUser, body, this.props.token).then(
            data => {
                this.setState({generalResponse: ("Added " + this.state.filmResult.Title + " to collection!")});
                this.props.dispatch(collectionsUpdated());
            }).catch(error => {
                this.setState({generalResponse: error});
        });
    }

    userClick(user){
        this.setState({userInput: "", userResult: []});
        this.props.dispatch(displayedUser(user.username));
        browserHistory.push("/profile");
    }

    handleClickAway() { // TODO -replace with close?
        this.setState({showAddMenu: false});
    }

    render() {
        let film = (null);
        if (this.state.filmResult != null) {
            film = 
            <div className="filmResult">
                <ClickAwayListener onClickAway={this.handleClickAway}>
                    <Button 
                    aria-controls="addMenu" 
                    aria-haspopup="true" 
                    onClick={this.toggleMenu}
                    >
                        <div className="poster">
                            <img src={this.state.posterURL} height="500"></img>
                        </div>
                        <div className="filmInfo">
                            {Parser(this.state.filmResponse)}
                        </div>
                        {this.state.showAddMenu ? (  
                            <Menu
                                id="addMenu"
                                anchorEl={this.state.menuAnchor}
                                keepMounted
                                open={Boolean(this.state.menuAnchor)}
                                onClose={this.handleMenuClose}
                                TransitionComponent={Fade}
                            >
                            <p>Add to Collection:</p>
                            {this.props.myCollections.map((collection) =>
                                <MenuItem
                                    key={collection.id} 
                                    value={collection.collection_name}
                                    onClick={this.addToCollection.bind(null, collection.id)} 
                                ><p>{collection.collection_name}</p></MenuItem>
                            )}     
                            </Menu>
                        ) : (null)}
                     </Button>
                </ClickAwayListener>             
            </div>
        } 

        return (
            <div className="Search">
                <div className="Searchboxes">
                    <Button onClick={this.searchFilm}>
                        <p className="buttontext">Search Film by Title</p>
                    </Button>
                    <input 
                        type="text" 
                        value={this.state.filmInput} 
                        onChange={e => this.setState({filmInput: e.target.value})} 
                        onKeyUp={e => this.handleKeyPress(e, "film")}
                    />
                    <Button onClick={this.searchUser}>
                        <p className="buttontext">Search Username</p>
                    </Button>    
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
                        onClick={this.userClick.bind(null, user)}
                        >
                            <p>{user.username}</p>
                            </Button>
                        )
                    }
                    <div className="generalResponse">
                        {Parser(this.state.generalResponse)}
                    </div>
                </div>
                <div className="Result">>
                    {film}
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