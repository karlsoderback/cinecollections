package database;

import exception.DbException;
import objects.CineCollection;
import objects.User;
import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Properties;

public class DbManager {
    private Connection _serverConnection;
    private Connection _dbConnection;
    Properties _dbCredentials = new Properties();

    public DbManager() {
        _dbCredentials.setProperty("user", "postgres");
        _dbCredentials.setProperty("password", "admin");
        _dbCredentials.setProperty("protocolVersion", "3");
    }

    private Connection initConnection(String suffix) throws SQLException {
        Connection connection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/" + suffix, _dbCredentials);
        connection.setAutoCommit(true);
        return connection;
    }

    private void executeUpdate(String sql, Connection connection) throws DbException {
        try {
            connection.createStatement().executeUpdate(sql);
        } catch (SQLException e) {
            throw new DbException("Failed to execute update: " + e.getMessage(), e);
        }
    }

    private ResultSet executeQuery(String sql, Connection connection) throws DbException {
        try {
            return connection.createStatement().executeQuery(sql);
        } catch (SQLException e) {
            throw new DbException("Failed to execute query: " + e.getMessage(), e);
        }
    }

    public void connect() throws DbException { // TODO - Make connection url configurable
        try {
            _serverConnection = initConnection("");
            System.out.println("Connected to SQL Server at localhost:5432");
            initializeDatabase();
        } catch (SQLException e) {
            throw new DbException("Failed to connect to database: " + e.getMessage(), e);
        }
    }

    private void initializeDatabase() throws DbException, SQLException {
        if (!dbExists("cinecollectionsdb")) {
            System.out.println("Initializing CineCollections Database");
            executeUpdate("CREATE DATABASE cinecollectionsdb;", _serverConnection);
        }

        _dbConnection = initConnection("cinecollectionsdb");
        executeUpdate("CREATE TABLE IF NOT EXISTS users(" +
                "id SERIAL PRIMARY KEY," +
                "username VARCHAR (256) UNIQUE," +
                "password VARCHAR (256)," +
                "token VARCHAR (256));", _dbConnection); // TODO - Hash passwords
        executeUpdate("CREATE TABLE IF NOT EXISTS collections(" +
                "collection_id SERIAL PRIMARY KEY," +
                "creator INTEGER REFERENCES users(id)," +
                "collection_name VARCHAR (256)," +
                "films TEXT []," + // use titles or imdbIds
                "subscribers INTEGER []);", _dbConnection); // userids

        System.out.println("Database Initialized");
    }

    private boolean dbExists(String dbname) throws DbException {
        try {
            Statement statement = _serverConnection.createStatement();
            String sql = "SELECT EXISTS (SELECT datname FROM pg_catalog.pg_database WHERE datname = '" + dbname + "');";
            ResultSet resultSet = statement.executeQuery(sql);
            if (resultSet.next()) {
                return resultSet.getBoolean(1);
            } else {
                return false;
            }
        } catch (SQLException e) {
            throw new DbException("Failed to check if database \"" + dbname + "\" exists: " + e.getMessage());
        }
    }

    public void disconnect() throws DbException {
        try {
            _dbConnection.close();
            _serverConnection.close();
        } catch (SQLException e) {
            throw new DbException("Failed to disconnect from database: " + e.getMessage(), e);
        }
    }

    public boolean createNewUser(String username, String password) throws DbException {
        if (userExists(username)) {
            return false;
        }
        executeUpdate("INSERT INTO users(username, password) VALUES (\'" + username + "\', \'" + password + "\');", _dbConnection);
        System.out.println("User \"" + username + "\" added to database");
        return true;
    }

    private boolean userExists(String username) throws DbException {
        ResultSet rs = executeQuery("SELECT EXISTS(SELECT 1 FROM users WHERE username = \'" + username + "\');", _dbConnection);
        try {
            if (rs.next()) {
                return rs.getBoolean(1);
            } else {
                return false;
            }
        } catch (SQLException e) {
            throw new DbException("Failed to check if user exists: " + e.getMessage(), e);
        }
    }

    public String getUser(String id) throws DbException {
        ResultSet rs = executeQuery("SELECT username FROM users WHERE id = \'" + id + "\';", _dbConnection);
        try {
            if (rs.next()) {
                return rs.getString(1);
            } else {
                throw new DbException("Could not find user with id: " + id);
            }
        } catch (SQLException e) {
            throw new DbException("Failed to lookup user: " + e.getMessage(), e);
        }
    }

    public boolean credentialsValid(String username, String password) throws DbException {
        if (userExists(username)) {
            ResultSet rs = executeQuery("SELECT * FROM users WHERE username = \'" + username + "\';", _dbConnection); //Select pw only?
            try {
                if (rs.next()) {
                    if (!rs.getString(3).equals(password)) {
                        return false;
                    }
                }
                rs.close();
                return true;
            } catch (SQLException e) {
                throw new DbException(e.getMessage(), e);
            }
        } else {
            return false;
        }
    }

    public void setToken(String username, String token) throws DbException {
        if (userExists(username)) {
            executeUpdate("UPDATE users SET token = \'" + token + "\' WHERE username = \'" + username + "\';", _dbConnection);
        }
    }

    public boolean isTokenValid(String username, String token) throws DbException {
        if (userExists(username)) {
            ResultSet rs = executeQuery("SELECT token from users WHERE username = \'" + username + "\';", _dbConnection);
            try {
                if (rs.next()) {
                    if (!rs.getString(1).equals(token)) {
                        return false;
                    }
                    rs.close();
                    return true;
                }
            } catch (SQLException e) {
                throw new DbException(e.getMessage(), e);
            }
        }
        return false;
    }

    public int createCollection(JSONObject collection, String creator) throws DbException {  // TODO - Maybe delete, deprecated method
        int creatorId = getUserId(creator);
        String collectionName = collection.getString("collection_name");
        JSONArray filmsJSON = collection.getJSONArray("films");
        String[] films = new String[filmsJSON.length()];
        for (int i = 0; i < filmsJSON.length(); i++) {
            films[i] = String.valueOf(filmsJSON.get(i));
        }

        String sql = "INSERT INTO collections(creator, collection_name, films) VALUES (?, ?, ?) RETURNING collection_id";
        try {
            PreparedStatement pstmt = _dbConnection.prepareStatement(sql);
            pstmt.setInt(1, creatorId);
            pstmt.setString(2, collectionName);
            pstmt.setArray(3, _dbConnection.createArrayOf("text", films));
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            throw new DbException(e.getMessage(), e);
        }
        return -1;
    }

    public int createCollection(String collectionName, String creator) throws DbException {
        int creatorId = getUserId(creator);
        String sql = "INSERT INTO collections(creator, collection_name) VALUES (?, ?) RETURNING collection_id";

        try {
            PreparedStatement pstmt = _dbConnection.prepareStatement(sql);
            pstmt.setInt(1, creatorId);
            pstmt.setString(2, collectionName);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            throw new DbException(e.getMessage(), e);
        }
        return -1;
    }

    public boolean addToCollection(String collectionId, String filmId, String username) throws DbException {
        if (userExists(username)) {
            int userId = getUserId(username);
            if (getCollectionCreator(collectionId) == userId) {
                try {
                    ResultSet rs = executeQuery("SELECT films FROM collections WHERE collection_id = \'" + collectionId + "\'", _dbConnection);
                    String[] films = new String[1];
                    if (rs.next()) {
                        Array arr = rs.getArray(1);
                        if (arr != null) {
                            String[] tmp = (String[]) arr.getArray();
                            films = new String[tmp.length + 1];
                            for (int i = 0; i < tmp.length; i++) {
                                films[i] = tmp[i];
                            }
                            films[films.length - 1] = filmId;
                        } else {
                            films[0] = filmId;
                        }
                    }
                    String sql = "UPDATE collections SET films = (?) WHERE collection_id = \'" + collectionId + "\';";
                    PreparedStatement pstmt = _dbConnection.prepareStatement(sql);
                    pstmt.setArray(1, _dbConnection.createArrayOf("TEXT", films));
                    pstmt.executeUpdate();
                    return true;
                } catch (SQLException e) {
                    throw new DbException(e.getMessage(), e);
                }
            } else {
                throw new DbException("Can't add movies to other users collections!");
            }
        } else {
            throw new DbException("User " + username + " does not exist in the database!");
        }
    }

    private int getUserId(String username) throws DbException {
        ResultSet rs = executeQuery("SELECT id FROM users WHERE username = \'" + username + "\'", _dbConnection);
        try {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            throw new DbException(e.getMessage(), e);
        }
        return -1;
    }

    private int getCollectionCreator(String collectionId) throws DbException {
        ResultSet rs = executeQuery("SELECT creator FROM collections WHERE collection_id = \'" + collectionId + "\'", _dbConnection);
        try {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            throw new DbException(e.getMessage(), e);
        }
        return -1;
    }

    public void deleteCollection(String username, String collectionId) throws DbException {
        if (userExists(username)) {
            if (getUserId(username) == getCollectionCreator(collectionId)) {
                executeUpdate("DELETE FROM collections WHERE collection_id = \'" + collectionId + "\'", _dbConnection);
            } else {
                throw new DbException("\"" + username + "\" is not the creator of collection: " + collectionId);
            }
        }
    }

    public void addSubscriber(String username, String collectionId) throws DbException {
        if (userExists(username)) {
            int userId = getUserId(username);
            if (!(getCollectionCreator(collectionId) == userId)) {
                try {
                    ResultSet rs = executeQuery("SELECT subscribers FROM collections WHERE collection_id = \'" + collectionId + "\'", _dbConnection);
                    Integer[] subscribers = new Integer[1];
                    if (rs.next()) {
                        Array arr = rs.getArray(1);
                        if (arr != null) {
                            Integer[] tmp = (Integer[]) arr.getArray();
                            subscribers = new Integer[tmp.length + 1];
                            for (int i = 0; i < tmp.length; i++) {
                                subscribers[i] = tmp[i];
                            }
                            subscribers[subscribers.length - 1] = userId;
                        } else {
                            subscribers[0] = userId;
                        }
                    }
                    String sql = "UPDATE collections SET subscribers = (?) WHERE collection_id = \'" + collectionId + "\';";
                    PreparedStatement pstmt = _dbConnection.prepareStatement(sql);
                    pstmt.setArray(1, _dbConnection.createArrayOf("INTEGER", subscribers));
                    pstmt.executeUpdate();
                } catch (SQLException e) {
                    throw new DbException(e.getMessage(), e);
                }
            } else {
                throw new DbException("Can't subscribe to your own collection!");
            }
        } else {
            throw new DbException("User " + username + " does not exist in the database!");
        }
    }

    public ArrayList<CineCollection> getMyCollections(String username) throws DbException {
        ArrayList<CineCollection> myCollections = new ArrayList<>();
        if (userExists(username)) {
            int userId = getUserId(username);
            ResultSet rs = executeQuery("SELECT * FROM collections WHERE creator = \'" + userId + "\' ORDER BY collection_id ASC;", _dbConnection);
            myCollections = getCineCollections(rs);
        }
        return myCollections;
    }

    public ArrayList<CineCollection> getSubscribedCollections(String username) throws DbException {
        ArrayList<CineCollection> subscribedCollections = new ArrayList<>();
        if (userExists(username)) {
            int userId = getUserId(username);
            ResultSet rs = executeQuery("SELECT * FROM collections WHERE \'" + userId + "\' = ANY(subscribers) ORDER BY collection_id ASC;", _dbConnection);
            subscribedCollections = getCineCollections(rs);
        }
        return subscribedCollections;
    }

    private ArrayList<CineCollection> getCineCollections(ResultSet rs) throws DbException {
        ArrayList<CineCollection> cineCollections = new ArrayList<>();
        try {
            while (rs.next()) {
                int collectionId = rs.getInt(1);
                int creator = rs.getInt(2);
                String collectionName = rs.getString(3);
                Array filmsArr = rs.getArray(4);
                Array subsArr = rs.getArray(5);
                ArrayList<String> films = new ArrayList<>();
                if (filmsArr != null) {
                    String[] tmp = (String[]) filmsArr.getArray();
                    films.addAll(Arrays.asList(tmp));
                }
                CineCollection cineCollection;
                if (subsArr != null) {
                    Integer[] subscribers = (Integer[]) subsArr.getArray();
                    cineCollection = new CineCollection(collectionId, creator, collectionName, films, subscribers);
                } else {
                    cineCollection = new CineCollection(collectionId, creator, collectionName, films);
                }
                cineCollections.add(cineCollection);
            }
            return cineCollections;
        } catch (SQLException e) {
            throw new DbException(e.getMessage(), e);
        }
    }

    public ArrayList<User> getAllUsers() throws DbException {
        ArrayList<User> users = new ArrayList<>();

        ResultSet rs = executeQuery("SELECT id, username FROM users", _dbConnection);
        try {
            while (rs.next()) {
                User user = new User(rs.getInt(1), rs.getString(2));
                users.add(user);
            }
        } catch (SQLException e) {
            throw new DbException("Failed to get all users: " + e.getMessage(), e);
        }
        return users;
    }
}
