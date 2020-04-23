package Server;

import io.javalin.Javalin;

public class Server {
    public void run() {
        Javalin app = Javalin.create().start(7000); //TODO - Make port configurable
        app.get("/", ctx -> ctx.result("Hello World"));
    }
}
