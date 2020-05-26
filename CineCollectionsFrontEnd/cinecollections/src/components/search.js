import React from "react";
import Parser from "html-react-parser";

import { connect } from "react-redux";

import { getFilmByTitle } from "../rest/movieAPI";

class Search extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            filmInput: "",
            userInput: "",
            filmResult: "",
            userResult: "",
            response: ""
        }

        this.searchFilm = this.searchFilm.bind(this);
    }

    async searchFilm () {
        let result = await this.searchFilmTitle(this.state.filmInput);
        if (result.Response === "False") {
            this.setState({response: "No results found"});
        } else {
            this.setState({response: ""});
            let filmPrint = 
                "Title: " + result.Title + "<br>" +
                "Released: " + result.Year + "<br>" +
                "Directed by: " + result.Director + "<br>" +
                "Genre: " + result.Genre;
            
            this.setState({filmResult: filmPrint});
            console.log(this.state.filmResult)
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

    render() {
        return (
            <div className="Search">
                <button onClick={this.searchFilm}>Search Film by Title</button>
                <input 
                    type="text" 
                    value ={this.state.filmInput} 
                    onChange={e => this.setState({filmInput: e.target.value})} 
                    onKeyUp={this.handleKeyPress.bind(this)}
                />
                <div className="filmSearchResult">
                    {Parser(this.state.filmResult)}
                    {Parser(this.state.response)}
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

export default connect(mapStateToProps)(Search);