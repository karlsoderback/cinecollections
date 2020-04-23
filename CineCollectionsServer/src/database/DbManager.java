package database;

import exception.DbException;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DbManager {
    private Connection _connection;

    public DbManager() {

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
