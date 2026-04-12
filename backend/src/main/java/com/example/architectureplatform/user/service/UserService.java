package com.example.architectureplatform.user.service;

import com.example.architectureplatform.common.exception.ConflictException;
import com.example.architectureplatform.common.exception.ResourceNotFoundException;
import com.example.architectureplatform.user.dto.response.UserResponse;
import com.example.architectureplatform.user.dto.request.CreateUserRequest;
import com.example.architectureplatform.user.entity.Role;
import com.example.architectureplatform.user.entity.User;
import com.example.architectureplatform.user.mapper.UserMapper;
import com.example.architectureplatform.user.repository.UserRepository;
import com.example.architectureplatform.user.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public UserResponse createUser(CreateUserRequest request) {
        if(userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email already exists");
        }

        Role role = roleRepository.findByName(request.role())
                .orElseThrow(() -> new ResourceNotFoundException("Role not Found: " + request.role()));

        User user = new User();
        user.setName(request.fullname());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone());
        user.setEnabled(true);
        user.setEmailVerified(false);
        user.setRoles(Set.of(role));

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
