package com.example.architectureplatform.project.dto.request;

import com.example.architectureplatform.project.enums.ProjectStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateProjectStatusRequest(

        @NotNull(message = "Project status is required")
        ProjectStatus status
) {
}