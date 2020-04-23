package server;

import database.DbManager;
import exception.DbException;
import io.javalin.Javalin;

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

        app.get("/", ctx -> ctx.result("Hello World"));

        app.post("/newuser", ctx -> {

        });
    }
}
