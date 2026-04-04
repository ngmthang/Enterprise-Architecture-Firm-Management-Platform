package com.example.architectureplatform.consultation.entity;

import com.example.architectureplatform.consultation.enums.ConsultationRequestStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "consultation_requests")
public class ConsultationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fullname", nullable = false, length = 150)
    private String fullname;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(name = "project_type", nullable = false, length = 100)
    private String projectType;

    @Column(name = "project_location", nullable = false, length = 255)
    private String projectLocation;

    @Column(name = "project_budget", nullable = false, length = 100)
    private String projectBudget;

    @Column(name = "preferred_contact_method", nullable = false, length = 30)
    private String preferredContactMethod;

    @Column(name = "project_details", nullable = false, columnDefinition = "TEXT")
    private String projectDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ConsultationRequestStatus status = ConsultationRequestStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ConsultationRequest() {}

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if(this.status == null) {
            this.status = ConsultationRequestStatus.PENDING;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public String getFullName() { return fullname; }
    public void setFullName(String fullname) { this.fullname = fullname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }

    public String getProjectLocation() { return projectLocation; }
    public void setProjectLocation(String projectLocation) { this.projectLocation = projectLocation; }

    public String getProjectBudget() { return projectBudget; }
    public void setProjectBudget(String projectBudget) { this.projectBudget = projectBudget; }

    public String getPreferredContactMethod() { return preferredContactMethod; }
    public void setPreferredContactMethod(String preferredContactMethod) {
        this.preferredContactMethod = preferredContactMethod;
    }

    public String getProjectDetails() { return projectDetails; }
    public void setProjectDetails(String projectDetails) {
        this.projectDetails = projectDetails;
    }

    public ConsultationRequestStatus getStatus() { return status; }
    public void setStatus(ConsultationRequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
