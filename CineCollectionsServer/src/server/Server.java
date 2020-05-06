package server;

import auth.AuthManager;
import com.auth0.jwt.interfaces.DecodedJWT;
import database.DbManager;
import exception.DbException;
import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import javalinjwt.JavalinJWT;
import javalinjwt.examples.JWTResponse;
import objects.CineCollection;
import objects.User;
import org.json.JSONObject;

import java.util.ArrayList;
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
         * Token handler
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
            } else {
                ctx.result("Invalid credentials were provided").status(403);
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
                    String username = jsonObject.getString("username");
                    _dbManager.createNewUser(username, jsonObject.getString("password"));
                    System.out.println("New user created");
                    ctx.status(200).result("Welcome to CineCollections, " + username + "!");
                });
                path("auth", () -> {
                    post("/newsession", generateToken);
                });
                path("collection", () -> {
                    post("/create", ctx -> {
                        String username = ctx.queryParam("username");
                        if (requestIsAuthorized(ctx, username)) {
                            JSONObject collection = new JSONObject(ctx.body()).getJSONObject("collection");
                            int collectionId = _dbManager.createCollection(collection, username);
                            ctx.result("Collection: \"" + collection.getString("collection_name") + "\" was saved!")
                                    .status(200)
                                    .header("collection_id", String.valueOf(collectionId));
                        } else {
                            ctx.result("Token is not valid for user: " + username).status(403);
                        }
                    });
                    get("/delete", ctx -> {
                        String username = ctx.queryParam("username");
                        if (requestIsAuthorized(ctx, username)) {
                            String collectionId = ctx.queryParam("collectionId");
                            _dbManager.deleteCollection(collectionId);
                            ctx.result("Deleted collection with id: " + collectionId).status(200);
                        } else {
                            ctx.result("Token is not valid for user: " + username).status(403);
                        }
                    });
                    get("/subscribe", ctx -> {
                        String username = ctx.queryParam("username");
                        if (requestIsAuthorized(ctx, username)) {
                            String collectionId = ctx.queryParam("collectionId");
                            _dbManager.addSubscriber(username, collectionId);
                            ctx.result("\"" + username + "\" is now a subscriber of collection with id: " + collectionId).status(200);
                        } else {
                            ctx.result("Token is not valid for user: " + username).status(403);
                        }
                    });
                    get("/getallforuser", ctx -> {
                        String username = ctx.queryParam("username");
                        if (requestIsAuthorized(ctx, username)) {
                            ArrayList<CineCollection> myCollections = _dbManager.getMyCollections(username);
                            ArrayList<CineCollection> subscribedCollections = _dbManager.getSubscribedCollections(username);

                            ctx.result(serializeCollections(myCollections, subscribedCollections)).status(200).contentType("application/json");
                        } else {
                            ctx.result("Token is not valid for user: " + username).status(403);
                        }
                    });
                });
            });
        });

        /**
         * Exception handling
         */
        app.exception(DbException.class, (e, ctx) -> { // TODO - review responses and error codes
            String message = "A database error ocurred: " + e.getMessage();
            System.err.println(message); 
            System.err.println("Stacktrace:");
            e.printStackTrace();
            ctx.status(401).result(message);
        });
        app.exception(NullPointerException.class, (e, ctx) -> {
            String message = "The server encountered a NullPointerException: " + e.getMessage();
            System.err.println(message);
            System.err.println("Stacktrace:");
            e.printStackTrace();
            ctx.status(400).result(message);
        });
        app.exception(Exception.class, (e, ctx) -> {
            String message = "The server encountered an error: " + e.getMessage();
            System.err.println(message);
            System.err.println("Stacktrace:");
            e.printStackTrace();
            ctx.status(400).result(message);
        });
    }

    private boolean requestIsAuthorized(Context ctx, String username) throws DbException {
        Optional<DecodedJWT> decodedJWT = JavalinJWT.getTokenFromHeader(ctx).flatMap(_auth.provider::validateToken);
        String token = String.valueOf(JavalinJWT.getTokenFromHeader(ctx));
        token = token.substring(9, token.length() - 1);

        if (!decodedJWT.isPresent()) {
            ctx.status(401).result("Missing or invalid token");
        } else {
            return _dbManager.isTokenValid(username, token);
        }
        return false;
    }

    private String serializeCollections(ArrayList<CineCollection> myCollections, ArrayList<CineCollection> subscribedCollections) {
        StringBuilder serialized = new StringBuilder("{\n\"my_collections\":\n  [\n");
        serialized.append(createCollectionJSONList(myCollections));
        serialized.append(",\n");

        serialized.append("\"subscribed_collections\":\n  [\n");
        serialized.append(createCollectionJSONList(subscribedCollections));
        serialized.append("\n}");

        return serialized.toString();
    }

    private String createCollectionJSONList(ArrayList<CineCollection> cineCollections){
        StringBuilder serialized = new StringBuilder();
        for (CineCollection collection : cineCollections) {
            if (cineCollections.indexOf(collection) != cineCollections.size() - 1) {
                serialized.append(collection.serialize());
                serialized.append(",\n");
            } else {
                serialized.append(collection.serialize());
                serialized.append("\n  ]");
            }
        }
        return serialized.toString();
    }
}
