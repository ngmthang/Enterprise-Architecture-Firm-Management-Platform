package com.example.architectureplatform.portfolio.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.portfolio.dto.request.CreatePortfolioProjectRequest;
import com.example.architectureplatform.portfolio.dto.request.UpdatePortfolioProjectRequest;
import com.example.architectureplatform.portfolio.dto.response.PortfolioProjectResponse;
import com.example.architectureplatform.portfolio.service.PortfolioProjectService;
import com.example.architectureplatform.security.annotation.AdminOnly;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/portfolio-projects")
public class PortfolioProjectController {

    private final PortfolioProjectService portfolioProjectService;

    public PortfolioProjectController(PortfolioProjectService portfolioProjectService) {
        this.portfolioProjectService = portfolioProjectService;
    }

    @GetMapping
    public ApiResponse<List<PortfolioProjectResponse>> getPublishedPortfolioProjects() {
        List<PortfolioProjectResponse> responses =
                portfolioProjectService.getPublishedPortfolioProjects();

        return ApiResponse.success("Published portfolio projects fetched successfully", responses);
    }

    @GetMapping("/{slug}")
    public ApiResponse<PortfolioProjectResponse> getPublishedPortfolioProjectBySlug(
            @PathVariable String slug
    ) {
        PortfolioProjectResponse response =
                portfolioProjectService.getPublishedPortfolioProjectBySlug(slug);

        return ApiResponse.success("Published portfolio project fetched successfully", response);
    }

    @AdminOnly
    @PostMapping
    public ApiResponse<PortfolioProjectResponse> createPortfolioProject(
            @Valid @RequestBody CreatePortfolioProjectRequest request
    ) {
        PortfolioProjectResponse response = portfolioProjectService.createPortfolioProject(request);
        return ApiResponse.success("Portfolio project created successfully", response);
    }

    @AdminOnly
    @PutMapping("/{id}")
    public ApiResponse<PortfolioProjectResponse> updatePortfolioProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePortfolioProjectRequest request
    ) {
        PortfolioProjectResponse response = portfolioProjectService.updatePortfolioProject(id, request);
        return ApiResponse.success("Portfolio project updated successfully", response);
    }
}