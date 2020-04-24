package database;

import exception.DbException;
import org.json.JSONObject;

import javax.xml.transform.Result;
import java.sql.*;
import java.util.Properties;

public class DbManager {
    private Connection _serverConnection;
    private Connection _dbConnection;
    Properties _credentials = new Properties();

    public DbManager() {
        _credentials.setProperty("user", "postgres");
        _credentials.setProperty("password", "admin");
        _credentials.setProperty("protocolVersion", "3");
    }

    private Connection initConnection(String suffix) throws SQLException {
        Connection connection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/" + suffix, _credentials);
        connection.setAutoCommit(true);
        return connection;
    }

    private void executeUpdate(String sql, Connection connection) throws DbException {
        try {
            connection.createStatement().executeUpdate(sql);
        } catch (SQLException throwables) {
            throw new DbException("Failed to execute update: " + throwables.getMessage(), throwables);
        }
    }

    private ResultSet executeQuery(String sql, Connection connection) throws DbException {
        try {
            return connection.createStatement().executeQuery(sql);
        } catch (SQLException throwables) {
            throw new DbException("Failed to execute query: " + throwables.getMessage(), throwables);
        }
    }

    public void connect() throws DbException { // TODO - Make connection url configurable
        try {
            _serverConnection = initConnection("");
            System.out.println("Connected to SQL Server at localhost:5432");
            initializeDatabase();
        } catch (SQLException throwables) {
            throw new DbException("Failed to connect to database: " + throwables.getMessage(), throwables);
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
                    "password VARCHAR (256));", _dbConnection); // TODO - Hash passwords
        executeUpdate("CREATE TABLE IF NOT EXISTS collections(" +
                    "collection_id SERIAL PRIMARY KEY," +
                    "user_id INTEGER REFERENCES users(id)," +
                    "collection_name VARCHAR (256)," +
                    "films VARCHAR (256));", _dbConnection);

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
        } catch (SQLException throwables) {
            throw new DbException("Failed to check if database \"" + dbname + "\" exists: " + throwables.getMessage());
        }
    }


    public void disconnect() throws DbException {
        try {
            _dbConnection.close();
            _serverConnection.close();
        } catch (SQLException throwables) {
            throw new DbException("Failed to disconnect from database: " + throwables.getMessage(), throwables);
        }
    }

    public void createNewUser(String username, String password) throws DbException {
        executeUpdate("INSERT INTO users(username, password) VALUES (\'" + username + "\', \'" + password + "\');", _dbConnection);
        System.out.println("User \"" + username + " added to database");
    }
}
