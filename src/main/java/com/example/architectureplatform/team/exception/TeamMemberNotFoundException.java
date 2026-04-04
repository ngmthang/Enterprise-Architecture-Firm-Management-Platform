package com.example.architectureplatform.team.exception;

public class TeamMemberNotFoundException extends RuntimeException {
  public TeamMemberNotFoundException(String message) {
    super(message);
  }
}
