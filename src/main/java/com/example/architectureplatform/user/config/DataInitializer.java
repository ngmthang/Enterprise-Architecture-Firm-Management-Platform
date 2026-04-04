package com.example.architectureplatform.user.config;

import com.example.architectureplatform.user.entity.User;
import com.example.architectureplatform.user.entity.Role;
import com.example.architectureplatform.user.repository.UserRepository;
import com.example.architectureplatform.user.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if(userRepository.existsByEmail("admin@architectureplatform.com")) {
            return;
        }

        Role superAdminRole = roleRepository.findByName("SUPER_ADMIN")
                .orElseThrow(() -> new IllegalStateException("SUPER_ADMIN role not found"));

        User admin = new User();
        admin.setName("System Administrator");
        admin.setEmail("admin@architectureplatform.com");
        admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
        admin.setPhone("0000000000");
        admin.setEnabled(true);
        admin.setEmailVerified(true);
        admin.setRoles(Set.of(superAdminRole));

        userRepository.save(admin);
    }
}
