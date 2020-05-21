class collection {
    constructor(collection) {
        const id = collection.id;
        const creator = collection.creator;
        const name = collection.collection_name;
        const films = [...collection.films];
        const subscribers = [...collection.subscribers];
    }
}

export default collection;