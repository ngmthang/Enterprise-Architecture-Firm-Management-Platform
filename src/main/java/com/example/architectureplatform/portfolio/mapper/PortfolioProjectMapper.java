package com.example.architectureplatform.portfolio.mapper;

import com.example.architectureplatform.portfolio.dto.request.CreatePortfolioProjectRequest;
import com.example.architectureplatform.portfolio.dto.response.PortfolioProjectResponse;
import com.example.architectureplatform.portfolio.entity.PortfolioProject;
import org.springframework.stereotype.Component;

@Component
public class PortfolioProjectMapper {

    public PortfolioProject toEntity(CreatePortfolioProjectRequest request) {
        PortfolioProject portfolioProject = new PortfolioProject();
        portfolioProject.setTitle(request.title());
        portfolioProject.setSlug(request.slug());
        portfolioProject.setShortDescription(request.shortDescription());
        portfolioProject.setFullDescription(request.fullDescription());
        portfolioProject.setLocation(request.location());
        portfolioProject.setProjectType(request.projectType());
        portfolioProject.setStatus(request.status());
        portfolioProject.setFeatured(request.featured());
        portfolioProject.setDisplayOrder(request.displayOrder());
        portfolioProject.setCoverImageUrl(request.coverImageUrl());
        portfolioProject.setCompletedAt(request.completedAt());
        return portfolioProject;
    }

    public PortfolioProjectResponse toResponse(PortfolioProject portfolioProject) {
        return new PortfolioProjectResponse(
                portfolioProject.getId(),
                portfolioProject.getTitle(),
                portfolioProject.getSlug(),
                portfolioProject.getShortDescription(),
                portfolioProject.getFullDescription(),
                portfolioProject.getLocation(),
                portfolioProject.getProjectType(),
                portfolioProject.getStatus(),
                portfolioProject.isFeatured(),
                portfolioProject.getDisplayOrder(),
                portfolioProject.getCoverImageUrl(),
                portfolioProject.getCompletedAt(),
                portfolioProject.getCreatedAt(),
                portfolioProject.getUpdatedAt()
        );
    }
}