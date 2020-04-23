package se.cinellections.Server;

import io.javalin.Javalin;

public class Server {
    public static void run() {
        Javalin app = Javalin.create().start(7000);
        app.get("/", ctx -> ctx.result("Hello World"));
    }
}