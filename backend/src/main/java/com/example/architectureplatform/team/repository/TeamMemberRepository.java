package com.example.architectureplatform.team.repository;

import com.example.architectureplatform.team.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    List<TeamMember> findByActiveTrueOrderByDisplayOrderAscCreatedAtDesc();

    List<TeamMember> findByFeaturedTrueAndActiveTrueOrderByDisplayOrderAscCreatedAtDesc();

    List<TeamMember> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}