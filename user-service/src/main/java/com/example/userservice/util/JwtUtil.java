package com.example.userservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

import static io.jsonwebtoken.Jwts.builder;
import static io.jsonwebtoken.Jwts.parser;

//import static io.jsonwebtoken.Jwts.*;

@Component
public class JwtUtil {
//    private static final String SECRET = "mySuperSecretKey1234567890abcdefghi"; // 32+ chars for HS256
private static final String SECRET = "mySuperSecretKey1234567890abcdefghijklmnopqrstuvwxyz";
    private static final Key SECRET_KEY = new SecretKeySpec(Base64.getDecoder().decode(SECRET),
            SignatureAlgorithm.HS256.getJcaName());
    private static final long EXPIRATION_TIME = 86400000; // 24 hours

    public String generateToken(String username) {
        return builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validateToken(String token, String username) {
        String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    private Claims getClaims(String token) {
        return parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}