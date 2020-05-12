package auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import javalinjwt.JWTGenerator;
import javalinjwt.JWTProvider;
import objects.User;

public class AuthManager {
    private final Algorithm algorithm = Algorithm.HMAC256("therealslimshady");

    public JWTGenerator<User> generator = (user, alg) -> {
        JWTCreator.Builder token = JWT.create()
                .withClaim("name", user.getUsername());
        return token.sign(alg);
    };

    public JWTVerifier verifier = JWT.require(algorithm).build();

    public JWTProvider provider = new JWTProvider(algorithm, generator, verifier);
}
