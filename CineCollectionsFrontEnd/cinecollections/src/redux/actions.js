import { 
    LOGGED_IN, 
    LOGGED_OUT, 
    FETCHED_COLLECTIONS,
    DISPLAYED_USER, 
    COLLECTIONS_UPDATED, 
    UPDATE_HANDLED,
    ADDED_TO_COLLECTION,
    HANDLED_ADD } from "./actionTypes";

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

export function displayedUser(data) {
    return {
        type: DISPLAYED_USER,
        data
    }
}

export function fetchedCollections(data) {
    return {
        type: FETCHED_COLLECTIONS,
        data
    }
}

export function collectionsUpdated() {
    return {
        type: COLLECTIONS_UPDATED
    }
}

export function handledCollectionUpdate() {
    return {
        type: UPDATE_HANDLED
    }
}

