package com.example.architectureplatform.portfolio.entity;

import com.example.architectureplatform.portfolio.enums.PortfolioProjectStatus;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio_projects")
public class PortfolioProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @Column(name = "short_description", nullable = false, length = 500)
    private String shortDescription;

    @Column(name = "full_description", columnDefinition = "TEXT")
    private String fullDescription;

    @Column(length = 255)
    private String location;

    @Column(name = "project_type", nullable = false, length = 100)
    private String projectType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PortfolioProjectStatus status = PortfolioProjectStatus.DRAFT;

    @Column(nullable = false)
    private boolean featured = false;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "completed_at")
    private LocalDate completedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public PortfolioProject() {}

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if(this.status == null) {
            this.status = PortfolioProjectStatus.DRAFT;
        }

        if(this.displayOrder == null) {
            this.displayOrder = 0;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getFullDescription() { return fullDescription; }
    public void setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
    }

    public String getLocation() { return location; }
    public void setLocation(String location) {
        this.location = location;
    }

    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) {
        this.projectType = projectType;
    }

    public PortfolioProjectStatus getStatus() { return status; }
    public void setStatus(PortfolioProjectStatus status) {
        this.status = status;
    }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public LocalDate getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDate completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
