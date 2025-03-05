package com.constructi.scheduler;

import com.constructi.model.entity.User;
import com.constructi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UserDeactivationScheduler {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


//    @Scheduled(cron = "0 0 0 * * ?") // Runs every day at midnight
    @Scheduled(cron = "0 0 * * * ?") // Runs every hour 

    public void deactivateInactiveUsers() {
        LocalDateTime now = LocalDateTime.now();
        List<User> users = userRepository.findByPasswordUpdateExpiryBeforeAndActiveTrue(now);

        for (User user : users) {
            if (user.getPasswordChangedAt() == null) {
                user.setActive(false);
                user.setPassword(passwordEncoder.encode("Constructi123@"));
                userRepository.save(user);
            }
        }
    }
}