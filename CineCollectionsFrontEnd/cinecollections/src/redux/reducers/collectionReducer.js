import {
    FETCHED_COLLECTIONS
} from "../actionTypes";

const initialState = {
    myCollections: [],
    subCollections: []
}

export default function updateCollectionState(state = initialState, action) {
    switch (action.type) {
        case FETCHED_COLLECTIONS:
            return Object.assign({}, state, {
                myCollections: action.data.myCollections,
                subCollections: action.data.subCollections
            })
        default:
            return state;
    }
}