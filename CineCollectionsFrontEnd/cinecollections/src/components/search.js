import React from "react";

import { connect } from "react-redux";

import { getFilm } from "../rest/movieAPI";

class Search extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            filmInput: "",
            userInput: ""
        }
    }

    searchFilm () {

    }  

    updateFilmSearchField = (event) => {
        this.setState({filmInput: event.target.value});
    }

    render() {
        return (
            <div>
                <button onClick={this.searchFilm}>Search Film by Title</button>
                <input type="text" value ={this.props.filmInput} onChange={this.searchfilm}/>
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