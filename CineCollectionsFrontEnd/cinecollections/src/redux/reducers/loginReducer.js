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
            let loggedInUser = action.data.username;
            let token = action.data.token;

            localStorage.setItem("loggedInUser", loggedInUser);
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("token", token)

            return Object.assign({}, state, {
                loggedIn: true,
                token: token,
                loggedInUser: loggedInUser
            })
        case LOGGED_OUT:
            localStorage.clear();
            return initialState;
        default:
            return state;
    }
}