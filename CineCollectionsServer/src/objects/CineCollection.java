package objects;

import java.util.ArrayList;

public class CineCollection {
    private final int _collectionId;
    private final int _creator;
    private final String _collectionName;
    private final ArrayList<String> _films;
    private Integer[] _subscribers;

    public CineCollection(int collectionId, int creator, String collectionName, ArrayList<String> films) {
        this._collectionId = collectionId;
        this._creator = creator;
        this._collectionName = collectionName;
        this._films = films;
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

        String subscribers = "Subscribers: ";
        for (Integer subscriber : _subscribers) {
            subscribers += subscriber + ", ";
        }
        System.out.println(subscribers);
    }
}
