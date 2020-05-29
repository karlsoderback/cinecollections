import React from "react";
import Parser from "html-react-parser";

import "./css/general.css";

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
            isMyCollection: false
        };

        this.viewCollection = this.viewCollection.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.deleteCollection = this.deleteCollection.bind(this);
        this.subscribeToCollection = this.subscribeToCollection.bind(this);
        this.authorizedCollectionRequest = this.authorizedCollectionRequest.bind(this);
    }

    componentDidMount() {
        this.renderFilms();
        this.isMyCollection()
    }

    renderFilms() {
        let films = [];
        for (let i = 0; i < this.state.data.films.length; i++) {
            let film = this.state.data.films[i];
            let posterURL = URL.createObjectURL(film.poster);

            films.push(
                <div key={i}>
                    <img src ={posterURL}></img>
                    <li>{film.Title}</li>
                    <li>{film.Year}</li>
                </div>
            )
        }
        this.setState({films: films});
    }
    
    viewCollection() {
        this.setState({viewCollection: true});
        console.log(this.state.films)
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
                open={this.state.viewCollection}
                position="right center"
                closeOnEscape
                onClose={this.closePopup}    
            >
                <div>
                    {this.state.films}
                </div>
            </Popup>

        return (
        <div className="Collection">
            <ClickAwayListener onClickAway={this.handleMenuClose}>
                <Button aria-controls="collectionMenu" 
                aria-haspopup="true" 
                onClick={this.toggleMenu}
                >
                    {Parser(this.state.data.collection_name)}
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
                         View
                        </MenuItem> 
                        {this.state.isMyCollection ? (
                            <MenuItem
                                key={"delete"}
                                value={"delete"}
                                onClick={this.deleteCollection}    
                            >
                            Delete
                            </MenuItem>
                        ) : (
                            <MenuItem
                                key={"subscribe"}
                                value={"subscribe"}
                                onClick={this.subscribeToCollection}    
                            >
                            Subscribe
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

