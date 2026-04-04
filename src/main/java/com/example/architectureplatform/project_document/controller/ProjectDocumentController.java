package com.example.architectureplatform.project_document.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.project_document.dto.request.CreateProjectDocumentRequest;
import com.example.architectureplatform.project_document.dto.request.UpdateProjectDocumentRequest;
import com.example.architectureplatform.project_document.dto.response.ProjectDocumentResponse;
import com.example.architectureplatform.project_document.enums.ProjectDocumentType;
import com.example.architectureplatform.project_document.service.ProjectDocumentService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project-documents")
public class ProjectDocumentController {

    private final ProjectDocumentService projectDocumentService;

    public ProjectDocumentController(ProjectDocumentService projectDocumentService) {
        this.projectDocumentService = projectDocumentService;
    }

    @Operation(summary = "Get public visible active documents by project id")
    @GetMapping("/public/project/{projectId}")
    public ApiResponse<List<ProjectDocumentResponse>> getPublicDocumentsByProjectId(@PathVariable Long projectId) {
        return ApiResponse.success(
                "Project documents retrieved successfully",
                projectDocumentService.getPublicDocumentsByProjectId(projectId)
        );
    }

    @Operation(summary = "Get all project documents")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping
    public ApiResponse<List<ProjectDocumentResponse>> getAllDocuments() {
        return ApiResponse.success(
                "Project documents retrieved successfully",
                projectDocumentService.getAllDocuments()
        );
    }

    @Operation(summary = "Get project documents by project id")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/project/{projectId}")
    public ApiResponse<List<ProjectDocumentResponse>> getDocumentsByProjectId(
            @PathVariable Long projectId,
            @RequestParam(required = false) ProjectDocumentType type
    ) {
        List<ProjectDocumentResponse> documents = (type != null)
                ? projectDocumentService.getDocumentsByProjectIdAndType(projectId, type)
                : projectDocumentService.getDocumentsByProjectId(projectId);

        return ApiResponse.success("Project documents retrieved successfully", documents);
    }

    @Operation(summary = "Get project document by id")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<ProjectDocumentResponse> getDocumentById(@PathVariable Long id) {
        return ApiResponse.success(
                "Project document retrieved successfully",
                projectDocumentService.getDocumentById(id)
        );
    }

    @Operation(summary = "Create project document")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping
    public ApiResponse<ProjectDocumentResponse> createDocument(
            @Valid @RequestBody CreateProjectDocumentRequest request
    ) {
        return ApiResponse.success(
                "Project document created successfully",
                projectDocumentService.createDocument(request)
        );
    }

    @Operation(summary = "Update project document")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<ProjectDocumentResponse> updateDocument(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectDocumentRequest request
    ) {
        return ApiResponse.success(
                "Project document updated successfully",
                projectDocumentService.updateDocument(id, request)
        );
    }
}