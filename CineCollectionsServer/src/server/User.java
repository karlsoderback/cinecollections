package server;

public class User {
    private String _username;
    private String _password;
    private final int _id;

    public User(Integer id, String username, String password) {
        _username = username;
        _password = password;
        _id = id;
    }

    public void setUsername(String newUsername) {
        _username = newUsername;
    }

    public void setPassword(String newPassword) {
        _password = newPassword;
    }

    public String getUsername() {
        return _username;
    }

    public String getPassword() {
        return _password;
    }

    public Integer getId() {
        return _id;
    }
}

