import {
    FETCHED_COLLECTIONS, COLLECTIONS_UPDATED, UPDATE_HANDLED
} from "../actionTypes";

const initialState = {
    myCollections: [],
    subCollections: [],
    collectionsUpdated: false
}

export default function updateCollectionState(state = initialState, action) {
    switch (action.type) {
        case FETCHED_COLLECTIONS:
            return Object.assign({}, state, {
                myCollections: action.data.myCollections,
                subCollections: action.data.subCollections
            })
        case COLLECTIONS_UPDATED:
            return Object.assign({}, state, {
                collectionsUpdated: true
            })
        case UPDATE_HANDLED:
            return Object.assign({}, state, {
                collectionsUpdated: false
            })
        default:
            return state;
    }
}