import { LOGGED_IN, LOGGED_OUT, FETCHED_COLLECTIONS, COLLECTIONS_UPDATED } from "./actionTypes";

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

/*export function collectionsUpdated(data) {
    return {
        type: COLLECTIONS_UPDATED,
        data
    }
}*/



