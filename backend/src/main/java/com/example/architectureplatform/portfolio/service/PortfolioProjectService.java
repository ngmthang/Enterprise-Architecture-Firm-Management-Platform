package com.example.architectureplatform.portfolio.service;

import com.example.architectureplatform.portfolio.dto.request.CreatePortfolioProjectRequest;
import com.example.architectureplatform.portfolio.dto.request.UpdatePortfolioProjectRequest;
import com.example.architectureplatform.portfolio.dto.response.PortfolioProjectResponse;
import com.example.architectureplatform.portfolio.entity.PortfolioProject;
import com.example.architectureplatform.portfolio.enums.PortfolioProjectStatus;
import com.example.architectureplatform.portfolio.exception.PortfolioProjectNotFoundByIdException;
import com.example.architectureplatform.portfolio.exception.PortfolioProjectNotFoundException;
import com.example.architectureplatform.portfolio.exception.PortfolioProjectSlugAlreadyExistsException;
import com.example.architectureplatform.portfolio.mapper.PortfolioProjectMapper;
import com.example.architectureplatform.portfolio.repository.PortfolioProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PortfolioProjectService {

    private final PortfolioProjectRepository portfolioProjectRepository;
    private final PortfolioProjectMapper portfolioProjectMapper;

    public PortfolioProjectService(
            PortfolioProjectRepository portfolioProjectRepository,
            PortfolioProjectMapper portfolioProjectMapper
    ) {
        this.portfolioProjectRepository = portfolioProjectRepository;
        this.portfolioProjectMapper = portfolioProjectMapper;
    }

    @Transactional
    public PortfolioProjectResponse createPortfolioProject(CreatePortfolioProjectRequest request) {
        if (portfolioProjectRepository.existsBySlug(request.slug())) {
            throw new PortfolioProjectSlugAlreadyExistsException(request.slug());
        }

        PortfolioProject portfolioProject = portfolioProjectMapper.toEntity(request);
        PortfolioProject savedPortfolioProject = portfolioProjectRepository.save(portfolioProject);
        return portfolioProjectMapper.toResponse(savedPortfolioProject);
    }

    @Transactional
    public PortfolioProjectResponse updatePortfolioProject(Long id, UpdatePortfolioProjectRequest request) {
        PortfolioProject portfolioProject = portfolioProjectRepository.findById(id)
                .orElseThrow(() -> new PortfolioProjectNotFoundByIdException(id));

        if (portfolioProjectRepository.existsBySlugAndIdNot(request.slug(), id)) {
            throw new PortfolioProjectSlugAlreadyExistsException(request.slug());
        }

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

        PortfolioProject updatedPortfolioProject = portfolioProjectRepository.save(portfolioProject);
        return portfolioProjectMapper.toResponse(updatedPortfolioProject);
    }

    @Transactional(readOnly = true)
    public List<PortfolioProjectResponse> getPublishedPortfolioProjects() {
        return portfolioProjectRepository
                .findByStatusOrderByDisplayOrderAscCreatedAtDesc(PortfolioProjectStatus.PUBLISHED)
                .stream()
                .map(portfolioProjectMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PortfolioProjectResponse getPublishedPortfolioProjectBySlug(String slug) {
        PortfolioProject portfolioProject = portfolioProjectRepository.findBySlug(slug)
                .filter(project -> project.getStatus() == PortfolioProjectStatus.PUBLISHED)
                .orElseThrow(() -> new PortfolioProjectNotFoundException(slug));

        return portfolioProjectMapper.toResponse(portfolioProject);
    }
}