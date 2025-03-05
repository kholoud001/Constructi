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
import org.springframework.security.crypto.password.PasswordEncoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;



import org.springframework.beans.factory.annotation.Value;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PasswordServiceImpl implements PasswordService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;


    @Value("${app.resetPasswordLink}")
    private String resetPasswordLink;

    @Override
    public void sendResetPasswordEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PasswordResetToken token = new PasswordResetToken(user);
        tokenRepository.save(token);

        String resetLink = String.format("%s?token=%s&email=%s",
                resetPasswordLink,
                token.getToken(),
                URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8)
        );

        String emailContent = """
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Your Password</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Arial, sans-serif;
                            background-color: #f7f7f7;
                            margin: 0;
                            padding: 0;
                            text-align: center;
                            color: #333;
                        }
                        .container {
                            max-width: 500px;
                            margin: 40px auto;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        }
                        .logo {
                            width: 80px;
                            margin-bottom: 20px;
                        }
                        h2 {
                            color: #004aad;
                            margin-bottom: 10px;
                        }
                        p {
                            font-size: 16px;
                            line-height: 1.5;
                            margin: 10px 0;
                        }
                        .btn-container {
                            margin: 20px 0;
                        }
                        .btn-reset {
                            display: inline-block;
                            background-color: #004aad;
                            color: white;
                            padding: 12px 24px;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            transition: background-color 0.3s;
                        }
                        .btn-reset:hover {
                            background-color: #003a8c;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 14px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <img src="https://media-hosting.imagekit.io//6a2add728e6e44d0/logo-black.png?Expires=1835622901&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=bBxCKQPMzfwgT8unST5rHsIifcRRIK3EnjtU8CS0kMNtN69IdALPdrWqRRdOLiDSHPLcxNSzNLZS4OPrNayTcmBUzB~5W0IkGsXK5L3E8wnAbhLhfnu3S2hukRJL~XpKoZUvX~L~fmob5fUw5jrmYsvH2~hhnqu2tvuiMfclnuQF2g8g2KQNFIBJPfMZTeOlyk06eRRRv00rbnB6LOwlLEIWkRQi2rFaEO1KSxb~sNVG62ica2mCsvMNozqBwjTWzortH1icmlhE9m72HwRabjO6CAexLd7-dgbjlofeFmG2SgDGmahh2F73Q7w4jfpGvT8EHcfwifbeXkfW2JCOlA__" alt="Construction Icon" class="logo">
                        <h2>Reset Your Password</h2>
                        <p>Hello %s,</p>
                        <p>You requested to reset your password. Click the button below to proceed:</p>
                        <div class="btn-container">
                            <a href="%s" class="btn-reset">Reset Password</a>
                        </div>
                        <p>If you did not request this, you can ignore this email.</p>
                        <div class="footer">
                            <p>Thank you,<br><strong>Constructi Team</strong></p>
                            <p>&copy; 2025 Constructi. All rights reserved.</p>
                        </div>
                    </div>
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

        String hashedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(hashedPassword);

        userRepository.save(user);
        tokenRepository.delete(token);
    }

    //    public void logout(HttpServletRequest request) {
    //
    //    }
}
