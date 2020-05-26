import React from "react";
import Parser from "html-react-parser";

import { connect } from "react-redux";

import { getFilmByTitle, getFilmPoster } from "../rest/movieAPI";

import { Button, Menu, MenuList, MenuItem } from "@material-ui/core"

class Search extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            filmInput: "",
            userInput: "",
            filmResult: new Object(),
            userResult: new Object(),
            response: "",
            posterURL: "",
            menuAnchor: null,
            collectionMenu: null
        }

        this.searchFilm = this.searchFilm.bind(this);
        this.getCollectionMenu = this.getCollectionMenu.bind(this);
    }

    async searchFilm () {
        let result = await this.searchFilmTitle(this.state.filmInput);
        if (result.Response === "False") {
            this.setState({response: "No results found"});
            this.setState({posterURL: ""});
        } else {
            this.setState({filmResult: result});
            let posterURL = URL.createObjectURL(await getFilmPoster(result.imdbID));
            this.setState({posterURL: posterURL});
            let filmPrint = 
                "Title: " + result.Title + "<br>" +
                "Released: " + result.Year + "<br>" +
                "Directed by: " + result.Director + "<br>" +
                "Genre: " + result.Genre;
            
            this.setState({response: filmPrint});
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

    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.searchFilm();
        }
    }

    showAddMenu = (event) => {
        this.setState({menuAnchor: event.currentTarget});
    }

    handleMenuClose = () => {
        this.setState({menuAnchor: null});
    }

    getCollectionMenu () {
        let menuItems = [];
        for (var i = 0; i < this.props.myCollections.length; i++) {
            let collection = this.props.myCollections[i];
            menuItems.push(
                <MenuItem key={collection.id} onClick={this.addToCollection(collection.id)}>
                    {collection.name}
                </MenuItem>
            )
        }
        return menuItems;
        //this.setState({collectionMenu: menuItems});
    }

    addToCollection(id) {
        console.log("adding collection: " + id);
        this.handleMenuClose();
    }

    render() {
        return (
            <div className="Search">
                <Button color="primary" onClick={this.searchFilm}>Search Film by Title</Button>
                <input 
                    type="text" 
                    value ={this.state.filmInput} 
                    onChange={e => this.setState({filmInput: e.target.value})} 
                    onKeyUp={this.handleKeyPress.bind(this)}
                />
                <Button aria-controls="addMenu" aria-haspopup="true" onClick={this.showAddMenu}>
                    <img src={this.state.posterURL}></img>
                    {Parser(this.state.response)}
                </Button>
                <Menu
                    id="addMenu"
                    anchorEl={this.state.menuAnchor}
                    keepMounted
                    open={Boolean(this.state.menuAnchor)}
                    onClose={this.handleMenuClose}
                >
                    {this.getCollectionMenu}
                    
                </Menu>
                
            </div>
        );
    }
}
/*<MenuItem onClick={this.getCollectionMenu}>
                        {this.state.collectionMenu}
                    </MenuItem>*/
/*
<div className="filmSearchResult" onClick={this.addMenu}>
                    <img src={this.state.posterURL}></img>
                    <br></br>
                    {Parser(this.state.response)}
                </div>
*/

function mapStateToProps(state) {
    return {
        myCollections: state.collectionState.myCollections
    }
}

export default connect(mapStateToProps)(Search);