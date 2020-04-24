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

        app.exception(NullPointerException.class, (e, ctx) -> {
            System.err.println("The server encountered a NullPointerException: " + e.getMessage()
                    + "\nStacktrace:\n" + Arrays.toString(e.getStackTrace()));
        });
        app.exception(Exception.class, (e, ctx) -> {
            if(e.getMessage().contains("duplicate key")) {
                System.out.println("User already exists"); // TODO - Set up proper responses with error/success codes
            } else {
                System.err.println("The server encountered an error: " + e.getMessage()
                        + "\nStacktrace:\n" + Arrays.toString(e.getStackTrace()));
            }
        });
    }
}
