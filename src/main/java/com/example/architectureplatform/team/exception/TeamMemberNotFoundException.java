package com.example.architectureplatform.team.exception;

public class TeamMemberNotFoundException extends RuntimeException {

    public TeamMemberNotFoundException(Long teamMemberId) {
        super("Team member not found with id: " + teamMemberId);
    }
}