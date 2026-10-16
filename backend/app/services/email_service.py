import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional
from app.core.config import settings

class EmailConfigurationError(Exception):
    """Raised when SMTP credentials or server settings are not configured in environment."""
    pass

class EmailDeliveryError(Exception):
    """Raised when the SMTP provider refuses or fails to accept the outgoing email."""
    pass

def is_smtp_configured() -> bool:
    """Check if mandatory SMTP configuration variables are present in environment settings."""
    return bool(
        settings.SMTP_HOST and
        settings.SMTP_PORT and
        settings.SMTP_USERNAME and
        settings.SMTP_PASSWORD
    )

def _build_html_email_template(
    title: str,
    headline: str,
    recipient_name: str,
    otp_code: str,
    expiry_minutes: int,
    subtext: str
) -> str:
    """Generate a clean, responsive enterprise HTML email with WorkHealth AI branding."""
    name_display = recipient_name if recipient_name else "Colleague"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Email Container -->
        <table role="presentation" width="100%" max-width="560px" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0F172A; padding: 28px 32px; border-bottom: 3px solid #0D9488; text-align: left;">
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em;">
                      WorkHealth <span style="color: #2DD4BF;">AI</span>
                    </div>
                    <div style="font-size: 11.5px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px;">
                      Intelligent Occupational Health & Risk Platform
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h1 style="font-size: 22px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0; letter-spacing: -0.02em;">
                {headline}
              </h1>
              
              <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
                Hello <strong>{name_display}</strong>,
              </p>

              <p style="font-size: 14.5px; line-height: 1.6; color: #475569; margin: 0 0 28px 0;">
                {subtext} Use the single-use six-digit verification code below to complete this security step:
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0;">
                <tr>
                  <td align="center" style="background-color: #F1F5F9; border: 2px dashed #0D9488; border-radius: 10px; padding: 22px 16px;">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #0F766E; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">
                      Secure Verification Code
                    </span>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #0F172A; line-height: 1;">
                      {otp_code}
                    </div>
                    <span style="font-size: 12px; color: #64748B; display: block; margin-top: 10px;">
                      ⏱️ Valid for <strong>{expiry_minutes} minutes</strong> only
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Security Information Note -->
              <div style="background-color: #F8FAFC; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="font-size: 12.5px; color: #78350F; margin: 0; line-height: 1.5;">
                  <strong>Important Security Notice:</strong> Never share this code with anyone. WorkHealth AI support will never ask for your verification code.
                </p>
              </div>

              <p style="font-size: 13px; line-height: 1.5; color: #64748B; margin: 0;">
                If you did not request this verification code or do not recognize this activity, please ignore this message. Your account remains completely secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 32px; text-align: center;">
              <p style="font-size: 11.5px; color: #94A3B8; margin: 0 0 6px 0;">
                © 2026 WorkHealth AI • Clinical Occupational Health Directorate
              </p>
              <p style="font-size: 11px; color: #CBD5E1; margin: 0;">
                This is an automated security dispatch. Please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

def _send_smtp_message(to_email: str, subject: str, html_body: str, plain_text_body: str) -> None:
    """
    Delivers a message via configured SMTP server with TLS or SSL encryption.
    Raises EmailConfigurationError if SMTP is not configured.
    Raises EmailDeliveryError if the provider fails to transmit the email.
    """
    if not is_smtp_configured():
        raise EmailConfigurationError(
            "SMTP email service is not configured in backend environment variables. "
            "Please configure SMTP_HOST, SMTP_PORT, SMTP_USERNAME, and SMTP_PASSWORD in backend/.env "
            "to deliver real emails to user inboxes."
        )

    from_addr = settings.MAIL_FROM or settings.SMTP_USERNAME
    from_header = f"{settings.MAIL_FROM_NAME} <{from_addr}>"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_header
    msg["To"] = to_email

    # Attach plain text and HTML fallback parts
    part1 = MIMEText(plain_text_body, "plain", "utf-8")
    part2 = MIMEText(html_body, "html", "utf-8")
    msg.attach(part1)
    msg.attach(part2)

    try:
        if settings.SMTP_USE_SSL:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context, timeout=12) as server:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)
        else:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=12) as server:
                if settings.SMTP_USE_TLS:
                    context = ssl.create_default_context()
                    server.starttls(context=context)
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)
    except smtplib.SMTPAuthenticationError as auth_err:
        raise EmailDeliveryError(f"SMTP Authentication failed with provider: {str(auth_err)}")
    except smtplib.SMTPRecipientsRefused:
        raise EmailDeliveryError(f"SMTP Provider rejected destination recipient '{to_email}'.")
    except smtplib.SMTPException as smtp_err:
        raise EmailDeliveryError(f"SMTP communication error: {str(smtp_err)}")
    except Exception as exc:
        raise EmailDeliveryError(f"Failed to connect or transmit email through SMTP server: {str(exc)}")

def send_verification_otp(recipient_email: str, recipient_name: str, otp_code: str) -> None:
    """Send an account registration email OTP verification message."""
    subject = "Verify your email — WorkHealth AI"
    headline = "Verify Your WorkHealth AI Account"
    subtext = (
        "Thank you for registering on the WorkHealth AI Occupational Health Platform. "
        "To ensure this account belongs to you and activate your corporate health profile, "
        "please verify your email address."
    )
    plain_text = (
        f"WorkHealth AI — Email Verification\n\n"
        f"Hello {recipient_name or 'Colleague'},\n\n"
        f"Your verification code is: {otp_code}\n\n"
        f"This code will expire in {settings.OTP_EXPIRY_MINUTES} minutes.\n"
        f"If you did not request this verification, please safely ignore this email.\n"
    )
    html = _build_html_email_template(
        title=subject,
        headline=headline,
        recipient_name=recipient_name,
        otp_code=otp_code,
        expiry_minutes=settings.OTP_EXPIRY_MINUTES,
        subtext=subtext
    )
    _send_smtp_message(recipient_email, subject, html, plain_text)

def send_password_reset_otp(recipient_email: str, recipient_name: str, otp_code: str) -> None:
    """Send a password reset security code email."""
    subject = "Password Reset Code — WorkHealth AI"
    headline = "Reset Your WorkHealth AI Password"
    subtext = (
        "We received a request to reset the password for your WorkHealth AI account. "
        "Enter the verification code below on the password reset screen to set a new password."
    )
    plain_text = (
        f"WorkHealth AI — Password Reset\n\n"
        f"Hello {recipient_name or 'Colleague'},\n\n"
        f"Your password reset verification code is: {otp_code}\n\n"
        f"This code will expire in {settings.OTP_EXPIRY_MINUTES} minutes.\n"
        f"If you did not request a password reset, your account is still secure. You can safely ignore this email.\n"
    )
    html = _build_html_email_template(
        title=subject,
        headline=headline,
        recipient_name=recipient_name,
        otp_code=otp_code,
        expiry_minutes=settings.OTP_EXPIRY_MINUTES,
        subtext=subtext
    )
    _send_smtp_message(recipient_email, subject, html, plain_text)

def send_trainer_invitation_otp(recipient_email: str, recipient_name: str, otp_code: str, inviter_name: str = "WorkHealth Administrator") -> None:
    """Send an invitation email to an authorized Trainer with an activation OTP."""
    subject = "Trainer Invitation & Activation — WorkHealth AI"
    headline = "Authorized Trainer Account Invitation"
    subtext = (
        f"You have been invited by {inviter_name} to join the WorkHealth AI platform as an "
        "Accredited Occupational Health Trainer & Clinical Specialist. "
        "Use the activation code below to verify your email and set your account password."
    )
    plain_text = (
        f"WorkHealth AI — Trainer Account Invitation\n\n"
        f"Hello {recipient_name or 'Specialist'},\n\n"
        f"You have been invited by {inviter_name} as an Occupational Health Trainer.\n"
        f"Your account activation code is: {otp_code}\n\n"
        f"This code will expire in {settings.OTP_EXPIRY_MINUTES} minutes.\n"
    )
    html = _build_html_email_template(
        title=subject,
        headline=headline,
        recipient_name=recipient_name,
        otp_code=otp_code,
        expiry_minutes=settings.OTP_EXPIRY_MINUTES,
        subtext=subtext
    )
    _send_smtp_message(recipient_email, subject, html, plain_text)
