package server;

import auth.AuthManager;
import com.auth0.jwt.interfaces.DecodedJWT;
import database.DbManager;
import exception.DbException;
import io.javalin.Javalin;
import io.javalin.http.Handler;
import javalinjwt.JavalinJWT;
import javalinjwt.examples.JWTResponse;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.Optional;

import static io.javalin.apibuilder.ApiBuilder.*;

public class Server {

    private final DbManager _dbManager = new DbManager();
    private final AuthManager _auth = new AuthManager();

    public void run() {
        Javalin app = Javalin.create().start(7000); //TODO - Make port configurable
        System.out.println("Server running at localhost:7000");

        try {
            _dbManager.connect();
        } catch (DbException e) {
            e.printStackTrace();
        }

        /**
         * Token handlers
         */
        Handler generateToken = ctx -> {
            JSONObject jsonObject = new JSONObject(ctx.body());
            User user = new User(jsonObject.getString("username"), jsonObject.getString("password"));
            if (_dbManager.credentialsValid(user.getUsername(), user.getPassword())) {
                String token = _auth.provider.generateToken(user);
                _dbManager.setToken(user.getUsername(), token);
                String message = "Succesfully created a session for \"" + user.getUsername() + "\"";
                ctx.json(new JWTResponse(token));//.status(200).result(message);
                System.out.println(message);
            }
        };
        Handler validateToken = ctx -> {
            Optional<DecodedJWT> decodedJWT = JavalinJWT.getTokenFromHeader(ctx).flatMap(_auth.provider::validateToken);
            String token = String.valueOf(JavalinJWT.getTokenFromHeader(ctx));
            token = token.substring(9, token.length() - 1);


            if (!decodedJWT.isPresent()) {
                ctx.status(401).result("Missing or invalid token");
            } else {
                JSONObject jsonObject = new JSONObject(ctx.body());
                String username = jsonObject.getString("username");
                if (_dbManager.isTokenValid(username, token)) {
                    ctx.result("Token is valid for user: " + username).status(200);
                } else {
                    ctx.result("Token is not valid for user: " + username).status(403);
                }
            }
        };

        /**
         * Routes
         */
        app.routes(() -> {
            path("/", () -> {
                get("", ctx -> {
                    ctx.status(200).result("Hello World");
                });
                post("/newuser", ctx -> {
                    JSONObject jsonObject = new JSONObject(ctx.body());
                    _dbManager.createNewUser(jsonObject.getString("username"), jsonObject.getString("password"));
                    System.out.println("New user created");
                });
                /*post("/login", ctx -> {
                    JSONObject jsonObject = new JSONObject(ctx.body());
                    String username = jsonObject.getString("username");
                    _dbManager.checkCredentials(username, jsonObject.getString("password"));
                    System.out.println("Succesfully logged in \"" + username + "\"");
                });*/
                path("auth", () -> {
                    get("", ctx -> ctx.result("auth"));
                    post("/newsession", generateToken);
                    get("/validatesession", validateToken);
                });
            });
        });

        /**
         * Exception handling
         */
        app.exception(DbException.class, (e, ctx) -> {
            String message = "A database error ocurred: " + e.getMessage();
            System.err.println(message); // TODO - Set up proper responses with error/success codes
            ctx.status(401).result(message);
        });
        app.exception(NullPointerException.class, (e, ctx) -> {
            String message = "The server encountered a NullPointerException: " + e.getMessage();
            System.err.println(message);
            System.err.println("\nStacktrace:\n" + Arrays.toString(e.getStackTrace()));
            ctx.status(400).result(message);
        });
        app.exception(Exception.class, (e, ctx) -> {
            String message = "The server encountered an error: " + e.getMessage();
            System.err.println(message);
            System.err.println("\nStacktrace:\n" + Arrays.toString(e.getStackTrace()));
            ctx.status(400).result(message);
        });
    }
}
