package objects;

public class User {
    private String _username;
    private String _password;
    private Integer _id = 0;

    public User(String username, String password) {
        _username = username;
        _password = password;
    }

    public User(Integer id, String username) {
        _username = username;
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

