import { toTitleCase } from "./util";

export const getPasswordResetTemplate = (url: string) => ({
  subject: "Password Reset Request",
  text: `You requested a password reset. Click on the link to reset your password: ${url}`,
  html: `<!doctype html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><title>Reset Password Email Template</title><meta name="description" content="Reset Password Email Template."><style type="text/css">a:hover{text-decoration:underline!important}</style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><!--100%body table--><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;"><tr><td><table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td style="height:80px;">&nbsp;</td></tr><tr><td style="text-align:center;"></a></td></tr><tr><td style="height:20px;">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"><tr><td style="height:40px;">&nbsp;</td></tr><tr><td style="padding:0 35px;"><h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have requested to reset your password</h1><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.</p><a target="_blank" href="${url}" style="background:#2f89ff;text-decoration:none !important; font-weight:500; margin-top:24px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a></td></tr><tr><td style="height:40px;">&nbsp;</td></tr></table></td><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="text-align:center;"><p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy;</p></td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table><!--/100%body table--></body></html>`,
});

export const getVerifyEmailTemplate = (url: string) => ({
  subject: "Verify Email Address",
  text: `Click on the link to verify your email address: ${url}`,
  html: `<!doctype html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><title>Verify Email Address Email Template</title><meta name="description" content="Verify Email Address Email Template."><style type="text/css">a:hover{text-decoration:underline!important}</style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><!--100%body table--><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;"><tr><td><table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td style="height:80px;">&nbsp;</td></tr><tr><td style="text-align:center;"></a></td></tr><tr><td style="height:20px;">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"><tr><td style="height:40px;">&nbsp;</td></tr><tr><td style="padding:0 35px;"><h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Please verify your email address</h1><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Click on the following link to verify your email address.</p><a target="_blank" href="${url}" style="background:#2f89ff;text-decoration:none !important; font-weight:500; margin-top:24px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Email Address</a></td></tr><tr><td style="height:40px;">&nbsp;</td></tr></table></td><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="text-align:center;"><p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy;</p></td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table><!--/100%body table--></body></html>`,
});

export const getBookingSuccessEmailTemplate = (
  referenceCode: string,
  customerName: string,
  dateTime: string,
  services: string[],
  bookingStatus?: string,
  userMessage?: string | null,
  status?: string,
  message?: string | null
) => ({
  subject: "Booking Confirmation - Twin CJ Riverside Glamping Resort ",
  text: `Dear ${customerName},

Thank you for booking your stay with Twin CJ Riverside Glamping Resort. We are looking forward to your visit.

Your reference code for your booking is: ${referenceCode} 

If you have any questions please don't hesitate to contact us.

We hope you enjoy your stay with us!

Best Regards,

Twin CJ Riverside Glamping Resort`,
  html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 80%;
        max-width: 600px;
        margin: 20px auto;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #2c3e50;
      }
      p {
        color: #555;
        line-height: 1.6;
      }

      .details {
        background-color: #f5f5f5; /* Light gray background */
        color: #555;
        font-size: 0.95em;
        padding: 3px 1rem;
        border-radius: 4px;
      }

      .details > p > b {
        margin-right: 5px;
      }

      .reference {
        font-size: 18px;
        font-weight: bold;
        color: #d35400;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #777;
        text-align: center;
      }
      .contact-link {
        color: #3498db;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Booking Confirmation</h2>
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>
        Thank you for booking your stay with
        <strong>Twin CJ Riverside Glamping Resort</strong>. We are looking
        forward to your visit.
      </p>
      <p>Booking Details:</p>
      <div class="details">
        <p><b>Reference Code:</b><span class="reference">${referenceCode}</span></p>
        <p><b>Date and Time:</b>${dateTime}</p>
        <p><b>Service/s:</b></p>
        <ul>
        ${services.map((service) => `<li>${service}</li>`)}
        </ul>
      </div>
      <p>
        If you have any questions, please don't hesitate to
        <a href="mailto:twincj.riversideresort@gmail.com" class="contact-link"
          >contact us</a
        >.
      </p>
      <p>We hope you enjoy your stay with us!</p>
      <p>Best Regards,</p>
      <p><strong>Twin CJ Riverside Glamping Resort</strong></p>
      <div class="footer">
        <p>
          &copy; 2025 Twin CJ Riverside Glamping Resort. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
`,
});

export const getBookingApprovedEmailTemplate = (
  referenceCode: string,
  customerName: string,
  dateTime: string,
  services: string[],
  bookingStatus?: string
) => ({
  subject: "Booking Approved - Twin CJ Riverside Glamping Resort",
  text: `Dear ${customerName},

Great news! Your booking with Twin CJ Riverside Glamping Resort has been approved. We’re excited to welcome you!

Booking Details:
Reference Code: ${referenceCode}
Date: ${dateTime}
Services:
${services.map((service) => `- ${service}`).join("\n")}
${bookingStatus ? `Status: ${bookingStatus}` : ""}

If you have any questions or need assistance, please contact us at twincj.riversideresort@gmail.com.

We look forward to your visit!

Best Regards,
Twin CJ Riverside Glamping Resort`,
  html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Approved</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { width: 80%; max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
      h2 { color: #2c3e50; }
      p { color: #555; line-height: 1.6; }
      .details { background-color: #f5f5f5; color: #555; font-size: 0.95em; padding: 3px 1rem; border-radius: 4px; }
      .details > p > b { margin-right: 5px; }
      .reference { font-size: 18px; font-weight: bold; color: #d35400; }
      .footer { margin-top: 20px; font-size: 14px; color: #777; text-align: center; }
      .contact-link { color: #3498db; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Booking Approved</h2>
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>Great news! Your booking with <strong>Twin CJ Riverside Glamping Resort</strong> has been approved. We’re excited to welcome you!</p>
      <p>Booking Details:</p>
      <div class="details">
        <p><b>Reference Code:</b><span class="reference">${referenceCode}</span></p>
        <p><b>Date and Time:</b>${dateTime}</p>
        <p><b>Service/s:</b></p>
        <ul>${services.map((service) => `<li>${service}</li>`).join("")}</ul>
        ${bookingStatus ? `<p><b>Status:</b> ${bookingStatus}</p>` : ""}
    
      </div>
      <p>If you have any questions or need assistance, please don’t hesitate to <a href="mailto:twincj.riversideresort@gmail.com" class="contact-link">contact us</a>.</p>
      <p>We look forward to your visit!</p>
      <p>Best Regards,</p>
      <p><strong>Twin CJ Riverside Glamping Resort</strong></p>
      <div class="footer">
        <p>© 2025 Twin CJ Riverside Glamping Resort. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`,
});

export const getBookingCancelledEmailTemplate = (
  referenceCode: string,
  customerName: string,
  dateTime: string,
  services: string[],
  bookingStatus?: string,
  userMessage?: string | null
) => ({
  subject: "Booking Cancellation - Twin CJ Riverside Glamping Resort",
  text: `Dear ${customerName},

We regret to inform you that your booking with Twin CJ Riverside Glamping Resort has been cancelled.

Booking Details:
Reference Code: ${referenceCode}
Date: ${dateTime}
Services:
${services.map((service) => `- ${service}`).join("\n")}
${bookingStatus ? `Status: ${bookingStatus}` : ""}
${userMessage ? `\nReason for Cancellation: ${userMessage}` : ""}

If you have any questions or concerns, please don't hesitate to contact us at twincj.riversideresort@gmail.com.

We hope to serve you again in the future.

Best Regards,
Twin CJ Riverside Glamping Resort`,
  html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Cancellation</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { width: 80%; max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
      h2 { color: #2c3e50; }
      p { color: #555; line-height: 1.6; }
      .details { background-color: #f5f5f5; color: #555; font-size: 0.95em; padding: 3px 1rem; border-radius: 4px; }
      .details > p > b { margin-right: 5px; }
      .reference { font-size: 18px; font-weight: bold; color: #d35400; }
      .footer { margin-top: 20px; font-size: 14px; color: #777; text-align: center; }
      .contact-link { color: #3498db; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Booking Cancellation</h2>
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>We regret to inform you that your booking with <strong>Twin CJ Riverside Glamping Resort</strong> has been cancelled.</p>
      <p>Booking Details:</p>
      <div class="details">
        <p><b>Reference Code:</b><span class="reference">${referenceCode}</span></p>
        <p><b>Date and Time:</b>${dateTime}</p>
        <p><b>Service/s:</b></p>
        <ul>${services.map((service) => `<li>${service}</li>`).join("")}</ul>
        ${bookingStatus ? `<p><b>Status:</b> ${bookingStatus}</p>` : ""}
        ${
          userMessage
            ? `<p><b>Reason for Cancellation:</b> ${userMessage}</p>`
            : ""
        }
      </div>
      <p>If you have any questions or concerns, please don't hesitate to <a href="mailto:twincj.riversideresort@gmail.com" class="contact-link">contact us</a>.</p>
      <p>We hope to serve you again in the future.</p>
      <p>Best Regards,</p>
      <p><strong>Twin CJ Riverside Glamping Resort</strong></p>
      <div class="footer">
        <p>© 2025 Twin CJ Riverside Glamping Resort. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`,
});

export const getBookingRescheduledEmailTemplate = (
  referenceCode: string,
  customerName: string,
  dateTime: string,
  services: string[],
  bookingStatus?: string,
  userMessage?: string | null
) => ({
  subject: "Booking Rescheduled - Twin CJ Riverside Glamping Resort",
  text: `Dear ${customerName},

Your booking with Twin CJ Riverside Glamping Resort has been rescheduled. Please review the updated details below.

Booking Details:
Reference Code: ${referenceCode}
New Date: ${dateTime}
Services:
${services.map((service) => `- ${service}`).join("\n")}
${bookingStatus ? `Status: ${bookingStatus}` : ""}
${userMessage ? `\nReason for Rescheduling: ${userMessage}` : ""}

If you have any questions or need further assistance, please contact us at twincj.riversideresort@gmail.com.

We look forward to welcoming you!

Best Regards,
Twin CJ Riverside Glamping Resort`,
  html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Rescheduled</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { width: 80%; max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
      h2 { color: #2c3e50; }
      p { color: #555; line-height: 1.6; }
      .details { background-color: #f5f5f5; color: #555; font-size: 0.95em; padding: 3px 1rem; border-radius: 4px; }
      .details > p > b { margin-right: 5px; }
      .reference { font-size: 18px; font-weight: bold; color: #d35400; }
      .footer { margin-top: 20px; font-size: 14px; color: #777; text-align: center; }
      .contact-link { color: #3498db; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Booking Rescheduled</h2>
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>Your booking with <strong>Twin CJ Riverside Glamping Resort</strong> has been rescheduled. Please review the updated details below.</p>
      <p>Booking Details:</p>
      <div class="details">
        <p><b>Reference Code:</b><span class="reference">${referenceCode}</span></p>
        <p>You may reschedule your preferred date—up to one month in advance—through the Booking Status page or by contacting the administrators directly.</p>
        <p><b>Service/s:</b></p>
        <ul>${services.map((service) => `<li>${service}</li>`).join("")}</ul>
        ${bookingStatus ? `<p><b>Status:</b> ${bookingStatus}</p>` : ""}
        ${
          userMessage
            ? `<p><b>Reason for Rescheduling:</b> ${userMessage}</p>`
            : ""
        }
      </div>
      <p>If you have any questions or need further assistance, please don't hesitate to <a href="mailto:twincj.riversideresort@gmail.com" class="contact-link">contact us</a>.</p>
      <p>We look forward to welcoming you!</p>
      <p>Best Regards,</p>
      <p><strong>Twin CJ Riverside Glamping Resort</strong></p>
      <div class="footer">
        <p>© 2025 Twin CJ Riverside Glamping Resort. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`,
});

interface FeedbackEmailTemplateParams {
  fullName: string;
  email: string;
  inquiryType: string;
  contactNumber: string;
  message: string;
}

export const getFeedbackEmailTemplate = (
  data: FeedbackEmailTemplateParams
) => ({
  subject: "New Feedback Received",
  text: `New Feedback Received

Full Name: ${data.fullName}
Email: ${data.email}
Inquiry Type: ${data.inquiryType}
Contact Number: ${data.contactNumber}
Message: ${data.message}`,
  html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Feedback Received</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin: auto;
      }
      h2 {
        color: #333;
      }
      p {
        font-size: 16px;
        color: #555;
      }
      .feedback-box {
        background: #f9f9f9;
        padding: 15px;
        border-left: 4px solid #007bff;
        margin-top: 10px;
        border-radius: 5px;
      }
      .footer {
        font-size: 12px;
        text-align: center;
        color: #888;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>New Feedback Received</h2>
      <p><strong>Full Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Inquiry Type:</strong> ${data.inquiryType}</p>
      <p><strong>Contact Number:</strong> ${data.contactNumber}</p>
      <p><strong>Message:</strong></p>
      <div class="feedback-box">
        <p>${data.message}</p>
      </div>
      <p class="footer">
        This email was automatically generated by your website feedback form.
      </p>
    </div>
  </body>
</html>`,
});

export const getBookingCompleteEmailTemplate = (
  referenceCode: string,
  fullName: string
) => ({
  subject:
    "We’d Love to Hear About Your Recent Stay at Twin CJ Riverside Glamping Resort!",
  text: `Hi ${toTitleCase(fullName)},  

We hope you had a wonderful and refreshing time at Twin CJ Riverside Glamping Resort! It was truly our pleasure to have you as our guest, and we’d love to hear about your experience.

Your feedback helps us grow and improve, so we’d be grateful if you could take a minute to share your thoughts.

👉 Click here to leave your feedback

It’s quick and easy — and your insights help us create even better experiences for future guests.

Thank you again for choosing us for your glamping getaway. We look forward to welcoming you back soon!

Warm regards,  
Twin CJ Riverside Glamping Resort  
📍 Norzagaray, Bulacan  
📞 0917 559 9237  
📧 twincj.riversideresort@gmail.com`,

  html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>We’d Love to Hear About Your Recent Stay!</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { width: 80%; max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
      h2 { color: #2c3e50; }
      p { color: #555; line-height: 1.6; }
      .details { background-color: #f5f5f5; color: #555; font-size: 0.95em; padding: 3px 1rem; border-radius: 4px; }
      .details > p > b { margin-right: 5px; }
      .footer { margin-top: 20px; font-size: 14px; color: #777; text-align: center; }
      .contact-link { color: #3498db; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>We’d Love to Hear About Your Recent Stay!</h2>
      <p>Hi ${toTitleCase(fullName)},</p>
      <p>We hope you had a wonderful and refreshing time at Twin CJ Riverside Glamping Resort! It was truly our pleasure to have you as our guest, and we’d love to hear about your experience.</p>
      <p>Your feedback helps us grow and improve, so we’d be grateful if you could take a minute to share your thoughts.</p>
      <p><strong>👉 <a href="localhost:3000/feedback/${referenceCode}">Click here to leave your feedback</a></strong></p>
      <p>It’s quick and easy — and your insights help us create even better experiences for future guests.</p>
      <p>Thank you again for choosing us for your glamping getaway. We look forward to welcoming you back soon!</p>
      <p>Warm regards,</p>
      <p><strong>Twin CJ Riverside Glamping Resort</strong></p>
      <div class="footer">
        <p>📍 Norzagaray, Bulacan</p>
        <p>📞 0917 559 9237</p>
        <p>📧 <a href="mailto:twincj.riversideresort@gmail.com" class="contact-link">twincj.riversideresort@gmail.com</a></p>
        <p>© 2025 Twin CJ Riverside Glamping Resort. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`,
});

export const getOTPEmailTemplate = (otp: string) => ({
  subject: "Your One-Time Pin (OTP) - Twin CJ Riverside Glamping Resort",
  text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your OTP Code</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 80%;
        max-width: 600px;
        margin: 20px auto;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #2c3e50;
      }
      p {
        color: #555;
        line-height: 1.6;
      }
      .otp {
        font-size: 24px;
        font-weight: bold;
        color: #d35400;
        text-align: center;
        margin: 20px 0;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Your One-Time Password (OTP)</h2>
      <p>
        Use the following OTP to complete your verification. This OTP is valid
        for 5 minutes.
      </p>
      <div class="otp">${otp}</div>
      <p>
        If you did not request this OTP, please ignore this email or contact
        support.
      </p>
      <div class="footer">
        <p>&copy; 2025 Twin CJ Riverside Glamping Resort. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`,
});
