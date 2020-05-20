import { LOGGED_IN } from "./actionTypes.js";

let loggedIn = false;
let token = "";
let username ="";

export function logged_in(data) {
    return {
        type: LOGGED_IN,
        data
    }
}