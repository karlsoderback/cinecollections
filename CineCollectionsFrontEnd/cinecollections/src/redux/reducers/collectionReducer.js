import {
    FETCHED_COLLECTIONS, COLLECTIONS_UPDATED
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
        /*case COLLECTIONS_UPDATED:
            return Object.assign({}, state, {
                collectionsUpdated: action.data
            })*/
        default:
            return state;
    }
}