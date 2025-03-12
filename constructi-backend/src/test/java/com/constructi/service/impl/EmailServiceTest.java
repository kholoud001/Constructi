package com.constructi.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    private MimeMessage mimeMessage;

    @BeforeEach
    void setUp() {
        mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    void sendHtmlEmail_Success() throws MessagingException {
        doNothing().when(mailSender).send(any(MimeMessage.class));

        emailService.sendHtmlEmail("test@example.com", "Test Subject", "<h1>HTML Content</h1>");

        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendHtmlEmail_Failure() throws Exception {
        doThrow(new MessagingException("Email sending failed"))
                .when(mimeMessage)
                .setContent(anyString(), anyString());

        assertThrows(RuntimeException.class, () ->
                emailService.sendHtmlEmail("test@example.com", "Test Subject", "<h1>HTML Content</h1>"));
    }

}
