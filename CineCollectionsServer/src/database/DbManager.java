package database;

import exception.DbException;

import java.sql.*;
import java.util.Properties;

public class DbManager {
    private Connection _connection;

    public DbManager() {

    }

    private void query(String sql) throws DbException {
        try {
            _connection.createStatement().executeUpdate(sql);
        } catch (SQLException throwables) {
            throw new DbException("Failed to create database: " + throwables.getMessage());
        }
    }

    public void connect() throws DbException { //TODO - Make connection url configurable
        String url = "jdbc:postgresql://localhost:5432/";
        Properties p = new Properties();
        p.setProperty("user", "postgres");
        p.setProperty("password", "admin");
        p.setProperty("protocolVersion", "3");

        try {
            _connection = DriverManager.getConnection(url, p);
            _connection.setAutoCommit(true);
        } catch (SQLException throwables) {
            throw new DbException("Failed to connect to database: " + throwables.getMessage(), throwables);
        }
        System.out.println("Connected to SQL Server at localhost:5432");
        initialize();
    }

    private void initialize() throws DbException {
        if (!dbExists("userdb")) {
            System.out.println("Initializing User Database");
            query("CREATE DATABASE userdb;");
        }
        if (!dbExists("collectionsdb")) {
            System.out.println("Initializing Collection Database");
            query("CREATE DATABASE collectionsdb;");
        }
    }

    private boolean dbExists(String dbname) throws DbException {
        try {
            Statement statement = _connection.createStatement();
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
            if (!_connection.isClosed()) {
                _connection.close();
            }
        } catch (SQLException throwables) {
            throw new DbException("Failed to disconnect from database: " + throwables.getMessage(), throwables);
        }
    }
}
