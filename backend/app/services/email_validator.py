import re
from typing import Tuple
from email_validator import validate_email as validate_rfc_email, EmailNotValidError

# RFC 2606 & RFC 6761 Reserved test domains + known fictitious domains
RESERVED_TEST_DOMAINS = {
    "example.com",
    "example.org",
    "example.net",
    "example.edu",
    "test.com",
    "test.org",
    "test.net",
    "fake.com",
    "invalid",
    "localhost",
    "sample.com",
    "domain.com"
}

# Common disposable / temporary throwaway email provider domains
DISPOSABLE_EMAIL_DOMAINS = {
    "mailinator.com",
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "trashmail.com",
    "sharklasers.com",
    "yopmail.com",
    "getairmail.com",
    "throwawaymail.com",
    "dispostable.com",
    "temp-mail.org",
    "fakemailgenerator.com",
    "maildrop.cc",
    "inboxkitten.com",
    "burnermail.io",
    "mohmal.com",
    "crazymailing.com",
    "mytemp.email",
    "emailondeck.com",
    "tempmailo.com",
    "tmpmail.net",
    "generator.email",
    "trashmail.net",
    "nada.ltd",
    "getnada.com"
}

# Known placeholder / mock local parts
RESERVED_LOCAL_PARTS = {
    "test",
    "fake",
    "dummy",
    "sample",
    "placeholder",
    "demo",
    "nobody",
    "noreply",
    "no-reply"
}

# Explicit placeholder combinations
RESERVED_EXACT_EMAILS = {
    "test@example.com",
    "user@example.com",
    "admin@example.com",
    "abc@fake.com",
    "test@test.com",
    "demo@demo.com",
    "user@test.com",
    "admin@test.com"
}

def normalize_email(email: str) -> str:
    """Consistently trim and lower-case email addresses."""
    if not email:
        return ""
    return email.strip().lower()

def validate_workhealth_email(email: str) -> Tuple[bool, str, str]:
    """
    Validates an email address against strict occupational health standards.
    Returns: (is_valid: bool, normalized_email: str, error_message: str)
    
    Note:
    Syntax validation confirms proper RFC format and domain structure, but syntax
    alone cannot guarantee an email inbox physically exists. Proof of ownership
    requires delivering a real cryptographically secure OTP to the address.
    """
    if not email or not isinstance(email, str):
        return False, "", "Email address is required."

    cleaned = normalize_email(email)

    if len(cleaned) < 6 or len(cleaned) > 254:
        return False, "", "Email length must be between 6 and 254 characters."

    # Reject known hardcoded placeholder email combos
    if cleaned in RESERVED_EXACT_EMAILS:
        return False, "", "Placeholder and mock email addresses (e.g., test@example.com) are not allowed. Please enter your authentic work or personal email address."

    # Verify at-sign structure
    if "@" not in cleaned:
        return False, "", "Invalid email format: missing '@' separator."

    parts = cleaned.split("@")
    if len(parts) != 2:
        return False, "", "Invalid email format: must contain exactly one '@' separator."

    local_part, domain = parts[0], parts[1]

    if not local_part or not domain:
        return False, "", "Email must include both a local username and a valid domain."

    if "." not in domain:
        return False, "", "Invalid email format: domain must contain a valid top-level domain extension (e.g., .com, .org, .edu, .io)."

    # Reject placeholder usernames on test domains
    if local_part in RESERVED_LOCAL_PARTS and domain in RESERVED_TEST_DOMAINS:
        return False, "", "Placeholder test accounts are prohibited. Please provide a genuine email inbox."

    # Check reserved test domains
    if domain in RESERVED_TEST_DOMAINS:
        return False, "", f"The domain '{domain}' is a reserved RFC testing domain and cannot receive real emails. Please use an authentic domain."

    # Check disposable / temporary email services
    if domain in DISPOSABLE_EMAIL_DOMAINS:
        return False, "", f"Disposable and temporary email providers ('{domain}') are not permitted for security and compliance reasons. Please use your standard workplace or personal email."

    # Deep RFC 5322 & DNS syntax validation via email-validator library
    try:
        validation_result = validate_rfc_email(cleaned, check_deliverability=False)
        normalized = validation_result.normalized
    except EmailNotValidError as e:
        return False, "", f"Invalid email format: {str(e)}"

    return True, normalized, ""
