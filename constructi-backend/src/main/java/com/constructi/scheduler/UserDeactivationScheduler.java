package com.constructi.scheduler;

import com.constructi.model.entity.User;
import com.constructi.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class UserDeactivationScheduler {

    private final UserRepository userRepository;

    public UserDeactivationScheduler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

//    @Scheduled(cron = "0 0 0 * * ?") // Runs every day at midnight
    @Scheduled(cron = "0 0 * * * ?") // Runs every hour at minute 0

    public void deactivateInactiveUsers() {
        LocalDateTime now = LocalDateTime.now();
        List<User> users = userRepository.findByPasswordUpdateExpiryBeforeAndIsActiveTrue(now);

        for (User user : users) {
            user.setActive(false);
            userRepository.save(user);
        }
    }
}