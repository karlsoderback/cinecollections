import { LOGGED_IN, LOGGED_OUT } from "./actionTypes.js";

export function logged_in(data) {
    return {
        type: LOGGED_IN,
        data
    }
}

export function logged_out() {
    return {
        type: LOGGED_OUT
    }
}

