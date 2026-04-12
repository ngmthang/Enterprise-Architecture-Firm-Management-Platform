package com.example.architectureplatform.team.exception;

public class TeamMemberAlreadyExistsException extends RuntimeException {

    public TeamMemberAlreadyExistsException(String email) {
        super("Team member already exists with email: " + email);
    }
}