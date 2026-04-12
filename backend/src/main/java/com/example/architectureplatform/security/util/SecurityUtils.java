package com.example.architectureplatform.security.util;

import com.example.architectureplatform.security.principal.UserPrincipal;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    private SecurityUtils() {}

    public static UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null) {
            throw new AuthenticationCredentialsNotFoundException("No authentication found in security context");
        }

        Object principal = authentication.getPrincipal();

        if(!(principal instanceof UserPrincipal userPrincipal)) {
            throw new AuthenticationCredentialsNotFoundException("Authenticated principal is not a valid user");
        }

        return userPrincipal;
    }
}
