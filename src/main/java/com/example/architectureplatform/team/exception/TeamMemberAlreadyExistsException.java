package com.example.architectureplatform.team.exception;

public class TeamMemberAlreadyExistsException extends RuntimeException {
  public TeamMemberAlreadyExistsException(String message) {
    super(message);
  }
}
