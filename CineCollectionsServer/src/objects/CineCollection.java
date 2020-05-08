package objects;

import java.util.ArrayList;

public class CineCollection {
    private final int _collectionId;
    private final int _creator;
    private final String _collectionName;
    private final ArrayList<String> _films;
    private final Integer[] _subscribers;

    public CineCollection(int collectionId, int creator, String collectionName, ArrayList<String> films) {
        this._collectionId = collectionId;
        this._creator = creator;
        this._collectionName = collectionName;
        this._films = films;
        this._subscribers = new Integer[0];
    }

    public CineCollection(int collectionId, int creator, String collectionName, ArrayList<String> films, Integer[] subscribers) {
        this._collectionId = collectionId;
        this._creator = creator;
        this._collectionName = collectionName;
        this._films = films;
        this._subscribers = subscribers;
    }

    public void print() {
        System.out.println("CollectionId: " + _collectionId);
        System.out.println("Creator: " + _creator);
        System.out.println("CollectionName: " + _collectionName);
        System.out.println("Films: " + _films);

        StringBuilder subscribers = new StringBuilder("Subscribers: ");
        for (Integer subscriber : _subscribers) {
            subscribers.append(subscriber).append(", ");
        }
        System.out.println(subscribers);
    }

    public String serialize() {
        StringBuilder serialized = new StringBuilder();
        serialized.append("     {\n")
                .append("       \"collection_id\":\"").append(_collectionId).append("\"\n")
                .append("       \"creator\":\"").append(_creator).append("\"\n")
                .append("       \"collection_name\":\"").append(_collectionName).append("\"\n")
                .append("       \"films\": [ ");

        for (String film : _films) {
            if (_films.indexOf(film) != _films.size() - 1) {
                serialized.append("\"").append(film).append("\", ");
            } else {
                serialized.append("\"").append(film).append("\" ],\n");
            }
        }
        serialized.append("       \"subscribers\": [ ");
        if (_subscribers.length > 0) {
            for (int i = 0; i < _subscribers.length; i++) {
                Integer subscriber = _subscribers[i];
                if (i != _subscribers.length - 1) {
                    serialized.append("\"").append(subscriber).append("\", ");
                } else {
                    serialized.append("\"").append(subscriber).append("\" ]\n");
                }
            }
        } else {
            serialized.append("]\n");
        }
        serialized.append("     }");

        //System.out.println(serialized.toString());
        return serialized.toString();
    }
}
