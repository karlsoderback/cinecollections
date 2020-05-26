import { LOGGED_IN, LOGGED_OUT, FETCHED_COLLECTIONS } from "./actionTypes";

export function loggedIn(data) {
    return {
        type: LOGGED_IN,
        data
    }
}

export function loggedOut() {
    return {
        type: LOGGED_OUT
    }
}

export function fetchedCollections(data) {
    return {
        type: FETCHED_COLLECTIONS,
        data
    }
}



