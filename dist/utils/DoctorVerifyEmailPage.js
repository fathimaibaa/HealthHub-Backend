"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorVerifyEmailPage = void 0;
const doctorVerifyEmailPage = (name, token) => {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Add your custom styles here */
          /* Example styles */
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
      
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
      
          h1, h2 {
            color: #333;
            margin-bottom: 20px;
          }
      
          p {
            color: #666;
            margin-bottom: 10px;
          }
      
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #D8BFD8; /* Light purple color */
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s ease;
          }
          
          .button:hover {
            background-color: #D8BFD8; /* Slightly darker green color on hover */
          }
          
      
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #888;
          }
      
          .footer a {
            color: #007bff;
            text-decoration: none;
          }
      
          @media screen and (max-width: 600px) {
            .container {
              padding: 10px;
            }
            .button {
              display: block;
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
      
        <div class="container">
          <h1>Welcome to HealthHUb</h1>
          <p>Dear ${name},</p>
          <p>We are thrilled to have you join our platform. Your are now part of the HealthHub family</p>
          <p>To get started, please confirm your email address by clicking the button below:</p>
          <a href=https://health-hub-frontend.vercel.app//doctor/verify-token/${token} class="button" target="_blank">Confirm Email</a>
        
          <p>If you didn't sign up for an account on HealthHub, you can disregard this email.</p>
          <div class="footer">
            <p>Best regards,<br>HealthHub Team</p>
            <p><a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a></p>
          </div>
        </div>    
      </body>
      </html>
      `;
};
exports.doctorVerifyEmailPage = doctorVerifyEmailPage;
