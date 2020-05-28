import React from "react";
import Parser from "html-react-parser";

import { connect } from "react-redux";

import { Button, Menu, ClickAwayListener, MenuItem, Fade } from "@material-ui/core"
import Popup from "reactjs-popup";

import { getCreator } from "../rest/backendAPI"


class Collection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            showCollectionMenu: false,
            menuAnchor: null,
            viewCollection: false,
            films: []
        };

        this.renderFilms();

        this.viewCollection = this.viewCollection.bind(this);
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
                </div>
            )
        }
        this.setState({films: films});
    }
    
    viewCollection() {
        this.setState({viewCollection: true});
    }

    deleteCollection() {
        console.log("delete")
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
        return (this.props.loggedInUser === creator);
    }
    
    render () {
        let myCollection = false;
        if(this.isMyCollection()) {
            myCollection = true;    
        }
        let collectionView = (null)
        if (this.state.viewCollection) {
           // TODO - popup
        }

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
                        {myCollection ? (
                            <MenuItem
                                key={"delete"}
                                value={"delete"}
                                onClick={this.deleteCollection}    
                            >
                                Delete
                            </MenuItem>
                        ) : (null)}   
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
        displayUser: state.loginState.displayedUser
    }
}
    
export default connect(mapStateToProps)(Collection);

