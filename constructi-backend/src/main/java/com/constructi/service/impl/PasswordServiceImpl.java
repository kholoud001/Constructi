package com.constructi.service.impl;

import com.constructi.DTO.ForgotPasswordRequest;
import com.constructi.DTO.ResetPasswordRequest;
import com.constructi.exception.ResourceNotFoundException;
import com.constructi.mapper.MaterialMapper;
import com.constructi.model.entity.User;
import com.constructi.repository.UserRepository;
import com.constructi.repository.PasswordResetTokenRepository;
import com.constructi.model.entity.PasswordResetToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.constructi.service.PasswordService;
import com.constructi.service.impl.EmailService;

import org.springframework.beans.factory.annotation.Value;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PasswordServiceImpl implements PasswordService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    @Value("${app.resetPasswordLink}")
    private String resetPasswordLink;

    @Override
    public void sendResetPasswordEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PasswordResetToken token = new PasswordResetToken(user);
        tokenRepository.save(token);

        String resetLink = resetPasswordLink + "?token=" + token.getToken();

        String emailContent = """
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <div style="text-align: center;">
                <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="Construction Icon" width="80" style="margin-bottom: 20px;">
                <h2 style="color: #004aad;">Reset Your Password</h2>
            </div>
            <p>Hello %s,</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="%s" style="padding: 12px 24px; background-color: #004aad; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Reset Password
                </a>
            </div>
            <p>If you did not request this, please ignore this email.</p>
            <p style="margin-top: 20px;">Thank you,<br><strong>Constructi Team</strong></p>
        </body>
        </html>
        """.formatted(user.getFname(), resetLink);

        emailService.sendHtmlEmail(user.getEmail(), "Reset your password", emailContent);
    }


    @Override
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        User user = token.getUser();
        user.setPassword(request.getNewPassword());
        userRepository.save(user);

        tokenRepository.delete(token);
    }

    //    public void logout(HttpServletRequest request) {
    //
    //    }
}
