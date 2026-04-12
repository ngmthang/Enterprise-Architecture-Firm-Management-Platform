package com.example.architectureplatform.team.service;

import com.example.architectureplatform.team.dto.request.CreateTeamMemberRequest;
import com.example.architectureplatform.team.dto.request.UpdateTeamMemberRequest;
import com.example.architectureplatform.team.dto.response.TeamMemberResponse;
import com.example.architectureplatform.team.entity.TeamMember;
import com.example.architectureplatform.team.exception.TeamMemberAlreadyExistsException;
import com.example.architectureplatform.team.exception.TeamMemberNotFoundException;
import com.example.architectureplatform.team.mapper.TeamMemberMapper;
import com.example.architectureplatform.team.repository.TeamMemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;
    private final TeamMemberMapper teamMemberMapper;

    public TeamMemberService(
            TeamMemberRepository teamMemberRepository,
            TeamMemberMapper teamMemberMapper
    ) {
        this.teamMemberRepository = teamMemberRepository;
        this.teamMemberMapper = teamMemberMapper;
    }

    @Transactional
    public TeamMemberResponse createTeamMember(CreateTeamMemberRequest request) {
        if (request.email() != null && !request.email().isBlank()
                && teamMemberRepository.existsByEmail(request.email())) {
            throw new TeamMemberAlreadyExistsException(request.email());
        }

        TeamMember teamMember = teamMemberMapper.toEntity(request);
        TeamMember savedTeamMember = teamMemberRepository.save(teamMember);
        return teamMemberMapper.toResponse(savedTeamMember);
    }

    @Transactional
    public TeamMemberResponse updateTeamMember(Long id, UpdateTeamMemberRequest request) {
        TeamMember teamMember = teamMemberRepository.findById(id)
                .orElseThrow(() -> new TeamMemberNotFoundException(id));

        if (request.email() != null && !request.email().isBlank()
                && teamMemberRepository.existsByEmailAndIdNot(request.email(), id)) {
            throw new TeamMemberAlreadyExistsException(request.email());
        }

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

        TeamMember updatedTeamMember = teamMemberRepository.save(teamMember);
        return teamMemberMapper.toResponse(updatedTeamMember);
    }

    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getActiveTeamMembers() {
        return teamMemberRepository.findByActiveTrueOrderByDisplayOrderAscCreatedAtDesc()
                .stream()
                .map(teamMemberMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TeamMemberResponse getTeamMemberById(Long teamMemberId) {
        TeamMember teamMember = teamMemberRepository.findById(teamMemberId)
                .orElseThrow(() -> new TeamMemberNotFoundException(teamMemberId));

        return teamMemberMapper.toResponse(teamMember);
    }
}