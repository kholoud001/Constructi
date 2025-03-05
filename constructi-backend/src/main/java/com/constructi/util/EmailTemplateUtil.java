package com.constructi.util;

public class EmailTemplateUtil {

    public static String generateCredentialsEmail(String firstName, String email, String password, String loginUrl) {
        return """
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { text-align: center; padding: 20px 0; }
                .logo { width: 100px; height: auto; margin-bottom: 15px; }
                h2 { color: #2563eb; margin-top: 0; font-weight: 600; }
                .content { padding: 20px; }
                .credentials-box { background-color: #f0f7ff; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563eb; }
                .btn-container { text-align: center; margin: 30px 0; }
                .btn-login { display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 500; transition: background-color 0.3s; }
                .btn-login:hover { background-color: #1d4ed8; }
                .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; margin-top: 20px; color: #666; font-size: 14px; }
                p { margin: 10px 0; }
                strong { color: #333; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://media-hosting.imagekit.io//6a2add728e6e44d0/logo-black.png?Expires=1835622901&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=bBxCKQPMzfwgT8unST5rHsIifcRRIK3EnjtU8CS0kMNtN69IdALPdrWqRRdOLiDSHPLcxNSzNLZS4OPrNayTcmBUzB~5W0IkGsXK5L3E8wnAbhLhfnu3S2hukRJL~XpKoZUvX~L~fmob5fUw5jrmYsvH2~hhnqu2tvuiMfclnuQF2g8g2KQNFIBJPfMZTeOlyk06eRRRv00rbnB6LOwlLEIWkRQi2rFaEO1KSxb~sNVG62ica2mCsvMNozqBwjTWzortH1icmlhE9m72HwRabjO6CAexLd7-dgbjlofeFmG2SgDGmahh2F73Q7w4jfpGvT8EHcfwifbeXkfW2JCOlA__" 
                    alt="Constructi Logo" class="logo">
                    <h2>Welcome to Constructi</h2>
                </div>
                <div class="content">
                    <p>Hello %s,</p>
                    <p>Your account has been created by the admin. Here are your login credentials:</p>
                    
                    <div class="credentials-box">
                        <p><strong>Email:</strong> %s</p>
                        <p><strong>Password:</strong> %s</p>
                    </div>
                    
                    <p>Please log in and change your password within an hour after your first login for security reasons.</p>
                    
                    <div class="btn-container">
                        <a href="%s" class="btn-login">Login to Your Account</a>
                    </div>
                    
                    <p>If you have any questions, please contact our support team.</p>
                </div>
                <div class="footer">
                    <p>Thank you,<br><strong>Constructi Team</strong></p>
                    <p>&copy; 2025 Constructi. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(firstName, email, password, loginUrl);
    }
}