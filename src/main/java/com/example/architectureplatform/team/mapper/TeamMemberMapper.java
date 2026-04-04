package com.example.architectureplatform.team.mapper;

import com.example.architectureplatform.team.dto.request.CreateTeamMemberRequest;
import com.example.architectureplatform.team.dto.response.TeamMemberResponse;
import com.example.architectureplatform.team.entity.TeamMember;
import org.springframework.stereotype.Component;

@Component
public class TeamMemberMapper {

    public TeamMember toEntity(CreateTeamMemberRequest request) {
        TeamMember teamMember = new TeamMember();
        teamMember.setFullName(request.fullName());
        teamMember.setJobTitle(request.jobTitle());
        teamMember.setShortBio(request.shortBio());
        teamMember.setFullBio(request.fullBio());
        teamMember.setProfileImageUrl(request.profileImageUrl());
        teamMember.setEmail(request.email());
        teamMember.setPhone(request.phone());
        teamMember.setLinkedinUrl(request.linkedinUrl());
        teamMember.setDisplayOrder(request.displayOrder());
        teamMember.setFeatured(request.featured());
        teamMember.setActive(request.active());
        return teamMember;
    }

    public TeamMemberResponse toResponse(TeamMember teamMember) {
        return new TeamMemberResponse(
                teamMember.getId(),
                teamMember.getFullName(),
                teamMember.getJobTitle(),
                teamMember.getShortBio(),
                teamMember.getFullBio(),
                teamMember.getProfileImageUrl(),
                teamMember.getEmail(),
                teamMember.getPhone(),
                teamMember.getLinkedinUrl(),
                teamMember.getDisplayOrder(),
                teamMember.isFeatured(),
                teamMember.isActive(),
                teamMember.getCreatedAt(),
                teamMember.getUpdatedAt()
        );
    }
}