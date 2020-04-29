package server;

import database.DbManager;
import exception.DbException;
import io.javalin.Javalin;
import org.json.JSONObject;

import java.util.Arrays;

public class Server {

    private final DbManager _dbManager = new DbManager();

    public void run() {
        Javalin app = Javalin.create().start(7000); //TODO - Make port configurable
        System.out.println("Server running at localhost:7000");

        try {
            _dbManager.connect();
        } catch (DbException e) {
            e.printStackTrace();
        }

        app.get("/", ctx -> ctx.status(200));
        app.post("/newuser", ctx -> {
            JSONObject jsonObject = new JSONObject(ctx.body());
            _dbManager.createNewUser(jsonObject.getString("username"), jsonObject.getString("password"));
            System.out.println("New user created");
        });
        app.post("/login", ctx -> {
            JSONObject jsonObject = new JSONObject(ctx.body());
            String username = jsonObject.getString("username");
            _dbManager.checkCredentials(username, jsonObject.getString("password"));
            System.out.println("Succesfully logged in \"" + username + "\"");
        });


        app.exception(DbException.class, (e, ctx) -> {
            System.err.println("A database error ocurred: " + e.getMessage()); // TODO - Set up proper responses with error/success codes
            ctx.status(401);
        });
        app.exception(NullPointerException.class, (e, ctx) -> {
            System.err.println("The server encountered a NullPointerException: " + e.getMessage() + "\nStacktrace:\n");
            System.err.println(Arrays.toString(e.getStackTrace()));
            ctx.status(404);
        });
        app.exception(Exception.class, (e, ctx) -> {
            System.err.println("The server encountered an error: " + e.getMessage() + "\nStacktrace:\n");
            System.err.println(Arrays.toString(e.getStackTrace()));
            ctx.status(404);
        });
    }
}
