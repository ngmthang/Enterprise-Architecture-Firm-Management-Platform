package com.example.architectureplatform.project.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.project.dto.request.CreateProjectRequest;
import com.example.architectureplatform.project.dto.request.UpdateProjectRequest;
import com.example.architectureplatform.project.dto.request.UpdateProjectStatusRequest;
import com.example.architectureplatform.project.dto.response.ProjectResponse;
import com.example.architectureplatform.project.enums.ProjectStatus;
import com.example.architectureplatform.project.enums.ProjectType;
import com.example.architectureplatform.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @Operation(summary = "Get all active public projects")
    @GetMapping("/public")
    public ApiResponse<List<ProjectResponse>> getAllPublicProjects(
            @RequestParam(required = false) ProjectType type
    ) {
        List<ProjectResponse> projects = (type != null)
                ? projectService.getPublicProjectsByType(type)
                : projectService.getAllPublicProjects();

        return ApiResponse.success("Projects retrieved successfully", projects);
    }

    @Operation(summary = "Get active public project by code")
    @GetMapping("/public/code/{code}")
    public ApiResponse<ProjectResponse> getPublicProjectByCode(@PathVariable String code) {
        return ApiResponse.success(
                "Project retrieved successfully",
                projectService.getPublicProjectByCode(code)
        );
    }

    @Operation(summary = "Get all projects for admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping
    public ApiResponse<List<ProjectResponse>> getAllAdminProjects(
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) ProjectType type
    ) {
        List<ProjectResponse> projects;

        if (status != null) {
            projects = projectService.getAdminProjectsByStatus(status);
        } else if (type != null) {
            projects = projectService.getAdminProjectsByType(type);
        } else {
            projects = projectService.getAllAdminProjects();
        }

        return ApiResponse.success("Projects retrieved successfully", projects);
    }

    @Operation(summary = "Get project by id")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<ProjectResponse> getProjectById(@PathVariable Long id) {
        return ApiResponse.success(
                "Project retrieved successfully",
                projectService.getProjectById(id)
        );
    }

    @Operation(summary = "Get project by code for admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/code/{code}")
    public ApiResponse<ProjectResponse> getProjectByCode(@PathVariable String code) {
        return ApiResponse.success(
                "Project retrieved successfully",
                projectService.getProjectByCode(code)
        );
    }

    @Operation(summary = "Create project")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping
    public ApiResponse<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request) {
        return ApiResponse.success(
                "Project created successfully",
                projectService.createProject(request)
        );
    }

    @Operation(summary = "Update project")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request
    ) {
        return ApiResponse.success(
                "Project updated successfully",
                projectService.updateProject(id, request)
        );
    }

    @Operation(summary = "Update project status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PatchMapping("/{id}/status")
    public ApiResponse<ProjectResponse> updateProjectStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectStatusRequest request
    ) {
        return ApiResponse.success(
                "Project status updated successfully",
                projectService.updateProjectStatus(id, request)
        );
    }
}