package com.constructi.service;
import com.constructi.DTO.ForgotPasswordRequest;
import com.constructi.DTO.ResetPasswordRequest;


public interface PasswordService {

    public void sendResetPasswordEmail(String email);
    public void resetPassword(ResetPasswordRequest request);
//    public void logout(HttpServletRequest request);

}