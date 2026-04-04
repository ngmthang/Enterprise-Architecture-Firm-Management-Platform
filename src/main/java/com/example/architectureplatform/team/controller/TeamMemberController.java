package com.example.architectureplatform.team.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.security.annotation.AdminOnly;
import com.example.architectureplatform.team.dto.request.CreateTeamMemberRequest;
import com.example.architectureplatform.team.dto.request.UpdateTeamMemberRequest;
import com.example.architectureplatform.team.dto.response.TeamMemberResponse;
import com.example.architectureplatform.team.service.TeamMemberService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/team-members")
public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    public TeamMemberController(TeamMemberService teamMemberService) {
        this.teamMemberService = teamMemberService;
    }

    @GetMapping
    public ApiResponse<List<TeamMemberResponse>> getActiveTeamMembers() {
        List<TeamMemberResponse> responses = teamMemberService.getActiveTeamMembers();
        return ApiResponse.success("Active team members fetched successfully", responses);
    }

    @GetMapping("/{teamMemberId}")
    public ApiResponse<TeamMemberResponse> getTeamMemberById(
            @PathVariable Long teamMemberId
    ) {
        TeamMemberResponse response = teamMemberService.getTeamMemberById(teamMemberId);
        return ApiResponse.success("Team member fetched successfully", response);
    }

    @AdminOnly
    @PostMapping
    public ApiResponse<TeamMemberResponse> createTeamMember(
            @Valid @RequestBody CreateTeamMemberRequest request
    ) {
        TeamMemberResponse response = teamMemberService.createTeamMember(request);
        return ApiResponse.success("Team member created successfully", response);
    }

    @AdminOnly
    @PutMapping("/{id}")
    public ApiResponse<TeamMemberResponse> updateTeamMember(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTeamMemberRequest request
    ) {
        TeamMemberResponse response = teamMemberService.updateTeamMember(id, request);
        return ApiResponse.success("Team member updated successfully", response);
    }
}