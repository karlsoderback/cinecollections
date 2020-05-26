import {
    LOGGED_IN,
    LOGGED_OUT
} from "../actionTypes";

const initialState = {
    loggedIn: false,
    token: "",
    loggedInUser: ""
}

export default function updateLoginState(state = initialState, action) {
    switch (action.type) {
        case LOGGED_IN:
            return Object.assign({}, state, {
                loggedIn: true,
                token: action.data.token,
                loggedInUser: action.data.username
            })
        case LOGGED_OUT:
            return initialState;
        default:
            return state;
    }
}