import React from "react";
import Parser from "html-react-parser";

import "./css/general.css";
import "./css/collection.css";

import { connect } from "react-redux";

import { Menu, ClickAwayListener, MenuItem, Fade } from "@material-ui/core"
import Popup from "reactjs-popup";
import Button from "./button";

import { getCreator, sendAuthorizedBackendGET } from "../rest/backendAPI"

import { collectionsUpdated } from "../redux/actions"

class Collection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            showCollectionMenu: false,
            menuAnchor: null,
            viewCollection: false,
            films: [],
            isMyCollection: false,
            displayPoster: "",
            updated: false
        };

        this.viewCollection = this.viewCollection.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.deleteCollection = this.deleteCollection.bind(this);
        this.subscribeToCollection = this.subscribeToCollection.bind(this);
        this.authorizedCollectionRequest = this.authorizedCollectionRequest.bind(this);
    }

    componentDidMount() {
        this.renderFilms(this.state.data);
        this.isMyCollection();
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.renderFilms(this.props.data);
        }
    }

    renderFilms(data) {
        let films = [];
        for (let i = 0; i < data.films.length; i++) {
            let film = data.films[i];
            let posterURL = URL.createObjectURL(film.poster);
            if (i === 0)  {
                this.setState({displayPoster: posterURL});
            }   
            films.push(
                <div key={i} className="filmBox">
                    <div className="viewPoster">
                        <img src={posterURL} height="200" />
                    </div>
                    <center>{film.Title}</center>
                    <center>{film.Year}</center>
                </div>
            )
        }
        this.setState({films: films});
    }
    
    /*
<p className="filmInfo">
    */
    viewCollection() {
        this.setState({viewCollection: true});
    }

    async deleteCollection() {
        let result = await this.authorizedCollectionRequest("delete", this.state.data.id);
        if (result) {
            this.props.dispatch(collectionsUpdated());
        }
    }

    async subscribeToCollection() {
        let result = await this.authorizedCollectionRequest("subscribe", this.state.data.id);
        if (result) {
            this.props.dispatch(collectionsUpdated());
        }
    }
    
    async authorizedCollectionRequest(endpoint, collectionId) {
        return await new Promise(resolve => {
            sendAuthorizedBackendGET("collection/" + endpoint + "?username=" + this.props.loggedInUser + "&collectionId=" + collectionId, this.props.token).then(
                result => {
                    resolve(result);
                }
            );
        });
    }

    toggleMenu = (event) => {
        if (this.state.showCollectionMenu) {
            this.handleMenuClose();    
        } else {
            this.setState({showCollectionMenu: true, menuAnchor: event.currentTarget});
        }
    }

    handleMenuClose = () => {
        this.setState({showCollectionMenu: false});
        this.setState({menuAnchor: null});
    }

    async isMyCollection() {
        const creator = await getCreator(this.state.data.creator);
        if (this.props.loggedInUser === creator) {
            this.setState({isMyCollection: true})
        }
    }
    
    closePopup() {
        this.setState({viewCollection: false});
    }

    render () {
        let collectionView =
            <Popup 
                className="viewPopup"
                open={this.state.viewCollection}
                position="right center"
                closeOnEscape
                onClose={this.closePopup}    
            >
                <div className="filmPopup">
                    <div className="header">
                        <p className="collectionText">{this.state.data.collection_name}</p>
                    </div>
                    <div className="content">
                        {this.state.films}
                    </div>
                </div>
            </Popup>

        return (
            <div className="Collection">
                <ClickAwayListener onClickAway={this.handleMenuClose}>
                    <Button aria-controls="collectionMenu" 
                    aria-haspopup="true" 
                    onClick={this.toggleMenu}
                    >
                        <img className="displayPoster" src={this.state.displayPoster} height="300"/>
                        <div className="posterText">
                            <p className="collectionText">
                                {Parser(this.state.data.collection_name)}
                            </p>
                        </div>
                        {this.state.showCollectionMenu ? (  
                            <Menu
                                id="collectionMenu"
                                anchorEl={this.state.menuAnchor}
                                keepMounted
                                open={Boolean(this.state.menuAnchor)}
                                onClose={this.handleMenuClose}
                                TransitionComponent={Fade}
                            > 
                            <MenuItem
                                key={"view"}
                                value={"view"}
                                onClick={this.viewCollection}
                            >
                            <p>View</p>
                            </MenuItem> 
                            {this.state.isMyCollection ? (
                                <MenuItem
                                    key={"delete"}
                                    value={"delete"}
                                    onClick={this.deleteCollection}    
                                >
                                <p>Delete</p>
                                </MenuItem>
                            ) : (
                                <MenuItem
                                    key={"subscribe"}
                                    value={"subscribe"}
                                    onClick={this.subscribeToCollection}    
                                >
                                <p>Subscribe</p>
                                </MenuItem>
                            )}   
                            </Menu>
                        ) : (null)}
                    </Button>
                </ClickAwayListener>
                {collectionView}    
            </div>);
    }
} 



function mapStateToProps(state) {
    return {
        loggedInUser: state.loginState.loggedInUser,
        displayUser: state.loginState.displayedUser,
        token: state.loginState.token
    }
}
    
export default connect(mapStateToProps)(Collection);

