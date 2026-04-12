package com.example.architectureplatform.project.mapper;

import com.example.architectureplatform.project.dto.request.CreateProjectRequest;
import com.example.architectureplatform.project.dto.request.UpdateProjectRequest;
import com.example.architectureplatform.project.dto.response.ProjectResponse;
import com.example.architectureplatform.project.entity.Project;
import com.example.architectureplatform.project.enums.ProjectStatus;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public Project toEntity(CreateProjectRequest request) {
        Project project = new Project();
        project.setCode(request.code().trim());
        project.setName(request.name().trim());
        project.setProjectType(request.projectType());
        project.setStatus(request.status() != null ? request.status() : ProjectStatus.LEAD);
        project.setClientName(request.clientName().trim());
        project.setClientEmail(trimToNull(request.clientEmail()));
        project.setClientPhone(trimToNull(request.clientPhone()));
        project.setLocation(trimToNull(request.location()));
        project.setAreaSizeSqft(request.areaSizeSqft());
        project.setEstimatedBudget(request.estimatedBudget());
        project.setStartDate(request.startDate());
        project.setTargetEndDate(request.targetEndDate());
        project.setActualEndDate(request.actualEndDate());
        project.setDescription(trimToNull(request.description()));
        project.setNotes(trimToNull(request.notes()));
        project.setActive(request.active() == null || request.active());
        return project;
    }

    public void updateEntity(Project project, UpdateProjectRequest request) {
        project.setName(request.name().trim());
        project.setProjectType(request.projectType());
        project.setStatus(request.status());
        project.setClientName(request.clientName().trim());
        project.setClientEmail(trimToNull(request.clientEmail()));
        project.setClientPhone(trimToNull(request.clientPhone()));
        project.setLocation(trimToNull(request.location()));
        project.setAreaSizeSqft(request.areaSizeSqft());
        project.setEstimatedBudget(request.estimatedBudget());
        project.setStartDate(request.startDate());
        project.setTargetEndDate(request.targetEndDate());
        project.setActualEndDate(request.actualEndDate());
        project.setDescription(trimToNull(request.description()));
        project.setNotes(trimToNull(request.notes()));
        project.setActive(request.active() == null || request.active());
    }

    public ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getCode(),
                project.getName(),
                project.getProjectType(),
                project.getStatus(),
                project.getClientName(),
                project.getClientEmail(),
                project.getClientPhone(),
                project.getLocation(),
                project.getAreaSizeSqft(),
                project.getEstimatedBudget(),
                project.getStartDate(),
                project.getTargetEndDate(),
                project.getActualEndDate(),
                project.getDescription(),
                project.getNotes(),
                project.isActive(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}