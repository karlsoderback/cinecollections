package database;

import exception.DbException;
import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.*;
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

    public void createNewUser(String username, String password) throws DbException {
        if (userExists(username)) {
            throw new DbException("A user with this username already exists!");
        }
        executeUpdate("INSERT INTO users(username, password) VALUES (\'" + username + "\', \'" + password + "\');", _dbConnection);
        System.out.println("User \"" + username + "\" added to database");
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

    public boolean credentialsValid(String username, String password) throws DbException {
        if (userExists(username)) {
            ResultSet rs = executeQuery("SELECT * FROM users WHERE username = \'" + username + "\';", _dbConnection); //Select pw only?
            try {
                if (rs.next()) {
                    if (!rs.getString(3).equals(password)) {
                        throw new DbException("Incorrect credentials");
                    }
                }
                rs.close();
                return true;
            } catch (SQLException e) {
                throw new DbException(e.getMessage(), e);
            }
        } else {
            throw new DbException("Incorrect credentials");
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

    public int createCollection(JSONObject collection) throws DbException {
        String creator = collection.getString("username");
        int creatorId = getUserId(creator);
        String collectionName = collection.getJSONObject("collection").getString("collection_name");
        JSONArray filmsJSON = collection.getJSONObject("collection").getJSONArray("films");
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

    public void deleteCollection(String collectionId) throws DbException {
        executeUpdate("DELETE FROM collections WHERE collection_id = \'" + collectionId + "\'", _dbConnection);
    }

    public void addSubscriber(String username, String collectionId) throws DbException {
        if (userExists(username)) {
            Integer userId = getUserId(username);
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
                        subscribers[subscribers.length] = userId;
                    } else {
                        subscribers[0] = userId;
                    }
                }
                System.out.println(Arrays.toString(subscribers));

                String sql = "UPDATE collections SET subscribers = (?) WHERE collection_id = \'" + collectionId + "\';";
                PreparedStatement pstmt = _dbConnection.prepareStatement(sql);
                pstmt.setArray(1, _dbConnection.createArrayOf("INTEGER", subscribers));
                pstmt.executeUpdate();
            } catch (SQLException e) {
                throw new DbException(e.getMessage(), e);
            }

        }
    }
}
